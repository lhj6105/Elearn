import mimetypes
import re
from wsgiref.util import FileWrapper

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse
from django.views import View

from userapp.models import *
from videoapp.models import *


# 所有视频
class AllVideo(View):
    def get(self, request):
        page_num = request.GET.get('page', default='1')
        page_num = int(page_num)
        try:
            AllCourse = Course.objects.all().order_by('-course_add_time')  # 按时间降序排序
            allcourse = []
            for course in AllCourse:
                if course.video_set.count():  # 挑选出关联有视频的课程
                    allcourse.append(course)
            paginator = Paginator(allcourse, 8)  # 实例化分页器对象，第一个参数是数据源，第二个参数是每页显示的条数
            page = paginator.page(page_num)  # 返回page_number页的数据，以Page对象的方式封装该页数据
            if page_num < 3:
                if paginator.num_pages <= 4:
                    dis_range = range(1, paginator.num_pages + 1)
                else:
                    dis_range = range(1, 5)
            elif (page_num >= 3) and (page_num <= paginator.num_pages - 2):
                dis_range = range(page_num - 2, page_num + 2)
            else:
                dis_range = range(paginator.num_pages - 2, paginator.num_pages + 1)
            return render(request, 'video.html', locals())

        except Exception as e:
            print(e)
            return render(request, 'video.html')

    def post(self, request):
        pass


# 播放视频
class Player(View):
    def get(self, request):
        try:
            courseid = request.GET.get('course')
            videoid = request.GET.get('videoid')
            courseid = int(courseid)
            videoid = int(videoid)
            courseobj = Course.objects.filter(id=courseid).first()
            videoobj = Video.objects.filter(course_id=courseid).all()  # 该课程的所有视频
            p_video = Video.objects.filter(id=videoid).first()  # 默认播放第一个视频
            return render(request, 'video-player.html', locals())
        except Exception as e:
            print(e)
            return render(request, 'video-player.html', locals())


# 统计点击量
class ClickNums(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            courseid = request.POST.get('courseid')
            c_obj = Course.objects.filter(id=courseid)
            c_update_obj = c_obj.update(course_click_nums=int(c_obj.first().course_click_nums) + 1)
            if c_update_obj:
                return JsonResponse({'status': True})
            else:
                return JsonResponse({'status': False})
        except Exception as e:
            print(e)
            return JsonResponse({'status': False})


# 统计学生播放视频时间
class Counttime(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            sTime = request.POST.get('sTime')
            if request.session['user']['identity'] == 'student':
                number = request.session['user']['number']
                studentobj = StudentProfile.objects.filter(student_number=number)
                if studentobj:
                    total_time = studentobj.first().total_time
                    new_total_time = int(total_time) + int(sTime)
                    s_update_obj = studentobj.update(total_time=new_total_time)
                    if s_update_obj:
                        return JsonResponse({"sTime": sTime + "秒"})
                    else:
                        return JsonResponse({"sTime": "error"})
                else:
                    return JsonResponse({"sTime": "error"})
        except Exception as e:
            print(e)
            return JsonResponse({"sTime": "error"})


# 增加课程
class UploadCourse(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            course_name = request.POST.get('course-name')
            course_desc = request.POST.get('course-desc')
            course_file = request.FILES.get('course-file')
            teacher = request.session['user']['number']
            if course_desc == '':
                course_desc = '无'
            c_obj = Course.objects.create(course_title=course_name, course_cover=course_file,
                                          course_describe=course_desc, teacher_id=teacher)
            if c_obj:
                c_obj.save()
                return JsonResponse({'status': 'success'})
            else:
                c_obj.delete()
                return JsonResponse({'status': 'error'})
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error'})


# 增加视频
class UploadVideo(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            course_select = request.POST.get('course-select')
            video_name = request.POST.get('video-name')
            video_file = request.FILES.get('video-file')
            v_obj = Video.objects.create(course_id=int(course_select), video_title=video_name, video_upload=video_file)
            if v_obj:
                v_obj.save()
                return JsonResponse({'status': 'success'})
            else:
                v_obj.delete()
                return JsonResponse({'status': 'error'})
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error'})
