from django.test import TestCase
from cyberattackapp.commands import GetAttacksCommand, PopulateTargetsCommand, AttackPullCommand, AttackUpdateCommand, \
    GoogleMapsReverseGeoCodingAPICommand
from cyberattackapp.services import CyberAttackService, TargetService
from cyberattackapp.models import CyberAttack


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
        recent_attacks = self.get_attacks_command.execute()
        self.assertGreater(len(recent_attacks), 0)
        for attack in recent_attacks:
            self.assertEqual(CyberAttack, type(attack))


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


class PopulateTargetsCommandTestCase(TestCase):
    """
    Unit testing class for the PopulateTargetsCommand class.
    """

    def setUp(self):
        self.populate_targets_command = PopulateTargetsCommand()
        self.target_service = TargetService()

    def test_execute(self):
        """
        Testing execute method.
        """
        self.target_service.remove_models()
        self.populate_targets_command.execute()
        self.assertGreater(len(self.target_service.list_models()), 0)


class AttackUpdateCommandTestCase(TestCase):
    """
    Unit testing class for the AttackUpdateCommand class.
    """

    def setUp(self):
        """
        Initialize testing data.
        """
        self.attack_update_command = AttackUpdateCommand(minutes=1440)
        self.cyber_attack_service = CyberAttackService()

    def test_execute(self):
        """
        Testing execute method.

        :return: None
        """
        self.cyber_attack_service.remove_models()
        self.attack_update_command.execute()
        self.assertGreater(len(self.cyber_attack_service.list_models()), 0)


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