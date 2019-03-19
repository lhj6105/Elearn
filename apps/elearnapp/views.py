from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse
from django.views import View

from videoapp.models import *


class Index(View):
    def get(self, request):
        return redirect(reverse('home:home'))

    def post(self, request):
        pass


class Home(View):
    def get(self, request):
        try:
            # 获取点击量最高的视频
            hot_course = Course.objects.all().order_by('-click_nums')
            hot_course_list = []
            for course in hot_course:
                if course.video_set.count():
                    hot_course_list.append(course)
            return render(request, 'index.html', locals())
        except Exception as e:
            print(e)
            return render(request, 'index.html')

    def post(self, request):
        pass
