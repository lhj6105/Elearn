import xadmin
from userapp.models import *


class CollegeAdmin:
    list_display = ('id', 'name')
    list_per_page = 10  # 每页显示条目数
    ordering = ('id',)  # 按发布日期排序
    model_icon = 'fa fa-university'


class SpecialtyAdmin:
    list_display = ('id', 'name', 'college')
    list_per_page = 10  # 每页显示条目数
    ordering = ('id', 'name',)  # 按发布日期排序
    model_icon = 'fa fa-users'


class SpecialtyTeacherAdmin:
    list_display = ('id', 'specialty', 'teacher')
    list_per_page = 10  # 每页显示条目数
    ordering = ('id', 'specialty',)  # 按发布日期排序
    model_icon = 'glyphicon glyphicon-user'


class TeacherStudentAdmin:
    list_display = ('id', 'teacher', 'student')
    list_per_page = 10  # 每页显示条目数
    ordering = ('id', 'teacher',)  # 按发布日期排序
    model_icon = 'glyphicon glyphicon-user'


class TeacherAdmin:
    list_display = ('number', 'name', 'identity', 'profile_photo', 'date_joined')
    list_per_page = 10  # 每页显示条目数
    ordering = ('number', '-date_joined',)  # 按发布日期排序
    model_icon = 'glyphicon glyphicon-user'


class StudentAdmin:
    list_display = ('number', 'name', 'identity', 'profile_photo', 'date_joined', 'total_time')
    list_per_page = 10  # 每页显示条目数
    ordering = ('number', '-date_joined',)  # 按发布日期排序
    model_icon = 'fa fa-graduation-cap'


xadmin.site.register(College, CollegeAdmin)
xadmin.site.register(Specialty, SpecialtyAdmin)
xadmin.site.register(SpecialtyTeacher, SpecialtyTeacherAdmin)
xadmin.site.register(TeacherStudent, TeacherStudentAdmin)
xadmin.site.register(TeacherProfile, TeacherAdmin)
xadmin.site.register(StudentProfile, StudentAdmin)
