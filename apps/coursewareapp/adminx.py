import xadmin
from coursewareapp.models import *


class CoursewareAdmin:
    list_display = ['courseawre_name', 'courseware_upload', 'courseawre_size', 'courseware_time', 'teacher']
    list_per_page = 10  # 每页显示条目数
    ordering = ('courseawre_name', '-courseware_time',)  # 按发布日期排序
    model_icon = 'fa fa-file'


xadmin.site.register(Courseware, CoursewareAdmin)
