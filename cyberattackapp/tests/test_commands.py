from django.test import TestCase
from cyberattackapp.commands import GetAttacksCommand, AttackPullCommand, AttackUpdateCommand, GoogleMapsReverseGeoCodingAPICommand
from cyberattackapp.decorators import timeout
from cyberattackapp.services import CyberAttackService


class GetAttackCommandTestCase(TestCase):
    """
    Unit testing class for the GetAttacksCommand class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.get_attacks_command = GetAttacksCommand()

    def test_execute(self):
        """
        Testing method for the temporary execute method.

        :raise AssertionError: If the test fails.
        """
        keys = sorted(['timestamp', 'attacker_latitude', 'attacker_longitude', 'target_latitude', 'target_longitude',
                       'attacker_ip', 'service', 'port'])

        recent_attacks = self.get_attacks_command.execute()
        for attack in recent_attacks:
            self.assertListEqual(keys, sorted(list(attack.keys())))


class AttackPullCommandTestCase(TestCase):
    """
    Unit testing class for the AttackPullCommand class.
    """

    def setUp(self):
        """
        Initialize testing data.
        """
        self.attack_pull_command = AttackPullCommand()

    def test_execute(self):
        """
        Testing of the execute method.
        """

        # Should return a dictionary of data from a single ELSA query.
        res = self.attack_pull_command.execute()

        # Test if execute returns a dictionary
        self.assertIsInstance(res, dict)

        # Test if the output is as expected.
        # If the query to ELSA completes correctly, the dictionary should
        # come back with a top level key, value pair of
        # "percentage_complete: 100"

        self.assertTrue('percentage_complete' in res)
        self.assertEqual(res['percentage_complete'], 100)


class AttackUpdateCommandTestCase(TestCase):
    """
    Unit testing class for the AttackUpdateCommand class.
    """

    def setUp(self):
        """
        Initialize testing data.
        """
        self.attack_update_command = AttackUpdateCommand(minutes=240)
        self.cyber_attack_service = CyberAttackService()
        #self.cyber_attack_service.remove_models()

    def test_execute(self):
        """
        Testing execute method.

        :return: None
        """
        self.attack_update_command.execute()
        self.assertGreater(0, len(self.cyber_attack_service.list_models()))


class GoogleMapsReverseGeoCodingAPICommandTestCase(TestCase):
    """
    Unit testing class for the GoogleMapsReverseGeoCodingAPICommand class.
    """

    def setUp(self):
        """
        Initialize testing data.
        """
        self.map_command = GoogleMapsReverseGeoCodingAPICommand(43.6632770000, -70.2761990000)

    def test_execute(self):
        """
        Test the execute method.
        @raise AssertionError: If the test fails.
        """
        city, state, country = self.map_command.execute()

        self.assertEquals('Portland', city)
        self.assertEquals('ME', state)
        self.assertEquals('US', country)