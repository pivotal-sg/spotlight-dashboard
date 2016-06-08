#!/bin/bash

/etc/init.d/xvfb start && sleep 2

cd /code && npm test