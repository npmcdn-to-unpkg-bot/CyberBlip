import json
from django.test import TestCase, Client


class CyberAttackViewTestCase(TestCase):
    """
    Unit testing class for the CyberAttackView class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.client = Client()
        self.url = ''

    def test_get(self):
        """
        Test the GET method.

        :raise AssertionError: If the test fails.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'cyberattackapp/index.html')

    def test_ajax_get(self):
        """
        Test the GET method with an AJAX request.

        :raise AssertionError: If the test fails.
        """
        response = self.client.get(self.url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEquals(response.status_code, 200)
