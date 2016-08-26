from django.test import TestCase
from datetime import datetime
from cyberattackapp.serializers import CyberAttackSerializer, TargetSerializer
from cyberattackapp.services import TargetService, CyberAttackService


class TargetSerializerTestCase(TestCase):
    """
    Unit testing class for the TargetSerializer class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.target_service = TargetService()

    def test_serialize(self):
        """
        Test serializing a target model.

        :raise AssertionError: If the test fails.
        """
        target = self.target_service.create_model(ip='9999.9999.9999.9999',
                                                  location='Portland, ME',
                                                  latitude='43',
                                                  longitude='-70')
        serialized_target = TargetSerializer(target)

        fields = sorted(['ip', 'location', 'latitude', 'longitude'])
        self.assertListEqual(fields, sorted(list(dict(serialized_target.fields).keys())))


class CyberAttackSerializerTestCase(TestCase):
    """
    Unit testing class for the CyberAttackSerializer class.
    """
    def setUp(self):
        """
        Initializing testing data.
        """
        self.target_service = TargetService()
        self.cyber_attack_service = CyberAttackService()

    def test_serialize(self):
        """
        Test serializing a cyberattack model.

        :raise AssertionError: If the test fails.
        """
        target = self.target_service.create_model(ip='8888.8888.8888.8888',
                                                  location='Portland, ME',
                                                  latitude='43',
                                                  longitude='-70')
        cyberattack = self.cyber_attack_service.create_model(
            id='10000000000000000000009584327',
            timestamp=datetime.now(),
            attacker_ip='127.0.0.0',
            attacker_latitude=43,
            attacker_longitude=-70,
            attacker_location='Isenguard',
            service='SSH',
            attacker_port='40',
            target_port='41',
            target=target
        )
        serialized_cyber_attack = CyberAttackSerializer(cyberattack)

        cyber_attack_fields = sorted(['id', 'timestamp', 'attacker_ip', 'attacker_latitude', 'attacker_longitude',
                                      'attacker_location', 'service', 'attacker_port', 'target_port', 'target'])

        target_fields = sorted(['ip', 'location', 'latitude', 'longitude'])

        self.assertListEqual(cyber_attack_fields, sorted(list(dict(serialized_cyber_attack.fields).keys())))
        self.assertListEqual(target_fields, sorted(list(dict(serialized_cyber_attack.fields['target'].fields).keys())))
