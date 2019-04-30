pm2 list

cd loan-admin-api
cnpm install
pm2 start npm --kill-timeout 15000 --name admin-api -- run start
cd -

cd loan-app-api
cnpm install
pm2 start npm --kill-timeout 15000 --name app-api -- run start
cd -

cd loan-sub-admin-api
cnpm install
pm2 start npm --kill-timeout 15000 --name sub-admin-api -- run start
cd -

cd file-server
pm2 start fileserver
cd -

pm2 list
