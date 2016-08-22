from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned, FieldDoesNotExist, FieldError
from django.db import IntegrityError
from django.db.models import Q
from .models import CyberAttack


class Service(object):
    """
    An abstract service class.

    A service class is responsible for communicating with domain models.
    This class contains functionality common to all service classes
    such as adding, removing, and listing objects in the database.

    All service classes should inherit this class.
    """

    def __init__(self, model):
        """
        Initialize a new Service object instance.

        @param model: The model that this service is responsible for.
        """
        self.model = model

    def create_model(self, **kwargs):
        """
        Create a new model instance and add it to the database.

        @param kwargs: Arguments used for model creation.
        @return: A new instance of a model.
        """
        model_instance = self.model.create(**kwargs)
        model_instance.clean()
        try:
            model_instance.save()
        except IntegrityError:
            raise AttributeError('Missing required fields')

        return model_instance

    def update_model(self, filter_args, update_args):
        """
        Update a single model in the database.

        :param filter_args: Arguments to filter which object to update.
        :type filter_args: dict
        :param update_args: The object parameters to update.
        :type update_args: dict
        """
        model = self.get_model(**filter_args)
        try:
            self.model.objects.filter(id=model.id).update(**update_args)
        except FieldDoesNotExist:
            raise AttributeError('Field does not exist')

    def update_models(self, filter_args, update_args):
        """
        Update models in the database.

        @param filter_args: Arguments to filter which objects to update.
        @type filter_args: dict
        @param update_args: The object parameters to update.
        @type update_args: dict
        """
        models = self.list_models(**filter_args)
        try:
            models.update(**update_args)
        except FieldDoesNotExist:
            raise AttributeError('Field does not exist')

    def get_model(self, **kwargs):
        """
        Get a model in the database.

        :param kwargs: Arguments to identify the object to get.
        @return: The model found by the given kwargs or None if no such model was found in the database.
        """
        try:
            model_instance = self.model.objects.get(self._parse_query(**kwargs))
        except ObjectDoesNotExist:
            return None
        except MultipleObjectsReturned:
            raise AttributeError('Multiple objects returned.')
        except FieldError:
            raise AttributeError('Field does not exist')
        else:
            return model_instance

    def get_latest(self, filter_args, latest_by_field):
        """
        Get the latest created model from the list of models found my the given kwargs.

        :param filter_args: Arguments used for filtering a list of models.
        :type filter_args: dict
        :param latest_by_field: The field to get the latest object by.
        :type latest_by_field: str
        :return: The latest created model found by the given kwargs or None if no such model was found in the database.
        """
        try:
            model_instance = self.list_models(**filter_args).latest(latest_by_field)
        except ObjectDoesNotExist:
            return None
        except FieldError:
            raise AttributeError('Field does not exist')
        else:
            return model_instance

    def list_models(self, **kwargs):
        """
        Get a list of models in the database.

        @param kwargs: Arguments used for filtering which models to list.
        @return: The list of models matching the kwargs filter.
        @rtype: QuerySet
        """
        try:
            return self.model.objects.filter(self._parse_query(**kwargs))
        except FieldError:
            raise AttributeError('Field does not exist')

    def count_models(self, **kwargs):
        """
        Get a count of models in the database.

        @param kwargs: Arguments used for filtering which models to count.
        @return: The number of models matching the kwargs filter.
        @rtype: int
        """
        return self.list_models(**kwargs).count()

    def remove_model(self, **kwargs):
        """
        Remove a model from the database.

        @param kwargs: Arguments used for identifying the model to remove.
        """
        model = self.get_model(**kwargs)
        try:
            self.model.objects.get(id=model.id).delete()
        except (ObjectDoesNotExist, AttributeError):
            pass

    def remove_models(self, **kwargs):
        """
        Remove a queryset of models from the database.

        :param kwargs: Arguments used for filtering the queryset.
        """
        self.list_models(**kwargs).delete()

    def none(self):
        """
        Get an empty queryset for the model.

        :return: An empty queryset for the model.
        """
        return self.model.objects.none()

    def _parse_query(self, **query_args):
        """
        Parse the filter query from a dictionary of query params.

        :param query_args: A dictionary of query params.
        :type query_args: dict
        :return: The filter query matching the query args.
        :rtype: Q
        """
        filter_query = Q()
        for arg_name in query_args:
            if type(query_args[arg_name]) is list:
                if len(query_args[arg_name]) == 0:
                    continue
                or_query = Q()
                for arg in query_args[arg_name]:
                    or_query |= (Q(**{arg_name: arg}))

                filter_query &= or_query
            else:
                filter_query &= (Q(**{arg_name: query_args[arg_name]}))

        return filter_query


class CyberAttackService(Service):
    """
    Service class for the CyberAttack model.
    """
    def __init__(self):
        """
        Initialize a new CyberAttackService instance.
        """
        super().__init__(CyberAttack)
