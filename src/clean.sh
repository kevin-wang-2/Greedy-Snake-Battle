pm2 stop 2;killall -u runner --older-than 1M;pm2 start run.js