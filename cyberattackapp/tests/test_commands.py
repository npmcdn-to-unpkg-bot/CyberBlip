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
        recent_attacks = self.get_attacks_command.execute()
        for attack in recent_attacks:
            print(attack)
