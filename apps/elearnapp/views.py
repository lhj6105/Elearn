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
            HotCourse = Course.objects.all().order_by('-course_click_nums')
            hotcourse = []
            for course in HotCourse:
                if course.video_set.count():
                    hotcourse.append(course)
            return render(request, 'index.html', locals())
        except Exception as e:
            print(e)
            return render(request, 'index.html')

    def post(self, request):
        pass
