from django.urls import path

from coursewareapp.views import *

app_name = 'coursewareapp'

urlpatterns = [
    path('', CoursewareView.as_view(), name='courseware'),
    path('upload/', UploadFile.as_view(), name='upload'),
    path('download/', DownloadFile.as_view(), name='download'),
    path('download_nums/', DownloadNums.as_view(), name='download_nums')
]
