from datetime import datetime
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from cyberattackapp.services import CyberAttackService
from cyberattackapp.decorators import timeout


class CyberAttackViewTestCase(APITestCase):
    """
    Unit testing class for the CyberAttackView class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.client = APIClient()
        self.cyber_attack_service = CyberAttackService()
        self.url = '/cyberattacks/'
        self.cyber_attack_one = self.cyber_attack_service.create_model(
            timestamp=datetime.now(tz=timezone.get_current_timezone()),
            attacker_latitude=43,
            attacker_longitude=-70,
            attacker_location='Burger King',
            target_latitude=45,
            target_longitude=-72,
            target_location='McDonalds',
            attacker_ip='127.0.0.42',
            service='SSH',
            port=42
        )
        self.cyber_attack_two = self.cyber_attack_service.create_model(
            timestamp=datetime.now(tz=timezone.get_current_timezone()),
            attacker_latitude=43,
            attacker_longitude=-70,
            attacker_location='Burger King',
            target_latitude=45,
            target_longitude=-72,
            target_location='McDonalds',
            attacker_ip='127.0.0.43',
            service='SSH',
            port=43
        )
        self.args_url = self.url + '?port=42&port=43&attacker_ip=127.0.0.43&target_ip='

    def test_get(self):
        """
        Test the GET method.

        :raise AssertionError: If the test fails.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_get_args(self):
        """
        Test the GET method with query parameters.

        :raise AssertionError: If the test fails.
        """
        response = self.client.get(self.args_url)
        self.assertEqual(response.status_code, 200)

    def test_ajax_get(self):
        """
        Test the GET method with an AJAX request.

        :raise AssertionError: If the test fails.
        """
        response = self.client.get(self.url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEquals(response.status_code, 200)


class CyberMapViewTestCase(APITestCase):
    """
    Unit testing class for the CyberMap class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.client = APIClient()
        self.url = ''

    def test_get(self):
        """
        Test the GET method.

        :raise AssertionError: If the test fails.
        """
        @timeout()
        def get_test():
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertTemplateUsed(response, 'cyberattackapp/index.html')

        get_test()
