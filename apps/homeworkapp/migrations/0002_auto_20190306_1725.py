# Generated by Django 2.0.6 on 2019-03-06 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homeworkapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questions',
            name='choice_a',
            field=models.TextField(default='我是答案A', verbose_name='A选项'),
        ),
        migrations.AlterField(
            model_name='questions',
            name='choice_b',
            field=models.TextField(default='我是答案B', verbose_name='B选项'),
        ),
        migrations.AlterField(
            model_name='questions',
            name='choice_c',
            field=models.TextField(default='我是答案C', verbose_name='C选项'),
        ),
        migrations.AlterField(
            model_name='questions',
            name='choice_d',
            field=models.TextField(default='我是答案D', verbose_name='D选项'),
        ),
    ]