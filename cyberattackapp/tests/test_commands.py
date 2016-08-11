from django.test import TestCase
from cyberattackapp.commands import GetAttacksCommand


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
        """
        keys = sorted(['timestamp', 'attacker_latitude', 'attacker_longitude', 'target_latitude', 'target_longitude',
                       'attacker_ip', 'service', 'port'])

        recent_attacks = self.get_attacks_command.execute()
        for attack in recent_attacks:
            self.assertListEqual(keys, sorted(list(attack.keys())))
