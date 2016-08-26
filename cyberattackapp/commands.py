import paramiko, json, requests, time
from datetime import datetime, timedelta
from django.utils import timezone
from django.conf import settings
from .services import CyberAttackService, TargetService
from threading import Thread


class GetAttacksCommand(object):
    """
    Command class for retrieving cyber attacks from the database.
    """
    def __init__(self, **filter_args):
        """
        Initialize a new GetAttacksCommand instance.

        :param filter_args: Arguments for filtering attack model query.
        :type filter_args: dict
        """
        self.cyber_attack_service = CyberAttackService()
        self.update_attacks_command = AttackUpdateCommand()
        self.filter = filter_args.copy()
        self.filter.pop('format', None)

    def execute(self):
        """
        Execute the command.

        :return: All the CyberAttacks in the database.
        """
        try:
            self.update_attacks_command.execute()
            return self.cyber_attack_service.list_models(**self.filter)
        except AttributeError:
            return self.cyber_attack_service.none()


class GenerateAttacksCommand(object):
    """
    Temporary class for generating cyber attacks to populate the database.
    """
    def __init__(self):
        self.cyber_attack_service = CyberAttackService()
        self.t = Thread(target=self._generate_attacks)

    def execute(self):
        self.t.start()

    def _generate_attacks(self):
        while True:
            attacker_lat_lngs = [(44.389661, -70.471819), (45.246879, -70.164202), (44.812069, -68.939226),
                        (44.913302, -67.950457), (46.262518, -68.763445)]
            target_lat_lngs = [(43.643058, -70.257585), (43.643058, -70.257585), (43.643058, -70.257585),
                               (43.643058, -70.257585), (43.643058, -70.257585)]

            timestamp_generator = self._generate_timestamps()
            for j in range(5):
                timestamp = next(timestamp_generator)
                attacker_lat_lng = attacker_lat_lngs[j]
                target_lat_lng = target_lat_lngs[j]

                self.cyber_attack_service.create_model(timestamp=timestamp,
                                                       attacker_latitude=attacker_lat_lng[0],
                                                       attacker_longitude=attacker_lat_lng[1],
                                                       attacker_location='Burger King',
                                                       target_latitude=target_lat_lng[0],
                                                       target_longitude=target_lat_lng[1],
                                                       target_location='McDonalds',
                                                       attacker_ip='127.0.0.{0}'.format(j),
                                                       service='SSH',
                                                       port=42)

            time.sleep(50)

    def _generate_timestamps(self):
        """
        Temporary method for testing timestamps.
        """
        curr_time = datetime.now(tz=timezone.get_current_timezone())
        curr_time = curr_time - timedelta(minutes=1)
        while True:
            curr_time = curr_time + timedelta(seconds=10)
            yield curr_time


class AttackPullCommand(object):
    """
    A Command class for gathering attack data, being served by remote machines.

    Gathers
    """
    def __init__(self, minutes=2):
        self.client = paramiko.SSHClient()
        self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.client.connect(settings.SO_DB_SERVER_IP, 22, username='reports', password='v1d4l14')
        self.minutes = minutes

    def execute(self):
        timenow = datetime.utcfromtimestamp(time.time())
        tdelta = timedelta(minutes=self.minutes)
        twominago = (timenow - tdelta).strftime('%Y-%m-%d %H:%M:00')

        querystr = ' '.join(["192.168.56.103", "class=SNORT", "start:'" + twominago + "'"])

        commandstr = 'perl /opt/elsa/contrib/securityonion/contrib/cli.sh "' + querystr + '" | jq .'

        si, so, se = self.client.exec_command(commandstr)
        cleanoutput = ''

        for line in so.readlines():
            line.strip()
            cleanoutput += line

        return json.loads(cleanoutput)


class PopulateTargetsCommand(object):

    def __init__(self):
        self.target_service = TargetService()

    def execute(self):
        for h in settings.HONEYPOTS:
            if not self.target_service.get_model(ip=h['ip']):
                self.target_service.create_model(**h)


class AttackUpdateCommand(object):
    """
    A parser, for use with attack data gathered by the AttackPullCommand() class.
    """

    def __init__(self, minutes=2):
        """
        Initialize a CyberAttackService instance, an AttackPullCommand instance, and a Thread.

        CyberAttackService instance should be persistent throughout app lifetime.
        AttackPullCommand instance will be called from within a program loop.
        """
        self.cyber_attack_service = CyberAttackService()
        self.attack_pull_command = AttackPullCommand(minutes=minutes)
        self.target_service = TargetService()
        self.populate_targets_command = PopulateTargetsCommand()
        self.populate_targets_command.execute()

    def execute(self):
        """
        Parses attack data from AttackPullCommand and updates a CyberAttack model with it.
        """
        # Clear all CyberAttack models, and populate a dict with ELSA data from AttackPullCommand

        attacks_json_dict = self.attack_pull_command.execute()
        # Output formatted dictionary, will serve as the **kwargs parameter
        # to the create_model() call for CyberAttackService, at the end of the method.

        out_dict = {}

        # Keys -> ELSA format : Values -> CyberBlip format
        useful_fields = {'srcip':'attacker_ip',
                         'srcport':'attacker_port',
                         'dstport':'target_port'}

        # Opens up the dictionary and extracts what is needed.
        # 'results' is what ELSA calls the list of attacks,
        # meaning this loop is an iteration for each attack.
        for r in attacks_json_dict['results']:

            # Timestamp is the first field extracted.
            out_dict['timestamp'] = datetime.utcfromtimestamp(float(r['timestamp'])).strftime('%Y-%m-%d %H:%M:00')
            out_dict['id'] = r['id']
            if self.cyber_attack_service.get_model(id=out_dict['id']):
                continue
            # The '_fields' label, under which ELSA has organized the attack-relevant data,
            # is searched for fields relevant to CyberBlip.
            # Format, as well as name changes have to be made for these field labels, as
            # ELSA uses a more complex representation than a single key, value pair.
            for f in r['_fields']:
                if f['field'] == 'dstip':
                    out_dict['target'] = self.target_service.get_model(ip=f['value'])
                elif f['field'] in useful_fields:
                    out_dict[useful_fields[f['field']]] = f['value']

            # Query freegeoip.net's RESTful API for location data based on IP
            fgip_dict = json.loads(requests.get('https://freegeoip.net/json/'+out_dict['attacker_ip']).text)

            # Copy longitude and latitude to the output dictionary.
            out_dict['attacker_latitude'] = fgip_dict['latitude']
            out_dict['attacker_longitude'] = fgip_dict['longitude']

            # Try to pull location data from freegeoip.net json
            if fgip_dict['city'] and fgip_dict['region_code'] and fgip_dict['country_code']:
                city = fgip_dict['city']
                region_code = fgip_dict['region_code']
                country_code = fgip_dict['country_code']
            # If geo data is missing, do a reverse geocode lookup on the latlong.
            else:
                city, region_code, country_code = \
                    GoogleMapsReverseGeoCodingAPICommand(out_dict['attacker_latitude'],
                                                         out_dict['attacker_longitude']).execute()

            # If we have a fully qualified location.
            if city and region_code and country_code:
                # Format to US standard: 'city, region_code, country_code'
                if country_code == 'US':
                    out_dict['attacker_location'] = "{}, {}, {}".format(city, region_code, country_code)
                # Format to international standard: 'city, country_code'
                else:
                    out_dict['attacker_location'] = "{}, {}".format(city, country_code)
            # Otherwise, discard and continue onto the next attack.
            else:
                out_dict['attacker_location'] = 'mars'
                out_dict['attacker_longitude'] = '-70.257585'
                out_dict['attacker_latitude'] = '43.643058'

            # Stub variable for the service, as it is implemented on the front end, but not yet the back end.
            out_dict['service'] = 'unknown'

            # Add the fully qualified CyberAttack to the models, and clear the dictionary for the next attack.
            self.cyber_attack_service.create_model(**out_dict)
            out_dict.clear()


class GoogleMapsReverseGeoCodingAPICommand(object):
    """
    Command for using Google Maps Reverse GeoCoding API"
    """

    def __init__(self, lat, lon):
        """
        Initialize a new GoogleMapsReverseGeoCodingAPICommand instance.
        @param lat: The latitude to reverse look up
        @param lon: The longitude to reverse look up
        """
        self.__lat = lat
        self.__lon = lon
        self.__api_key = settings.API_KEY

    def execute(self):
        """
        Execute the command
        @return: The city and state that the given coordinates reside in.
        @rtype: tuple
        """
        r = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng={0},{1}&key={2}".format(self.__lat,
                                                                                              self.__lon,
                                                                                              self.__api_key)
        )

        data = json.loads(r.text)
        status = data['status']
        city = None
        state = None
        country = None
        if status.lower() == 'ok':
            result = data['results'][0]
            for component in result['address_components']:
                if 'locality' in component['types']:
                    city = component['long_name']
                elif 'administrative_area_level_1' in component['types']:
                    state = component['short_name']
                elif 'country' in component['types']:
                    country = component['short_name']

        return city, state, country