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
                target_latitude=45,
                target_longitude=-72,
                target_location='McDonalds',
                target_ip='127.0.0.{0}'.format(self.generator_count),
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
        self.assertEqual(45, target.target_latitude)
        self.assertEqual(-72, target.target_longitude)
        self.assertEqual('McDonalds', target.target_location)
        self.assertEqual('127.0.0.{0}'.format(self.generator_count), target.target_ip)

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

        self.assertEqual(target_two.target_ip, self.service.get_model(target_location='McDonalds',
                                                               target_ip=target_two.target_ip).target_ip)
        self.assertEqual(target_two.target_ip, self.service.get_model(target_location=[target_two.target_location,
                                                                                target_three.target_location],
                                                               target_latitude=[target_two.target_latitude,
                                                                                target_three.target_latitude],
                                                               target_ip=target_two.target_ip).target_ip)
        self.assertEqual(target_three.target_ip, self.service.get_model(target_location=[target_three.target_location,
                                                                                 'Wendys'],
                                                                 target_longitude=[target_one.target_longitude,
                                                                                   target_three.target_longitude],
                                                                 target_ip=target_three.target_ip).target_ip)
        self.assertEqual(target_one.target_ip, self.service.get_model(target_location=target_one.target_location,
                                                               target_longitude=[target_two.target_longitude,
                                                                                 target_one.target_longitude],
                                                               target_ip=target_one.target_ip).target_ip)

        self.assertRaises(AttributeError, lambda: self.service.get_model(target_ip=[target_one.target_ip,
                                                                                    target_two.target_ip]))
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
                             list(self.service.list_models(target_ip=[target_one.target_ip,
                                                               target_two.target_ip,
                                                               target_three.target_ip])))

        self.assertListEqual([target_one],
                             list(self.service.list_models(target_ip=target_one.target_ip)))

        self.assertListEqual([target_two],
                             list(self.service.list_models(target_ip=[target_two.target_ip],
                                                           target_location=target_two.target_location)))

        self.assertListEqual([target_one, target_two],
                             list(self.service.list_models(target_ip=[target_one.target_ip,
                                                               target_two.target_ip],
                                                           target_location=[target_one.target_location,
                                                                      target_two.target_location])))

        self.assertRaises(AttributeError, lambda: self.service.list_models(foo='bar'))

    def test_update_model(self):
        """
        Test the update model method.

        :raise AssertionError: If the test fails.
        """
        target_one = next(self.target_generator)
        target_two = next(self.target_generator)
        target_three = next(self.target_generator)

        self.service.update_model(filter_args={'target_ip': target_one.target_ip},
                                  update_args={'target_location': 'Little Caesers'})
        self.service.update_model(filter_args={'target_ip': target_two.target_ip,
                                               'target_location': [target_one.target_location, target_two.target_location]},
                                  update_args={'target_latitude': 44, 'target_location': 'bar'})

        self.assertEqual('McDonalds', target_one.target_location)
        self.assertEqual(45, target_two.target_latitude)
        self.assertEqual('McDonalds', target_two.target_location)

        target_one = self.service.get_model(target_ip=target_one.target_ip)
        target_two = self.service.get_model(target_ip=target_two.target_ip)

        self.assertEqual('Little Caesers', target_one.target_location)
        self.assertEqual(44, target_two.target_latitude)
        self.assertEqual('bar', target_two.target_location)

        self.assertRaises(AttributeError, lambda: self.service.update_model(filter_args={'target_ip': [target_one.target_ip,
                                                                                                target_three.target_ip]},
                                                                            update_args={}))
        self.assertRaises(AttributeError, lambda: self.service.update_model(filter_args={'target_ip': target_three.target_ip},
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

        self.service.update_models(filter_args={'target_ip': [target_one.target_ip,
                                                       target_two.target_ip,
                                                       target_three.target_ip]},
                                   update_args={'target_location': 'FOOBAR'})

        self.assertEqual('McDonalds', target_one.target_location)
        self.assertEqual('McDonalds', target_two.target_location)
        self.assertEqual('McDonalds', target_three.target_location)

        target_one = self.service.get_model(target_ip=target_one.target_ip)
        target_two = self.service.get_model(target_ip=target_two.target_ip)
        target_three = self.service.get_model(target_ip=target_three.target_ip)

        self.assertEqual('FOOBAR', target_one.target_location)
        self.assertEqual('FOOBAR', target_two.target_location)
        self.assertEqual('FOOBAR', target_three.target_location)

        self.service.update_models(filter_args={'target_ip': [target_two.target_ip,
                                                       target_three.target_ip],
                                                'target_location': 'FOOBAR'},
                                   update_args={'target_location': 'SANDSTORM'})

        target_one = self.service.get_model(target_ip=target_one.target_ip)
        target_two = self.service.get_model(target_ip=target_two.target_ip)
        target_three = self.service.get_model(target_ip=target_three.target_ip)

        self.assertEqual('FOOBAR', target_one.target_location)
        self.assertEqual('SANDSTORM', target_two.target_location)
        self.assertEqual('SANDSTORM', target_three.target_location)

        self.assertRaises(AttributeError, lambda: self.service.update_models(filter_args={'target_ip': target_three.target_ip},
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

        self.assertEqual(target_three, self.service.get_latest(filter_args={}, latest_by_field='target_ip'))
        self.assertEqual(target_two, self.service.get_latest(filter_args={'target_ip': [target_one.target_ip,
                                                                                 target_two.target_ip]},
                                                             latest_by_field='target_ip'))
        self.assertEqual(target_one, self.service.get_latest(filter_args={'target_ip': target_one.target_ip},
                                                             latest_by_field='target_ip'))
        self.assertEqual(target_three, self.service.get_latest(filter_args={'target_ip': [target_one.target_ip,
                                                                                 target_two.target_ip,
                                                                                 target_three.target_ip],
                                                                          'target_location': [
                                                                              target_one.target_location,
                                                                              target_two.target_location
                                                                          ]},
                                                             latest_by_field='target_ip'))

        self.assertIsNone(self.service.get_latest({'target_location': 'foo'}, 'target_ip'))
        self.assertRaises(AttributeError, lambda: self.service.get_latest(filter_args={'foo': 'bar'},
                                                                          latest_by_field='target_ip'))
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

        self.assertEqual(3, self.service.count_models(target_ip=[target_one.target_ip,
                                                          target_two.target_ip,
                                                          target_three.target_ip]))

        self.assertEqual(2, self.service.count_models(target_ip=[target_one.target_ip,
                                                          target_two.target_ip],
                                                      target_location=[target_two.target_location,
                                                                       target_three.target_location]))

        self.assertEqual(1, self.service.count_models(target_ip=[target_one.target_ip],
                                                      target_location=target_one.target_location))

        self.assertEqual(1, self.service.count_models(target_ip=target_one.target_ip))

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

        self.service.remove_model(target_ip=target_one.target_ip)
        self.service.remove_model(target_ip=target_two.target_ip, target_location=target_two.target_location)

        self.assertIsNone(self.service.get_model(target_ip=target_one.target_ip))
        self.assertIsNone(self.service.get_model(target_ip=target_two.target_ip))

        self.assertRaises(AttributeError,
                          lambda: self.service.remove_model(target_ip=[target_three.target_ip, target_four.target_ip]))

        try:
            self.service.remove_model(target_ip=target_one.target_ip)
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

        self.service.remove_models(target_ip=[target_one.target_ip, target_two.target_ip])
        self.service.remove_models(target_ip=[target_three.target_ip, target_four.target_ip], target_location=target_three.target_location)
        self.service.remove_models(target_ip=target_four.target_ip)

        self.assertIsNone(self.service.get_model(target_ip=target_one.target_ip))
        self.assertIsNone(self.service.get_model(target_ip=target_two.target_ip))
        self.assertIsNone(self.service.get_model(target_ip=target_three.target_ip))
        self.assertIsNone(self.service.get_model(target_ip=target_four.target_ip))

        try:
            self.service.remove_models(target_ip=[target_one.target_ip,
                                           target_two.target_ip,
                                           target_three.target_ip,
                                           target_four.target_ip])
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
