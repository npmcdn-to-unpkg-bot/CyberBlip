from django.db.models.query import QuerySet
from django.test import TestCase
from cyberattackapp.services import Service, CyberAttackService, TargetService
from cyberattackapp.models import CyberAttack, Target


class ServiceTestCase(TestCase):
    """
    Unit testing class for the Service class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.service = Service(Target)
        self.service.remove_models()
        self.target_generator = self._generate_attacks()
        self.generator_count = 0

    def _generate_attacks(self):
        while True:
            self.generator_count += 1
            yield self.service.create_model(
                latitude=45,
                longitude=-72,
                location='McDonalds',
                ip='127.0.0.{0}'.format(self.generator_count),
            )

    def test_init(self):
        """
        Test the init method.

        :raise AssertionError: If the test fails.
        """
        self.assertEqual(Target, self.service.model)

    def test_create_model(self):
        """
        Test the create method.

        :raise AssertionError: If the test fails.
        """
        target = next(self.target_generator)

        self.assertTrue(Target, type(target))
        self.assertEqual(45, target.latitude)
        self.assertEqual(-72, target.longitude)
        self.assertEqual('McDonalds', target.location)
        self.assertEqual('127.0.0.{0}'.format(self.generator_count), target.ip)

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
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)

        self.assertEqual(target_two.ip, self.service.get_model(location='McDonalds',
                                                               ip=target_two.ip).ip)
        self.assertEqual(target_two.ip, self.service.get_model(location=[target_two.location,
                                                                                target_three.location],
                                                               latitude=[target_two.latitude,
                                                                                target_three.latitude],
                                                               ip=target_two.ip).ip)
        self.assertEqual(target_three.ip, self.service.get_model(location=[target_three.location,
                                                                                 'Wendys'],
                                                                 longitude=[target_one.longitude,
                                                                                   target_three.longitude],
                                                                 ip=target_three.ip).ip)
        self.assertEqual(target_one.ip, self.service.get_model(location=target_one.location,
                                                               longitude=[target_two.longitude,
                                                                                 target_one.longitude],
                                                               ip=target_one.ip).ip)

        self.assertRaises(AttributeError, lambda: self.service.get_model(ip=[target_one.ip,
                                                                                    target_two.ip]))
        self.assertRaises(AttributeError, lambda: self.service.get_model(foo='bar'))

    def test_list_models(self):
        """
        Test the list models method.

        :raise AssertionError: If the test fails.
        """
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)

        self.assertListEqual([target_one, target_two, target_three],
                             list(self.service.list_models(ip=[target_one.ip,
                                                               target_two.ip,
                                                               target_three.ip])))

        self.assertListEqual([target_one],
                             list(self.service.list_models(ip=target_one.ip)))

        self.assertListEqual([target_two],
                             list(self.service.list_models(ip=[target_two.ip],
                                                           location=target_two.location)))

        self.assertListEqual([target_one, target_two],
                             list(self.service.list_models(ip=[target_one.ip,
                                                               target_two.ip],
                                                           location=[target_one.location,
                                                                      target_two.location])))

        self.assertRaises(AttributeError, lambda: self.service.list_models(foo='bar'))

    def test_update_model(self):
        """
        Test the update model method.

        :raise AssertionError: If the test fails.
        """
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)

        self.service.update_model(filter_args={'ip': target_one.ip},
                                  update_args={'location': 'Little Caesers'})
        self.service.update_model(filter_args={'ip': target_two.ip,
                                               'location': [target_one.location, target_two.location]},
                                  update_args={'latitude': 44, 'location': 'bar'})

        self.assertEqual('McDonalds', target_one.location)
        self.assertEqual(45, target_two.latitude)
        self.assertEqual('McDonalds', target_two.location)

        target_one = self.service.get_model(ip=target_one.ip)
        target_two = self.service.get_model(ip=target_two.ip)

        self.assertEqual('Little Caesers', target_one.location)
        self.assertEqual(44, target_two.latitude)
        self.assertEqual('bar', target_two.location)

        self.assertRaises(AttributeError, lambda: self.service.update_model(filter_args={'ip': [target_one.ip,
                                                                                                target_three.ip]},
                                                                            update_args={}))
        self.assertRaises(AttributeError, lambda: self.service.update_model(filter_args={'ip': target_three.ip},
                                                                            update_args={'foo': 'bar'}))
        self.assertRaises(AttributeError, lambda: self.service.update_model(filter_args={},
                                                                            update_args={}))

    def test_update_models(self):
        """
        Test the update models method.

        :raise AssertionError: If the test fails.
        """
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)

        self.service.update_models(filter_args={'ip': [target_one.ip,
                                                       target_two.ip,
                                                       target_three.ip]},
                                   update_args={'location': 'FOOBAR'})

        self.assertEqual('McDonalds', target_one.location)
        self.assertEqual('McDonalds', target_two.location)
        self.assertEqual('McDonalds', target_three.location)

        target_one = self.service.get_model(ip=target_one.ip)
        target_two = self.service.get_model(ip=target_two.ip)
        target_three = self.service.get_model(ip=target_three.ip)

        self.assertEqual('FOOBAR', target_one.location)
        self.assertEqual('FOOBAR', target_two.location)
        self.assertEqual('FOOBAR', target_three.location)

        self.service.update_models(filter_args={'ip': [target_two.ip,
                                                       target_three.ip],
                                                'location': 'FOOBAR'},
                                   update_args={'location': 'SANDSTORM'})

        target_one = self.service.get_model(ip=target_one.ip)
        target_two = self.service.get_model(ip=target_two.ip)
        target_three = self.service.get_model(ip=target_three.ip)

        self.assertEqual('FOOBAR', target_one.location)
        self.assertEqual('SANDSTORM', target_two.location)
        self.assertEqual('SANDSTORM', target_three.location)

        self.assertRaises(AttributeError, lambda: self.service.update_models(filter_args={'ip': target_three.ip},
                                                                             update_args={'foo': 'bar'}))
        self.assertRaises(AttributeError, lambda: self.service.update_models(filter_args={'foo': 'bar'},
                                                                             update_args={}))

    def test_get_latest(self):
        """
        Test the get latest method.

        :raise AssertionError: If the test fails.
        """
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)

        self.assertEqual(target_three, self.service.get_latest(filter_args={}, latest_by_field='ip'))
        self.assertEqual(target_two, self.service.get_latest(filter_args={'ip': [target_one.ip,
                                                                                 target_two.ip]},
                                                             latest_by_field='ip'))
        self.assertEqual(target_one, self.service.get_latest(filter_args={'ip': target_one.ip},
                                                             latest_by_field='ip'))
        self.assertEqual(target_three, self.service.get_latest(filter_args={'ip': [target_one.ip,
                                                                                 target_two.ip,
                                                                                 target_three.ip],
                                                                          'location': [
                                                                              target_one.location,
                                                                              target_two.location
                                                                          ]},
                                                             latest_by_field='ip'))

        self.assertIsNone(self.service.get_latest({'location': 'foo'}, 'ip'))
        self.assertRaises(AttributeError, lambda: self.service.get_latest(filter_args={'foo': 'bar'},
                                                                          latest_by_field='ip'))
        self.assertRaises(AttributeError, lambda: self.service.get_latest(filter_args={},
                                                                          latest_by_field='foo'))

    def test_count_models(self):
        """
        Test the count models method.

        :raise AssertionError: If the test fails.
        """
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)

        self.assertEqual(3, self.service.count_models(ip=[target_one.ip,
                                                          target_two.ip,
                                                          target_three.ip]))

        self.assertEqual(2, self.service.count_models(ip=[target_one.ip,
                                                          target_two.ip],
                                                      location=[target_two.location,
                                                                       target_three.location]))

        self.assertEqual(1, self.service.count_models(ip=[target_one.ip],
                                                      location=target_one.location))

        self.assertEqual(1, self.service.count_models(ip=target_one.ip))

        self.assertRaises(AttributeError, lambda: self.service.count_models(foo='bar'))

    def test_remove_model(self):
        """
        Test the remove model method.

        :raise AssertionError: If the test fails.
        """
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)
        target_four = next(self.target_generator)

        self.service.remove_model(ip=target_one.ip)
        self.service.remove_model(ip=target_two.ip, location=target_two.location)

        self.assertIsNone(self.service.get_model(ip=target_one.ip))
        self.assertIsNone(self.service.get_model(ip=target_two.ip))

        self.assertRaises(AttributeError,
                          lambda: self.service.remove_model(ip=[target_three.ip, target_four.ip]))

        try:
            self.service.remove_model(ip=target_one.ip)
        except:
            raise AssertionError()

    def test_remove_models(self):
        """
        Test the remove models method.

        :raise AssertionError: If the test fails.
        """
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)
        target_four = next(self.target_generator)

        self.service.remove_models(ip=[target_one.ip, target_two.ip])
        self.service.remove_models(ip=[target_three.ip, target_four.ip], location=target_three.location)
        self.service.remove_models(ip=target_four.ip)

        self.assertIsNone(self.service.get_model(ip=target_one.ip))
        self.assertIsNone(self.service.get_model(ip=target_two.ip))
        self.assertIsNone(self.service.get_model(ip=target_three.ip))
        self.assertIsNone(self.service.get_model(ip=target_four.ip))

        try:
            self.service.remove_models(ip=[target_one.ip,
                                           target_two.ip,
                                           target_three.ip,
                                           target_four.ip])
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


class TargetServiceTestCase(TestCase):
    """
    Unit testing class for the TargetService class.
    """
    def setUp(self):
        """
        Initialize testing data.
        """
        self.target_service = TargetService()

    def test_init(self):
        """
        Test the init method.

        :raise AssertionError:
        """
        self.assertEqual(Target, self.target_service.model)
