FROM nginx:1.15.8

MAINTAINER zhaozh "zhaozhonghua@jsh.com"

COPY dist /usr/share/nginx/html/pc
COPY jsh-study-front-pc.conf /etc/nginx/conf.d
