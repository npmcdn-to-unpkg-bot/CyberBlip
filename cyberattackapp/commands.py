from datetime import datetime, timedelta


class GetAttacksCommand(object):

    def __init__(self):
        pass

    def execute(self):
        timestamps = [timestamp for timestamp in self._generate_timestampes()]
        attacker_lat_lngs = [(44.389661, -70.471819), (45.246879, -70.164202), (44.812069, -68.939226),
                    (44.913302, -67.950457), (46.262518, -68.763445)]
        target_lat_lngs = [(43.643058, -70.257585), (43.643058, -70.257585), (43.643058, -70.257585),
                           (43.643058, -70.257585), (43.643058, -70.257585)]

        attacks_list = list()
        for i in range(5):
            timestamp = timestamps[i]
            attacker_lat_lng = attacker_lat_lngs[i]
            target_lat_lng = target_lat_lngs[i]

            attacks_list.append({'timestamp': timestamp,
                                 'attacker_latitude': attacker_lat_lng[0], 'attacker_longitude': attacker_lat_lng[1],
                                 'target_latitude': target_lat_lng[0], 'target_longitude': target_lat_lng[1],
                                 'attacker_ip': '127.0.0.{0}'.format(i),
                                 'service': 'SSH', 'port': 42})

        return attacks_list

    def _generate_timestampes(self):
        """
        Temporary method for testing timestamps.
        """
        curr_time = datetime.now()
        for i in range(5):
            yield '{:%H:%M:%S}'.format(curr_time)
            curr_time = curr_time + timedelta(seconds=10)


