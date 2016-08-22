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
        self.attack_pull_command = AttackPullCommand()

    def test_execute(self):
        res = self.attack_pull_command.execute()

        self.assertEqual(res, None)


class AttackParseCommandTestCase(TestCase):
    """
    Unit testing class for the AttackParseCommand class.
    """

    def setUp(self):
        self.attack_parse_command = AttackParseCommand()

    def test_execute(self):
        res = self.attack_parse_command.execute()

        self.assertEqual(res, None)