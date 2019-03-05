import os
import uuid

from django.contrib.auth.hashers import make_password
from django.db import models


# Create your models here.
class TeacherProfile(models.Model):
    teacher_number = models.CharField(primary_key=True, max_length=20, verbose_name='学号')
    teacher_name = models.CharField(max_length=30, verbose_name='姓名')
    password = models.CharField(max_length=200, verbose_name='密码')
    identity = models.CharField(max_length=20, default='teacher', verbose_name='身份', editable=False)  # 学生还是教师
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name='注册时间')
    profile_photo = models.ImageField(upload_to='images/user_profile/',
                                      default='images/user_profile/default_teacher.png', editable=False)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if len(self.profile_photo.name) < 32:
            uuid_str = str(uuid.uuid4()).replace('-', '')
            self.profile_photo.name = uuid_str + os.path.splitext(self.profile_photo.name)[-1]

        self.password = make_password(self.password, None, 'pbkdf2_sha1')

        super().save()

    class Meta:
        db_table = 'teacher_profile'
        verbose_name = '教师表'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.teacher_name


class StudentProfile(models.Model):
    student_number = models.CharField(primary_key=True, max_length=20, verbose_name='学号')
    student_name = models.CharField(max_length=30, verbose_name='姓名')
    password = models.CharField(max_length=200, verbose_name='密码')
    identity = models.CharField(max_length=20, default='student', verbose_name='身份', editable=False)  # 学生还是教师
    profile_photo = models.ImageField(upload_to='images/user_profile/',
                                      default='images/user_profile/default_student.png', editable=False)
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name='注册时间')
    total_time = models.CharField(max_length=20, default=0, verbose_name='观看视频总时长', editable=False)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if len(self.profile_photo.name) < 32:
            uuid_str = str(uuid.uuid4()).replace('-', '')
            self.profile_photo.name = uuid_str + os.path.splitext(self.profile_photo.name)[-1]

        self.password = make_password(self.password, None, 'pbkdf2_sha1')

        super().save()

    class Meta:
        db_table = 'student_profile'
        verbose_name = '学生表'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.student_name
