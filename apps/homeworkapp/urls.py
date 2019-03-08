from django.urls import path

from homeworkapp.views import *

app_name = 'homeworkapp'

urlpatterns = [
    path('', HomeworkView.as_view(), name='homework'),
    path('details/', Details.as_view(), name='details'),
    path('judge/', Judge.as_view(), name='judge'),
    path('check/', Check.as_view(), name='check'),
    path('upload/', UploadHomework.as_view(), name='upload'),
    path('addpd/', AddPDQuestion.as_view(), name='addpd'),
    path('addxz/', AddXZQuestion.as_view(), name='addxz'),
    path('addjd/', AddJDQuestion.as_view(), name='addxz'),
    path('release/', Release.as_view(), name='release'),
    path('correct_student/', ReleaseStudent.as_view(), name='correct_student'),
    path('correct/', Correct.as_view(), name='correct'),
    path('answer/', Answer.as_view(), name='answer')
]
