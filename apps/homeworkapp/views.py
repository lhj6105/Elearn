import json

from django.core import serializers
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse
from django.views import View

from homeworkapp.models import *


class HomeworkView(View):
    def get(self, request):
        try:
            page_number = request.GET.get('page', default='1')
            # 挑选出已发布的所有作业
            allhomework = Homework.objects.filter(is_release=True).all()
            homework_list = []
            for h in allhomework:
                if h.questions_set.all():
                    homework_list.append(h)
            paginator = Paginator(homework_list, 10)  # 实例化分页器对象，第一个参数是数据源，第二个参数是每页显示的条数
            page = paginator.page(page_number)  # 返回page_number页的数据，以Page对象的方式封装该页数据
            return render(request, 'homework.html', locals())
        except Exception as e:
            print(e)
            return render(request, 'homework.html')


# 该作业中的所有题目
class Details(View):
    def get(self, request):
        h_id = request.GET.get('list')
        questions = Questions.objects.filter(homework_id=h_id)  # 根据作业id挑选出当前作业的所有问题
        pd_list = []
        xz_list = []
        jd_list = []
        for q in questions:
            if q.questionType == 'pd':
                pd_list.append(q)
            elif q.questionType == 'xz':
                xz_list.append(q)
            elif q.questionType == 'jd':
                jd_list.append(q)
        return render(request, 'homework_details.html', locals())


class Judge(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            h_id = request.POST.get('h')  # 获取作业id
            number = request.session['user']['number']  # 获取登录学生学号
            s = StudentScore.objects.filter(student_id=number, homework_id=h_id).first()  # 判断是否已提交作业
            if s is None:  # 未提交才可执行
                h_obj = Homework.objects.filter(id=h_id)  # 根据作业id挑选出当前作业对象
                questions = Questions.objects.filter(homework=h_obj.first()).all()  # 根据作业对象挑选出当前作业的所有问题
                h_score = HomeworkSocre.objects.filter(homework=h_obj.first()).first()
                pd = questions.filter(questionType='pd').all()  # 挑选出所有判断题
                xz = questions.filter(questionType='xz').all()  # 挑选出所有选择题
                jd = questions.filter(questionType='jd').all()  # 挑选出所有简答题
                pd_score = 0
                if h_score is None:
                    h_score = HomeworkSocre.objects.create(homework=h_obj.first())  # 没有设置作业分数时
                for i, p in enumerate(pd):
                    pd_a = request.POST.get(str(p.id))  # 根据题目id获取学生的答案
                    pd_obj = pd[i]
                    if pd_obj.answer == pd_a:
                        pd_score += 1
                        # 添加做题日志
                        pd_log = StudentAnswerLog.objects.create(student_id=number, homework_id=h_id,
                                                                 question=pd_obj, answer=pd_a,
                                                                 score=h_score.panduan_score, questionType='pd')
                        pd_log.save()
                    else:
                        pd_score += 0
                        pd_log1 = StudentAnswerLog.objects.create(student_id=number, homework_id=h_id,
                                                                  question=pd_obj, answer=pd_a, score=0,
                                                                  questionType='pd')
                        pd_log1.save()
                pd_score *= h_score.panduan_score  # 判断题总分

                xz_score = 0
                for j, x in enumerate(xz):
                    xz_a = request.POST.get(str(x.id))  # 根据题目id获取学生的答案
                    xz_obj = xz[j]
                    if xz_obj.answer == xz_a:
                        xz_score += 1
                        xz_log1 = StudentAnswerLog.objects.create(student_id=number, homework_id=h_id,
                                                                  question=xz_obj, answer=xz_a,
                                                                  score=h_score.xuanze_score, questionType='xz')
                        xz_log1.save()
                    else:
                        xz_score += 0
                        xz_log2 = StudentAnswerLog.objects.create(student_id=number, homework_id=h_id,
                                                                  question=xz_obj, answer=xz_a, score=0,
                                                                  questionType='xz')
                        xz_log2.save()
                xz_score *= h_score.xuanze_score  # 选择题总分

                for k, j in enumerate(jd):
                    jd_a = request.POST.get(str(j.id))  # 根据题目id获取学生的答案
                    jd_obj = jd[k]
                    jd_log = StudentAnswerLog.objects.create(student_id=number, homework_id=h_id,
                                                             question=jd_obj, answer=jd_a, questionType='jd')
                    jd_log.save()
                total = pd_score + xz_score  # 判断题加选择分数
                s = StudentScore.objects.create(student_id=number, homework=h_obj.first(), pd_score=pd_score,
                                                xz_score=xz_score, total=total)

                if s:
                    s.save()
                    h_update_obj = h_obj.update(answer_nums=int(h_obj.first().answer_nums) + 1)
                    return redirect(reverse('homework:homework'))
            else:
                return redirect(reverse('homework:homework'))

        except Exception as e:
            return redirect(reverse('homework:homework'))


# 检查学生是否已提交作业
class Check(View):
    def get(self, request):
        h_id = request.GET.get('h')  # 获取作业id
        number = request.session['user']['number']  # 获取已登录学生id
        s = StudentScore.objects.filter(student_id=number, homework_id=h_id)  # 判断是否已提交作业
        if s:
            return JsonResponse({'status': True})
        else:
            return JsonResponse({'status': False})


# 增加作业
class UploadHomework(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            homework_name = request.POST.get('homework-name')
            homework_id = request.POST.get('homework-id')
            homework_desc = request.POST.get('homework-desc')
            teacher = request.session['user']['number']
            if homework_id == '':
                homework_id = 'hwm0000'
            if homework_desc == '':
                homework_desc = '无'
            h_obj = Homework.objects.create(name=homework_name, homeworkId=homework_id, desc=homework_desc,
                                            teacher_id=teacher)
            if h_obj:
                h_obj.save()
                return JsonResponse({'status': 'success'})
            else:
                h_obj.delete()
                return JsonResponse({'status': 'error'})
        except Exception as e:
            return JsonResponse({'status': 'error'})


# 增加判断题
class AddPDQuestion(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            homework = request.POST.get('homework')
            pd_question = request.POST.get('pd-question')
            pd_answer = request.POST.get('pd-answer')
            teacher = request.session['user']['number']
            q_obj = Questions.objects.create(homework_id=homework, teacher_id=teacher, questionType='pd',
                                             context=pd_question, choice_a='', choice_b='',
                                             choice_c='', choice_d='', answer=pd_answer)
            if q_obj:
                q_obj.save()
                return JsonResponse({'status': 'success'})
            else:
                q_obj.delete()
                return JsonResponse({'status': 'error'})
        except Exception as e:
            return JsonResponse({'status': 'error'})


# 增加选择题
class AddXZQuestion(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            homework = request.POST.get('homework')
            xz_question = request.POST.get('xz-question')  # 获取题目
            xz_answer_A = request.POST.get('xz-answer-A')  # 获取选项内容
            xz_answer_B = request.POST.get('xz-answer-B')
            xz_answer_C = request.POST.get('xz-answer-C')
            xz_answer_D = request.POST.get('xz-answer-D')
            xz_answer = request.POST.get('xz-answer')  # 获取答案
            teacher = request.session['user']['number']
            q_obj = Questions.objects.create(homework_id=homework, teacher_id=teacher, questionType='xz',
                                             context=xz_question, choice_a=xz_answer_A, choice_b=xz_answer_B,
                                             choice_c=xz_answer_C, choice_d=xz_answer_D, answer=xz_answer)
            if q_obj:
                q_obj.save()
                return JsonResponse({'status': 'success'})
            else:
                q_obj.delete()
                return JsonResponse({'status': 'error'})
        except Exception as e:
            return JsonResponse({'status': 'error'})


# 增加简答题
class AddJDQuestion(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            homework = request.POST.get('homework')
            jd_question = request.POST.get('jd-question')
            jd_answer = request.POST.get('jd-answer')
            teacher = request.session['user']['number']
            q_obj = Questions.objects.create(homework_id=homework, teacher_id=teacher, questionType='jd',
                                             context=jd_question, choice_a='', choice_b='',
                                             choice_c='', choice_d='', answer=jd_answer)
            if q_obj:
                q_obj.save()
                return JsonResponse({'status': 'success'})
            else:
                q_obj.delete()
                return JsonResponse({'status': 'error'})
        except Exception as e:
            return JsonResponse({'status': 'error'})


# 发布作业
class Release(View):
    def get(self, request):
        pass

    def post(self, request):
        try:
            homeworkid = request.POST.get('homeworkid')
            h_obj = Homework.objects.filter(id=homeworkid)
            if h_obj:
                h_update_obj = h_obj.update(is_release=1)
                if h_update_obj:
                    return JsonResponse({'status': 'success'})
                else:
                    return JsonResponse({'status': 'error'})
            else:
                return JsonResponse({'status': 'error'})
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error'})


# 获取已提交作业的学生
class ReleaseStudent(View):
    def get(self, request):
        homework_id = request.GET.get('homework-id')
        sc_obj = StudentScore.objects.filter(homework_id=int(homework_id)).all()
        data = []
        for s in sc_obj:
            sp = StudentProfile.objects.filter(student_number=s.student_id).first()
            data.append(sp)
        return JsonResponse({'data': serializers.serialize('json', data)})


# 批改简答题
class Correct(View):
    def get(self, request):
        student_id = request.GET.get('studentid')
        homework_id = request.GET.get('homeworkid')
        SAL_obj = StudentAnswerLog.objects.filter(student_id=student_id,homework_id=homework_id)
        pd_list = []
        xz_list = []
        jd_list = []
        for sal in SAL_obj:
            if sal.questionType == 'pd':
                pd_list.append(sal)
            elif sal.questionType == 'xz':
                xz_list.append(sal)
            elif sal.questionType == 'jd':
                jd_list.append(sal)
        return render(request, 'correct.html', locals())

    def post(self, request):
        try:
            studentid = request.POST.get('studentid')
            homeworkid = request.POST.get('homeworkid')
            SAL_obj = StudentAnswerLog.objects.filter(student_id=studentid, homework_id=homeworkid).all()  # 获取学生答题记录对象
            jd_score = 0  # 简答题总分
            for i, s in enumerate(SAL_obj):
                if s.questionType == 'jd':
                    qid = request.POST.get(str(s.question_id))
                    qscore = request.POST.get('score' + str(s.question_id))  # 接收所得分数
                    question_obj = SAL_obj.filter(question_id=qid)  # 获取题目对象
                    if question_obj:
                        question_update_obj = question_obj.update(score=qscore)  # 更新简答题分数
                        jd_score += int(qscore)
            SS_obj = StudentScore.objects.filter(student_id=studentid, homework_id=homeworkid)  # 获取学生分数对象
            if SS_obj:
                ss_update_obj = SS_obj.update(jd_score=jd_score)
                if ss_update_obj:
                    ss = SS_obj.first()
                    SS_update_obj = SS_obj.update(total=int(ss.pd_score) + int(ss.xz_score) + int(ss.jd_score),
                                                  is_correct=1)  # 更新作业总分和公布答案
            return redirect(reverse('homework:homework'))
        except Exception as e:
            print(e)
            return redirect(reverse('mine:mine'))


# 公布答案
class Answer(View):
    def get(self, request):
        hid = request.GET.get('hid')
        stuid = request.session['user']['number']
        questions = Questions.objects.filter(homework_id=hid)
        SAl_obj = StudentAnswerLog.objects.filter(homework_id=hid, student_id=stuid)
        pd_list = []
        xz_list = []
        jd_list = []
        my_pd_list = []
        my_xz_list = []
        my_jd_list = []
        for q in questions:
            my_answer = SAl_obj.filter(question_id=q.id).first().answer
            if q.questionType == 'pd':
                pd_list.append(q)  # 题目及答案
                my_pd_list.append(my_answer)  # 学生答案
            elif q.questionType == 'xz':
                xz_list.append(q)
                my_xz_list.append(my_answer)
            elif q.questionType == 'jd':
                jd_list.append(q)
                my_jd_list.append(my_answer)
        return render(request, 'answer.html', locals())
