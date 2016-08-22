from datetime import datetime, timedelta
from django.utils import timezone
from .services import CyberAttackService
import time
from threading import Thread


class GetAttacksCommand(object):
    """
    Command class for retrieving cyber attacks from the database.
    """
    def __init__(self, **filter_args):
        """
        Initialize a new GetAttacksCommand instance.
        """
        self.cyber_attack_service = CyberAttackService()
        self.filter = filter_args.copy()
        self.filter.pop('format', None)

    def execute(self):
        """
        Execute the command.

        :return: All the CyberAttacks in the database.
        """
        return self.cyber_attack_service.list_models(**self.filter)


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
            print('GENERATE')
            self.cyber_attack_service.remove_models()

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


