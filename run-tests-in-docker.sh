#!/bin/bash

sudo /etc/init.d/xvfb start && sleep 2

/bin/bash -lc "npm test"