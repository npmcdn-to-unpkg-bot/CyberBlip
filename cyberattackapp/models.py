from django.db import models


class Target(models.Model):
    ip = models.CharField(max_length=100, primary_key=True)
    latitude = models.DecimalField(max_digits=15, decimal_places=6)
    longitude = models.DecimalField(max_digits=15, decimal_places=6)
    location = models.CharField(max_length=100)

    @classmethod
    def create(cls, **kwargs):
        """
        Create a new Target instance.

        :param kwargs: Arguments for object creation.
        :return: A new Target instance.
        :rtype: Target
        """
        return cls(**kwargs)

    def as_dict(self):
        """
        Get a dictionary representation of this model.

        :return: A dictionary representation of this model.
        :rtype: dict
        """
        return {
            'ip': self.ip,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'location': self.location
        }

    class Meta:
        ordering = ['ip']


class CyberAttack(models.Model):
    """
    Model class representing cyber attack data.

    Required fields:

        - timestamp: models.DateTimeField()
        - attacker_ip: models.CharField(max_length=100)
        - attacker_latitude:  models.DecimalField(max_digits=15, decimal_places=6)
        - attacker_longitude: models.DecimalField(max_digits=15, decimal_places=6)
        - attacker_location: models.CharField(max_length=100)
        - service: models.CharField(max_length=100)
        - target_port: models.DecimalField(max_digits=15, decimal_places=0)
        - target: models.ForeignKey(Target)
    """
    id = models.CharField(max_length=100, primary_key=True)
    timestamp = models.DateTimeField()
    attacker_ip = models.CharField(max_length=100)
    attacker_latitude = models.DecimalField(max_digits=15, decimal_places=6)
    attacker_longitude = models.DecimalField(max_digits=15, decimal_places=6)
    attacker_location = models.CharField(max_length=100)
    service = models.CharField(max_length=100)
    attacker_port = models.DecimalField(max_digits=15, decimal_places=0)
    target_port = models.DecimalField(max_digits=15, decimal_places=0)
    target = models.ForeignKey(Target)

    @classmethod
    def create(cls, **kwargs):
        """
        Create a new CyberAttack instance.

        :param kwargs: Arguments for object creation.
        :return: A new CyberAttack instance.
        :rtype: CyberAttack
        """
        return cls(**kwargs)

    def as_dict(self):
        """
        Get a dictionary representation of this model.

        :return: A dictionary representation of this model.
        :rtype: dict
        """
        return {
            'id': self.id,
            'timestamp': self.timestamp,
            'attacker_ip': self.attacker_ip,
            'attacker_latitude': self.attacker_latitude,
            'attacker_longitude': self.attacker_longitude,
            'attacker_location': self.attacker_location,
            'service': self.service,
            'attacker_port': self.attacker_port,
            'target_port': self.target_port,
            'target': self.target.as_dict()
        }

    class Meta:
        ordering = ['timestamp']