from django.db import models


class CyberAttack(models.Model):
    """
    Model class representing cyber attack data.
    """
    timestamp = models.DateTimeField()
    attacker_ip = models.CharField(max_length=100)
    attacker_latitude = models.DecimalField(max_digits=15, decimal_places=6)
    attacker_longitude = models.DecimalField(max_digits=15, decimal_places=6)
    attacker_location = models.CharField(max_length=100)
    target_latitude = models.DecimalField(max_digits=15, decimal_places=6)
    target_longitude = models.DecimalField(max_digits=15, decimal_places=6)
    target_location = models.CharField(max_length=100)
    service = models.CharField(max_length=100)
    port = models.DecimalField(max_digits=15, decimal_places=0)

    @classmethod
    def create(cls, **kwargs):
        """
        Create a new CyberAttack instance.

        :param kwargs: Arguments for object creation.
        :return: A new CyberAttack instance.
        :rtype: CyberAttack
        """
        return cls(**kwargs)

    class Meta:
        ordering = ['timestamp']


