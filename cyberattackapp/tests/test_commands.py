from django.test import TestCase
from cyberattackapp.commands import GetAttacksCommand, AttackPullCommand, AttackParseCommand


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


class AttackParseCommandTestCase(TestCase):
    """
    Unit testing class for the AttackParseCommand class.
    """

    def setUp(self):
        """
        Initialize testing data.
        """
        self.attack_parse_command = AttackParseCommand()

    def test_execute(self):
        """
        Testing execute method.

        :return: None
        """
        res = self.attack_parse_command.execute()

        self.assertEqual(res, None)