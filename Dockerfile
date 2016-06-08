FROM nginx

RUN apt-get update -qqy && \
    apt-get -qqy --no-install-recommends install \
        git \
        bzip2 \
        curl && \
    apt-get clean

RUN mkdir -p /code
WORKDIR /code

ADD package.json /code/package.json

RUN curl -sL https://deb.nodesource.com/setup_5.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

RUN npm install

COPY  . /code

RUN npm install -g webpack
RUN API_HOST='' webpack -p

ADD ./scripts/conf.d/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html && ln -s /code/public /usr/share/nginx/html