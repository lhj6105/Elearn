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


'''
class UploadFile(View):
    def get(self, request):
        return render(request, 'courseware.html')

    def post(self, request):
        try:
            coursewarename = request.POST.get('coursewarename')
            coursewarefile = request.FILES.get('coursewarefile')
            teacher_number = request.session['user']['number']
            Tobj = TeacherProfile.objects.filter(teacher_number=teacher_number).first()
            # course_cover.name  文件名
            # 写入到服务器的封面存储的位置中
            file_dir = os.path.join(settings.BASE_DIR, 'static/resources/courseware')
            if file_dir + '/' + str(time.strftime('%Y%m%d')) is None:
                os.makedirs(file_dir + '/' + str(time.strftime('%Y%m%d')))
            if len(coursewarefile.name) < 32:
                uuid_str = str(uuid.uuid4()).replace('-', '')
                coursewarefile.name = uuid_str + os.path.splitext(coursewarefile.name)[-1]
            # 将上传的文件按段(缓存块)写入到目标文件中
            with open(os.path.join(file_dir + '/' + str(time.strftime('%Y%m%d')), str(coursewarefile)), 'wb') as f:
                for chunk in coursewarefile.chunks():
                    f.write(chunk)

            # 将信息添加到数据库中
            cobj = Courseware.objects.create(courseawre_name=coursewarename,
                                             courseware_upload=os.path.join(
                                                 'resources/courseware' + '/' + str(time.strftime('%Y%m%d')),
                                                 str(coursewarefile)),
                                             teacher=Tobj)
            if cobj:  # 如果保存成功
                cobj.save()
                messages.success(request, '上传成功！')
                return redirect(reverse('courseware:courseware'))
            else:
                os.remove(file_dir + '/' + str(time.strftime('%Y%m%d')) +'/'+ str(coursewarefile))
                cobj.delete()
                messages.error(request, '上传失败，请重新上传！')
                return redirect(reverse('courseware:courseware'))
        except Exception as e:
            print(e)
            messages.error(request, '服务器错误，请重新上传！')
            return redirect(reverse('courseware:courseware'))
'''


class DownloadFile(View):

    def get(self, request):
        try:
            fileid = request.GET.get('file')
            courseware = Courseware.objects.get(id=fileid)
            course_dir = os.path.join(settings.BASE_DIR, 'static/')
            filename = os.path.join(course_dir, str(courseware.courseware_upload))
            downloadname = os.path.join(courseware.courseawre_name,
                                        os.path.splitext(courseware.courseware_upload.name)[-1])

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


class DownloadNums(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            cid = request.POST.get('cid')
            c_obj = Courseware.objects.filter(id=int(cid))
            c_update_obj = c_obj.update(courseware_download_nums=int(c_obj.first().courseware_download_nums) + 1)
            if c_update_obj:
                return JsonResponse({'status': True})
            else:
                return JsonResponse({'status': False})
        except Exception as e:
            print(e)
            return JsonResponse({'status': False})
