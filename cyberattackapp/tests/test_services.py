from django.test import TestCase
from cyberattackapp.commands import GenerateAttacksCommand
from cyberattackapp.services import CyberAttackService
from cyberattackapp.models import CyberAttack

class CyberAttackServiceTestCase(TestCase):
    """
    Unit testing class for the CyberAttackService class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        GenerateAttacksCommand().execute()
        self.cyber_attack_service = CyberAttackService()

    def test_list(self):
        """
        Test the list method.

        :raise AssertionError: If the test fails.
        """
        self.assertEquals(5, len(self.cyber_attack_service.list_models()))
        self.assertTrue(all(type(item) == CyberAttack for item in self.cyber_attack_service.list_models()))

        self.assertEquals(1, len(self.cyber_attack_service.list_models(attacker_ip='127.0.0.0')))
        self.assertEquals(2, len(self.cyber_attack_service.list_models(attacker_ip=['127.0.0.0', '127.0.0.1'])))

        self.assertEquals(2, len(self.cyber_attack_service.list_models(attacker_ip=['127.0.0.0', '127.0.0.1'], port=42)))
        self.assertEquals(2, len(self.cyber_attack_service.list_models(attacker_ip=['127.0.0.0', '127.0.0.1'], port=42,
                                                                       target_location=['McDonalds', 'foo'])))