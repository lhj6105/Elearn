from django.contrib import messages
from django.core.paginator import Paginator
from django.http import HttpResponse, StreamingHttpResponse, JsonResponse, QueryDict
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse
from django.utils.encoding import escape_uri_path
from django.views import View

from Elearn import settings
from coursewareapp.models import *
from videoapp.models import *


class CoursewareView(View):
    def get(self, request):
        try:
            page_number = request.GET.get('page', default='1')
            allcourseware = Courseware.objects.all().order_by('-courseware_time')
            paginator = Paginator(allcourseware, 10)  # 实例化分页器对象，第一个参数是数据源，第二个参数是每页显示的条数
            page = paginator.page(page_number)  # 返回page_number页的数据，以Page对象的方式封装该页数据
            return render(request, 'courseware.html', locals())
        except Exception as e:
            print(e)
            return render(request, 'courseware.html')


# 上传课件
class UploadFile(View):
    def get(self, request):
        return render(request, 'mine.html')

    def post(self, request):
        try:
            courseware_name = request.POST.get('courseware-name')
            courseware_file = request.FILES.get('courseware-file')
            teacher = request.session['user']['number']
            # 将数据保存到数据库中
            c_obj = Courseware.objects.create(courseawre_name=courseware_name, courseware_upload=courseware_file
                                              , teacher_id=teacher)
            if c_obj:
                c_obj.save()
                return JsonResponse({'status': 'success'})
            else:
                c_obj.delete()
                return JsonResponse({'status': 'error'})
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error'})


# 下载课件
class DownloadFile(View):
    def get(self, request):
        try:
            fileid = request.GET.get('file')
            courseware = Courseware.objects.get(id=fileid)
            course_dir = os.path.join(settings.BASE_DIR, 'static/')
            # 拼接路径
            filename = os.path.join(course_dir, str(courseware.courseware_upload))
            # 拼接下载文件名和格式
            downloadname = os.path.join(courseware.courseawre_name,
                                        os.path.splitext(courseware.courseware_upload.name)[-1])

            # 使用生成器读取文件，可用于读取大文件
            def file_iterator(file_name, chunk_size=512):
                with open(file_name, 'rb') as f:
                    while True:
                        c = f.read(chunk_size)
                        if c:
                            yield c
                        else:
                            break

            response = StreamingHttpResponse(file_iterator(filename))
            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = 'attachment;filename="{0}"'.format(escape_uri_path(downloadname))
            return response
        except Exception as e:
            print(e)
            return render(request, 'courseware.html')


# 统计下载次数
class DownloadNums(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            cid = request.POST.get('cid')
            c_obj = Courseware.objects.filter(id=int(cid))
            # 更新下载次数
            c_update_obj = c_obj.update(courseware_download_nums=int(c_obj.first().courseware_download_nums) + 1)
            if c_update_obj:
                return JsonResponse({'status': True})
            else:
                return JsonResponse({'status': False})
        except Exception as e:
            print(e)
            return JsonResponse({'status': False})
