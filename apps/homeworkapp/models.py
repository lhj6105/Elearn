from django.db import models

# Create your models here.
from userapp.models import *


class Homework(models.Model):
    teacher = models.ForeignKey(TeacherProfile, verbose_name='老师', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, verbose_name='作业名')
    homeworkId = models.CharField(max_length=20, verbose_name='作业号', default='hwm0000')
    desc = models.CharField(max_length=400, verbose_name='作业说明', blank=True, default='无')
    createTime = models.DateTimeField(auto_now_add=True, verbose_name='添加时间')
    answer_nums = models.CharField(max_length=10, editable=False, default=0, verbose_name='作答人数')
    is_release = models.BooleanField(default=False, verbose_name='是否发布')

    class Meta:
        db_table = 'homework'
        verbose_name = '作业'
        verbose_name_plural = verbose_name
        ordering = ['-createTime']

    def __str__(self):
        return self.name


class Questions(models.Model):
    #  问题不设置分数，后期认为设置出题的时候判断
    homework = models.ForeignKey(Homework, verbose_name='作业名', on_delete=models.CASCADE)
    teacher = models.ForeignKey(TeacherProfile, verbose_name='老师', on_delete=models.CASCADE)
    questionType = models.CharField(max_length=2, choices=(('pd', '判断'), ('xz', '选择'), ('jd', '简答')),
                                    verbose_name='题目类型')
    context = models.TextField(verbose_name='题目内容')
    answer = models.TextField(verbose_name='正确答案')
    choice_a = models.TextField(verbose_name='A选项', default='我是答案A')
    choice_b = models.TextField(verbose_name='B选项', default='我是答案B')
    choice_c = models.TextField(verbose_name='C选项', default='我是答案C')
    choice_d = models.TextField(verbose_name='D选项', default='我是答案D')
    add_time = models.DateTimeField(auto_now_add=True, verbose_name='添加时间')

    class Meta:
        db_table = 'questions'
        verbose_name = '题目'
        verbose_name_plural = verbose_name
        ordering = ['questionType']

    @property
    def get_context_display(self):
        return self.context

    @property
    def get_question_id(self):
        return self.id

    def __str__(self):
        return '题目:{0} | 正确答案:{1}'.format(self.context, self.answer)


class HomeworkSocre(models.Model):
    homework = models.ForeignKey(Homework, verbose_name='作业名', on_delete=models.CASCADE)
    panduan_score = models.FloatField(verbose_name='判断分值', blank=True, default=1)
    xuanze_score = models.FloatField(verbose_name='选择分值', blank=True, default=1)
    jianda_score = models.FloatField(verbose_name='简答分值', blank=True, default=1)

    class Meta:
        db_table = 'homework_socre'
        verbose_name = '作业总分'
        verbose_name_plural = verbose_name
        ordering = ['id']


class StudentAnswerLog(models.Model):
    ''' 应该在加一个score ， 用于教师对问答题分数的提交'''
    student = models.ForeignKey(StudentProfile, verbose_name='学生', on_delete=models.CASCADE)
    homework = models.ForeignKey(Homework, verbose_name='作业名', on_delete=models.CASCADE)
    question = models.ForeignKey(Questions, verbose_name='题目', on_delete=models.CASCADE)
    answer = models.TextField(verbose_name='用户答案')
    score = models.FloatField(max_length=100, verbose_name='分数', default=0)
    # add_time = models.DateField(auto_now_add=True, verbose_name='作答时间')

    class Meta:
        db_table = 'student_answer_log'
        verbose_name = '做题记录'
        verbose_name_plural = verbose_name

    def __str__(self):
        return '{0}({1}) '.format(self.student.student_number, self.student.student_name)


class StudentScore(models.Model):
    student = models.ForeignKey(StudentProfile, verbose_name='学生', on_delete=models.CASCADE)
    homework = models.ForeignKey(Homework, verbose_name='作业名', on_delete=models.CASCADE)
    pd_score = models.FloatField(verbose_name='判断', default=0)
    xz_score = models.FloatField(verbose_name='选择', default=0)
    jd_score = models.FloatField(verbose_name='简答', default=0)
    total = models.FloatField(verbose_name='总分', default=0)
    add_time = models.DateTimeField(verbose_name='提交时间', auto_now_add=True)

    class Meta:
        db_table = 'student_score'
        verbose_name = '学生总分'
        verbose_name_plural = verbose_name

    def __str__(self):
        return '{0}({1}) 作业名:{2} | 总分:{3}'.format(self.student.student_number, self.student.student_name,
                                                 self.homework.name, self.total)
