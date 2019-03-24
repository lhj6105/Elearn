在线学习平台项目

教师：上传、删除视频，上传、删除课件，发布、修改、批改、删除作业
学生：观看视频，下载课件，提交作业

先修改settings.py中DATABASES的数据库

python manage.py makemigrations

python manage.py migrate

pip install -r requirements.txt

下载elasticsearch 2.4
修改 config/elasticsearch.yml文件，末尾增加
http.cors.enabled:  true
http.cors.allow-origin:  "*"
打开 http://localhost:9200, 

下载node.js和elasticsearch_head_master
npm install elasticsearch_head_master
npm start
打开 http://localhost:9100, 