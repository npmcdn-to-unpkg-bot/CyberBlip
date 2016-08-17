# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-08-17 14:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cyberattackapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cyberattack',
            options={'ordering': ['timestamp']},
        ),
        migrations.AlterField(
            model_name='cyberattack',
            name='attacker_latitude',
            field=models.DecimalField(decimal_places=6, max_digits=15),
        ),
        migrations.AlterField(
            model_name='cyberattack',
            name='attacker_longitude',
            field=models.DecimalField(decimal_places=6, max_digits=15),
        ),
        migrations.AlterField(
            model_name='cyberattack',
            name='port',
            field=models.DecimalField(decimal_places=0, max_digits=15),
        ),
        migrations.AlterField(
            model_name='cyberattack',
            name='target_latitude',
            field=models.DecimalField(decimal_places=6, max_digits=15),
        ),
        migrations.AlterField(
            model_name='cyberattack',
            name='target_longitude',
            field=models.DecimalField(decimal_places=6, max_digits=15),
        ),
    ]
