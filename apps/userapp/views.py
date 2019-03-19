import json

from django.contrib.auth import logout
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse
from django.views import View

from homeworkapp.models import *
from userapp.models import *
from videoapp.models import *


class Mine(View):

    def get(self, request):
        try:
            all_course = Course.objects.all()
            all_homework = Homework.objects.all()
            questions = Questions.objects.all()
            if request.session['user']['identity'] == 'student':
                stu = request.session['user']['number']
                s_score = StudentScore.objects.filter(student_id=stu)
                total = StudentProfile.objects.filter(number=stu).first().total_time
                total_time = FileCheck.timeConvert(self, int(total))
            elif request.session['user']['identity'] == 'teacher':
                tea = request.session['user']['number']
                my_homework = Homework.objects.filter(teacher_id=tea)
                all_student_score = StudentScore.objects.all()
                all_student_details = StudentProfile.objects.all()
                student_list = []
                for student in all_student_details:
                    s = []
                    l = []
                    one_time = FileCheck.timeConvert(self, int(student.total_time))
                    s.append(student.name)
                    s.append(one_time)
                    l.append(s)
                    student_list.extend(l)
            return render(request, 'mine.html', locals())
        except Exception as e:
            print(e)
            return render(request, 'mine.html')

    def post(self, request):
        pass


class TeacherReg(View):

    def get(self, request):
        pass

    def post(self, request):
        t_reg_name = request.POST.get('t_reg_name')
        t_reg_number = request.POST.get('t_reg_number')
        t_reg_password = request.POST.get('t_reg_password')
        t_reg_selection_id = request.POST.get('t_reg_selection_id')
        t_reg_code = request.POST.get('t_reg_code')
        try:
            if t_reg_code == '123456':
                teacher = TeacherProfile.objects.filter(number=t_reg_number).first()  # 判断学号是否存在
                if teacher:
                    return JsonResponse({'status': 'error', 'code': 'ok'})  # 验证正确但学号存在
                else:
                    # 不存在新建
                    t = TeacherProfile.objects.create(number=t_reg_number, name=t_reg_name,
                                                      password=make_password(t_reg_password, None, 'pbkdf2_sha1'),
                                                      identity=t_reg_selection_id)
                    if t:
                        t.save()  # 保存
                        request.session['user'] = {
                            'number': t_reg_number,
                            'name': t_reg_name,
                            'identity': t_reg_selection_id,
                            'photo': json.dumps(
                                str(TeacherProfile.objects.filter(number=t_reg_number).first().profile_photo))[1:-1],
                        }  # 将信息保存到session中
                        request.session.set_expiry(60 * 60 * 24)  # session失效时间
                        return JsonResponse({'status': 'ok', 'code': 'ok'})
                    else:
                        t.delete()  # 出错删除
                        return JsonResponse({'status': 'stop'})  # 服务器出错
            else:
                return JsonResponse({'code': 'error'})  # 注册码不正确
        except Exception as e:
            print('注册出错啦：', e)
            return JsonResponse({'status': 'stop'})  # 服务器出错


class TeacherLog(View):

    def get(self, request):
        pass

    def post(self, request):
        t_log_number = request.POST.get('t_log_number')
        t_log_password = request.POST.get('t_log_password')
        t_log_selection_id = request.POST.get('t_log_selection_id')
        try:
            teacher = TeacherProfile.objects.filter(number=t_log_number).first()  # 判断是否存在
            if teacher:
                if check_password(t_log_password, teacher.password):  # 密码认证:
                    request.session['user'] = {
                        'number': teacher.number,
                        'name': teacher.name,
                        'identity': t_log_selection_id,
                        'photo': json.dumps(str(teacher.profile_photo))[1:-1],
                    }
                    request.session.set_expiry(60 * 60 * 24)  # session失效时间
                    return JsonResponse({'status': 'log_ok'})
                else:
                    return JsonResponse({'status': 'log_error'})  # 密码错误
            else:
                return JsonResponse({'status': 'log_empty'})  # 学号不存在
        except Exception as e:
            print("登录出错啦：", e)
            return JsonResponse({'status': 'log_stop'})  # 服务器出错


class StudentReg(View):

    def get(self, request):
        pass

    def post(self, request):
        s_reg_name = request.POST.get('s_reg_name')
        s_reg_number = request.POST.get('s_reg_number')
        s_reg_password = request.POST.get('s_reg_password')
        s_reg_selection_id = request.POST.get('s_reg_selection_id')
        try:
            student = StudentProfile.objects.filter(number=s_reg_number).first()  # 判断学号是否存在
            if student:
                return JsonResponse({'status': 'error'})  # 学号存在
            else:
                # 不存在新建
                s = StudentProfile.objects.create(number=s_reg_number, name=s_reg_name,
                                                  password=make_password(s_reg_password, None, 'pbkdf2_sha1'),
                                                  identity=s_reg_selection_id)
                if s:
                    s.save()  # 保存
                    request.session['user'] = {
                        'number': s_reg_number,
                        'name': s_reg_name,
                        'identity': s_reg_selection_id,
                        'photo': json.dumps(
                            str(StudentProfile.objects.filter(number=s_reg_number).first().profile_photo))[1:-1],
                    }  # 将信息保存到session中
                    request.session.set_expiry(60 * 60 * 24)  # session失效时间
                    return JsonResponse({'status': 'ok'})
                else:
                    s.delete()  # 出错删除
                    return JsonResponse({'status': 'stop'})  # 服务器出错
        except Exception as e:
            print('注册出错啦：', e)
            return JsonResponse({'status': 'stop'})  # 服务器出错


class StudentLog(View):

    def get(self, request):
        pass

    def post(self, request):
        s_log_number = request.POST.get('s_log_number')
        s_log_password = request.POST.get('s_log_password')
        s_log_selection_id = request.POST.get('s_log_selection_id')
        try:
            student = StudentProfile.objects.filter(number=s_log_number).first()  # 判断是否存在
            if student:
                if check_password(s_log_password, student.password):  # 密码认证
                    request.session['user'] = {
                        'number': student.number,
                        'name': student.name,
                        'identity': s_log_selection_id,
                        'photo': json.dumps(str(student.profile_photo))[1:-1],
                    }
                    request.session.set_expiry(60 * 60 * 24)  # session失效时间
                    return JsonResponse({'status': 'log_ok'})
                else:
                    return JsonResponse({'status': 'log_error'})  # 密码错误
            else:
                return JsonResponse({'status': 'log_empty'})  # 学号不存在
        except Exception as e:
            print("登录出错啦：", e)
            return JsonResponse({'status': 'log_stop'})  # 服务器出错


class LoginOut(View):

    def get(self, request):
        logout(request)
        return redirect(reverse('home:home'))

    def post(self, request):
        pass
