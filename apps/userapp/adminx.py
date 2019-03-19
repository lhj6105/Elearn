import xadmin
from userapp.models import *


class TeacherAdmin:
    list_display = ('number', 'name', 'identity', 'password', 'profile_photo', 'date_joined')
    list_per_page = 10  # 每页显示条目数
    ordering = ('number', '-date_joined',)  # 按发布日期排序
    model_icon = 'glyphicon glyphicon-user'


class StudentAdmin:
    list_display = ('number', 'name', 'identity', 'password', 'profile_photo', 'date_joined', 'total_time')
    list_per_page = 10  # 每页显示条目数
    ordering = ('number', '-date_joined',)  # 按发布日期排序
    model_icon = 'fa fa-user-circle-o'


xadmin.site.register(TeacherProfile, TeacherAdmin)
xadmin.site.register(StudentProfile, StudentAdmin)
