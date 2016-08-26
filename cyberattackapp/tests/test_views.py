from rest_framework.test import APITestCase
from rest_framework.test import APIClient


class CyberAttackViewTestCase(APITestCase):
    """
    Unit testing class for the CyberAttackView class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.client = APIClient()
        self.url = '/cyberattacks/'
        self.args_url = self.url + '?attacker_port=42&attacker_port=43&attacker_ip=127.0.0.43&target__ip=127.0.0.50'

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
