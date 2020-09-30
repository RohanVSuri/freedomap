redis-server &
rq worker freedomap-tasks &
rqscheduler &
flask run --host 0.0.0.0
