import xadmin
from videoapp.models import *


class CourseAdmin:
    list_display = ('course_title', 'course_cover', 'course_describe',
                    'course_click_nums', 'course_add_time', 'teacher')
    list_per_page = 10  # 每页显示条目数
    ordering = ('course_title', '-course_add_time',)  # 按发布日期排序
    model_icon = 'glyphicon glyphicon-list'


class VideoAdmin:
    list_display = ('course', 'video_title', 'video_upload', 'video_add_time', 'video_time')
    list_per_page = 10  # 每页显示条目数
    ordering = ('course', 'video_title', '-video_add_time',)  # 按发布日期排序
    model_icon = 'fa fa-video-camera'


xadmin.site.register(Course, CourseAdmin)
xadmin.site.register(Video, VideoAdmin)
