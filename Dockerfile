FROM nginx

ADD ./scripts/conf.d/default.conf /etc/nginx/conf.d/default.conf
ADD ./public /usr/share/nginx/html