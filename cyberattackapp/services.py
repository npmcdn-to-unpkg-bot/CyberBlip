from django.core.exceptions import ObjectDoesNotExist
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
        model_instance.save()
        return model_instance

    def update_model(self, filter_args, update_args):
        """
        Update a model in the database.

        @param filter_args: Arguments to filter which objects to update.
        @type filter_args: dict
        @param update_args: The object parameters to update.
        @type update_args: dict
        """
        self.model.objects.filter(**filter_args).update(**update_args)

    def get_model(self, **kwargs):
        """
        Get a model in the database.

        @return: The model found by the given kwargs or None if no such model was found in the database.
        """
        try:
            model_instance = self.model.objects.get(**kwargs)
        except ObjectDoesNotExist:
            return None
        else:
            return model_instance

    def get_latest(self, **kwargs):
        """
        Get the latest created model from the list of models found my the given kwargs.

        @param kwargs: Arguments used for getting a list of models.
        @return: The latest created model found by the given kwargs or None if no such model was found in the database.
        """
        try:
            model_instance = self.list_models(**kwargs).latest()
        except ObjectDoesNotExist:
            return None
        else:
            return model_instance

    def list_models(self, **kwargs):
        """
        Get a list of models in the database.

        @param kwargs: Arguments used for filtering which models to list.
        @return: The list of models matching the kwargs filter.
        @rtype: QuerySet
        """
        return self.model.objects.filter(**kwargs)

    def count_models(self, **kwargs):
        """
        Get a count of models in the database.

        @param kwargs: Arguments used for filtering which models to count.
        @return: The number of models matching the kwargs filter.
        @rtype: int
        """
        return self.model.objects.filter(**kwargs).count()

    def remove_model(self, **kwargs):
        """
        Remove a model from the database.

        @param kwargs: Arguments used for identifying the model to remove.
        """
        try:
            self.model.objects.get(**kwargs).delete()
        except ObjectDoesNotExist:
            pass

    def remove_models(self, **kwargs):
        """
        Remove a queryset of models from the database.

        :param kwargs: Arguments used for filtering the queryset.
        """
        self.model.objects.filter(**kwargs).delete()


class CyberAttackService(Service):
    """
    Service class for the CyberAttack model.
    """
    def __init__(self):
        """
        Initialize a new CyberAttackService instance.
        """
        super().__init__(CyberAttack)
