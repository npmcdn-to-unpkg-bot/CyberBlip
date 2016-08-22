from datetime import datetime, timedelta
from django.db.models.query import QuerySet
from django.utils import timezone
from django.test import TestCase
from cyberattackapp.services import Service, CyberAttackService
from cyberattackapp.models import CyberAttack


class ServiceTestCase(TestCase):
    """
    Unit testing class for the Service class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.service = Service(CyberAttack)
        self.cyber_attack_generator = self._generate_attacks()
        self.generator_count = 0

    def _generate_attacks(self):
        while True:
            self.generator_count += 1
            yield self.service.create_model(
                timestamp=datetime.now(tz=timezone.get_current_timezone()),
                attacker_latitude=43,
                attacker_longitude=-70,
                attacker_location='Burger King',
                target_latitude=45,
                target_longitude=-72,
                target_location='McDonalds',
                attacker_ip='127.0.0.{0}'.format(self.generator_count),
                service='SSH',
                port=self.generator_count
            )

    def test_init(self):
        """
        Test the init method.

        :raise AssertionError: If the test fails.
        """
        self.assertEqual(CyberAttack, self.service.model)

    def test_create_model(self):
        """
        Test the create method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack = next(self.cyber_attack_generator)

        self.assertTrue(CyberAttack, type(cyber_attack))
        self.assertAlmostEqual(datetime.now(tz=timezone.get_current_timezone()),
                               cyber_attack.timestamp,
                               delta=timedelta(1))
        self.assertEqual(43, cyber_attack.attacker_latitude)
        self.assertEqual(-70, cyber_attack.attacker_longitude)
        self.assertEqual('Burger King', cyber_attack.attacker_location)
        self.assertEqual(45, cyber_attack.target_latitude)
        self.assertEqual(-72, cyber_attack.target_longitude)
        self.assertEqual('McDonalds', cyber_attack.target_location)
        self.assertEqual('127.0.0.{0}'.format(self.generator_count), cyber_attack.attacker_ip)
        self.assertEqual('SSH', cyber_attack.service)
        self.assertEqual(self.generator_count, cyber_attack.port)

        try:
            self.service.create_model()
        except AttributeError:
            pass
        else:
            raise AssertionError()

    def test_get_model(self):
        """
        Test the get model method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack_one = next(self.cyber_attack_generator)
        cyber_attack_two = next(self.cyber_attack_generator)
        cyber_attack_three = next(self.cyber_attack_generator)

        self.assertEqual(cyber_attack_two.id, self.service.get_model(port=cyber_attack_two.port,
                                                                     attacker_ip=cyber_attack_two.attacker_ip).id)
        self.assertEqual(cyber_attack_two.id, self.service.get_model(port=[cyber_attack_two.port,
                                                                           cyber_attack_three.port],
                                                                     service='SSH',
                                                                     attacker_ip=cyber_attack_two.attacker_ip).id)
        self.assertEqual(cyber_attack_three.id, self.service.get_model(port=[cyber_attack_three.port, 10000000000],
                                                                       service=['TELNET', 'SSH']).id)
        self.assertEqual(cyber_attack_one.id, self.service.get_model(port=cyber_attack_one.port,
                                                                     service=['SSH', 'TELNET'],
                                                                     attacker_ip=cyber_attack_one.attacker_ip).id)

        self.assertRaises(AttributeError, lambda: self.service.get_model(port=[cyber_attack_one.port,
                                                                               cyber_attack_two.port]))
        self.assertRaises(AttributeError, lambda: self.service.get_model(foo='bar'))

    def test_list_models(self):
        """
        Test the list models method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack_one = next(self.cyber_attack_generator)
        cyber_attack_two = next(self.cyber_attack_generator)
        cyber_attack_three = next(self.cyber_attack_generator)

        self.assertListEqual([cyber_attack_one, cyber_attack_two, cyber_attack_three],
                             list(self.service.list_models(id=[cyber_attack_one.id,
                                                               cyber_attack_two.id,
                                                               cyber_attack_three.id])))

        self.assertListEqual([cyber_attack_one],
                             list(self.service.list_models(id=cyber_attack_one.id)))

        self.assertListEqual([cyber_attack_two],
                             list(self.service.list_models(id=[cyber_attack_one.id,
                                                               cyber_attack_two.id,
                                                               cyber_attack_three.id],
                                                           port=cyber_attack_two.port)))

        self.assertListEqual([cyber_attack_one, cyber_attack_two],
                             list(self.service.list_models(id=[cyber_attack_one.id,
                                                               cyber_attack_two.id,
                                                               cyber_attack_three.id],
                                                           port=[cyber_attack_one.port,
                                                                 cyber_attack_two.port])))

        self.assertRaises(AttributeError, lambda: self.service.list_models(foo='bar'))

    def test_update_model(self):
        """
        Test the update model method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack_one = next(self.cyber_attack_generator)
        cyber_attack_two = next(self.cyber_attack_generator)
        cyber_attack_three = next(self.cyber_attack_generator)

        self.service.update_model(filter_args={'id': cyber_attack_one.id},
                                  update_args={'service': 'TELNET'})
        self.service.update_model(filter_args={'id': cyber_attack_two.id,
                                               'port': [cyber_attack_one.port, cyber_attack_two.port]},
                                  update_args={'service': 'foo', 'attacker_location': 'bar'})

        self.assertEqual('SSH', cyber_attack_one.service)
        self.assertEqual('SSH', cyber_attack_two.service)
        self.assertEqual('Burger King', cyber_attack_two.attacker_location)

        cyber_attack_one = self.service.get_model(id=cyber_attack_one.id)
        cyber_attack_two = self.service.get_model(id=cyber_attack_two.id)

        self.assertEqual('TELNET', cyber_attack_one.service)
        self.assertEqual('foo', cyber_attack_two.service)
        self.assertEqual('bar', cyber_attack_two.attacker_location)

        self.assertRaises(AttributeError, lambda: self.service.update_model(filter_args={'id': [cyber_attack_one.id,
                                                                                                cyber_attack_three.id]},
                                                                            update_args={}))
        self.assertRaises(AttributeError, lambda: self.service.update_model(filter_args={'id': cyber_attack_three.id},
                                                                            update_args={'foo': 'bar'}))
        self.assertRaises(AttributeError, lambda: self.service.update_model(filter_args={},
                                                                            update_args={}))

    def test_update_models(self):
        """
        Test the update models method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack_one = next(self.cyber_attack_generator)
        cyber_attack_two = next(self.cyber_attack_generator)
        cyber_attack_three = next(self.cyber_attack_generator)

        self.service.update_models(filter_args={'id': [cyber_attack_one.id,
                                                       cyber_attack_two.id,
                                                       cyber_attack_three.id]},
                                   update_args={'service': 'FOOBAR'})

        self.assertEqual('SSH', cyber_attack_one.service)
        self.assertEqual('SSH', cyber_attack_two.service)
        self.assertEqual('SSH', cyber_attack_three.service)

        cyber_attack_one = self.service.get_model(id=cyber_attack_one.id)
        cyber_attack_two = self.service.get_model(id=cyber_attack_two.id)
        cyber_attack_three = self.service.get_model(id=cyber_attack_three.id)

        self.assertEqual('FOOBAR', cyber_attack_one.service)
        self.assertEqual('FOOBAR', cyber_attack_two.service)
        self.assertEqual('FOOBAR', cyber_attack_three.service)

        self.service.update_models(filter_args={'id': [cyber_attack_one.id,
                                                       cyber_attack_two.id,
                                                       cyber_attack_three.id],
                                                'service': 'FOOBAR',
                                                'port': [cyber_attack_two.port, cyber_attack_three.port]},
                                   update_args={'service': 'SANDSTORM'})

        cyber_attack_one = self.service.get_model(id=cyber_attack_one.id)
        cyber_attack_two = self.service.get_model(id=cyber_attack_two.id)
        cyber_attack_three = self.service.get_model(id=cyber_attack_three.id)

        self.assertEqual('FOOBAR', cyber_attack_one.service)
        self.assertEqual('SANDSTORM', cyber_attack_two.service)
        self.assertEqual('SANDSTORM', cyber_attack_three.service)

        self.assertRaises(AttributeError, lambda: self.service.update_models(filter_args={'id': cyber_attack_three.id},
                                                                             update_args={'foo': 'bar'}))
        self.assertRaises(AttributeError, lambda: self.service.update_models(filter_args={'foo': 'bar'},
                                                                             update_args={}))

    def test_get_latest(self):
        """
        Test the get latest method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack_one = next(self.cyber_attack_generator)
        cyber_attack_two = next(self.cyber_attack_generator)
        cyber_attack_three = next(self.cyber_attack_generator)

        self.assertEqual(cyber_attack_three, self.service.get_latest(filter_args={}, latest_by_field='timestamp'))
        self.assertEqual(cyber_attack_two, self.service.get_latest(filter_args={'id': [cyber_attack_one.id,
                                                                                       cyber_attack_two.id]},
                                                                   latest_by_field='timestamp'))
        self.assertEqual(cyber_attack_one, self.service.get_latest(filter_args={'id': cyber_attack_one.id},
                                                                   latest_by_field='timestamp'))
        self.assertEqual(cyber_attack_two, self.service.get_latest(filter_args={'id': [cyber_attack_one.id,
                                                                                       cyber_attack_two.id,
                                                                                       cyber_attack_three.id],
                                                                                'port': [cyber_attack_one.port,
                                                                                         cyber_attack_two.port]},
                                                                   latest_by_field='timestamp'))

        self.assertIsNone(self.service.get_latest({'port': 50000000}, 'timestamp'))
        self.assertRaises(AttributeError, lambda: self.service.get_latest(filter_args={'foo': 'bar'},
                                                                          latest_by_field='timestamp'))
        self.assertRaises(AttributeError, lambda: self.service.get_latest(filter_args={},
                                                                          latest_by_field='foo'))

    def test_count_models(self):
        """
        Test the count models method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack_one = next(self.cyber_attack_generator)
        cyber_attack_two = next(self.cyber_attack_generator)
        cyber_attack_three = next(self.cyber_attack_generator)

        self.assertEqual(3, self.service.count_models(id=[cyber_attack_one.id,
                                                          cyber_attack_two.id,
                                                          cyber_attack_three.id]))

        self.assertEqual(2, self.service.count_models(id=[cyber_attack_one.id,
                                                          cyber_attack_two.id,
                                                          cyber_attack_three.id],
                                                      port=[cyber_attack_two.port,
                                                            cyber_attack_three.port]))

        self.assertEqual(1, self.service.count_models(id=[cyber_attack_one.id,
                                                          cyber_attack_two.id,
                                                          cyber_attack_three.id],
                                                      port=cyber_attack_three.port))

        self.assertEqual(1, self.service.count_models(id=cyber_attack_one.id))

        self.assertRaises(AttributeError, lambda: self.service.count_models(foo='bar'))

    def test_remove_model(self):
        """
        Test the remove model method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack_one = next(self.cyber_attack_generator)
        cyber_attack_two = next(self.cyber_attack_generator)
        cyber_attack_three = next(self.cyber_attack_generator)
        cyber_attack_four = next(self.cyber_attack_generator)

        self.service.remove_model(id=cyber_attack_one.id)
        self.service.remove_model(id=[cyber_attack_two.id, cyber_attack_three.id], port=cyber_attack_two.port)

        self.assertIsNone(self.service.get_model(id=cyber_attack_one.id))
        self.assertIsNone(self.service.get_model(id=cyber_attack_two.id))

        self.assertRaises(AttributeError,
                          lambda: self.service.remove_model(id=[cyber_attack_three.id, cyber_attack_four.id]))

        try:
            self.service.remove_model(id=cyber_attack_one.id)
        except:
            raise AssertionError()

    def test_remove_models(self):
        """
        Test the remove models method.

        :raise AssertionError: If the test fails.
        """
        cyber_attack_one = next(self.cyber_attack_generator)
        cyber_attack_two = next(self.cyber_attack_generator)
        cyber_attack_three = next(self.cyber_attack_generator)
        cyber_attack_four = next(self.cyber_attack_generator)

        self.service.remove_models(id=[cyber_attack_one.id, cyber_attack_two.id])
        self.service.remove_models(id=[cyber_attack_three.id, cyber_attack_four.id], port=cyber_attack_three.port)
        self.service.remove_models(id=cyber_attack_four.id)

        self.assertIsNone(self.service.get_model(id=cyber_attack_one.id))
        self.assertIsNone(self.service.get_model(id=cyber_attack_two.id))
        self.assertIsNone(self.service.get_model(id=cyber_attack_three.id))
        self.assertIsNone(self.service.get_model(id=cyber_attack_four.id))

        try:
            self.service.remove_models(id=[cyber_attack_one.id,
                                           cyber_attack_two.id,
                                           cyber_attack_three.id,
                                           cyber_attack_four.id])
        except:
            raise AssertionError()

    def test_none(self):
        """
        Test the none method.

        :raise AssertionError: If the test fails
        """
        none = self.service.none()
        self.assertEqual(0, len(none))
        self.assertEqual(QuerySet, type(none))


class CyberAttackServiceTestCase(TestCase):
    """
    Unit testing class for the CyberAttackService class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.cyber_attack_service = CyberAttackService()

    def test_init(self):
        """
        Test the init method.

        :raise AssertionError:
        """
        self.assertEqual(CyberAttack, self.cyber_attack_service.model)
