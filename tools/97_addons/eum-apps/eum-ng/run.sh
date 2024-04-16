#!/bin/sh

# set -x

IMAGE="eum-sim:2.0.0"

if [ -z "$1" ]
then
    echo "Usage:"
    echo "run.sh [rdbpft]"
    echo "  r - docker run"
    echo "  d - detach?"
    echo "  b - build docker image"
    echo "  p - push docker image"
    echo "  f - run locally"
    echo "  t - run with test config"
    exit 1
fi

if echo "$1" | fgrep "b"
then
    docker build -t $IMAGE .
fi

if echo "$1" | fgrep "p"
then
    docker push $IMAGE
fi

if echo "$1" | fgrep "f"
then
    CONFIG="config-shop"
    if echo "$1" | fgrep "t"
    then
        CONFIG="config-test"
    fi
    if [ -d node_modules ]
    then
        echo "Running with $CONFIG"
        DEBUG="front-end:*,load-gen:*"
        NODE_ENV="development"
        TZ="Europe/London"
        export DEBUG NODE_ENV CONFIG TZ
        bin/www
    else
        echo "Run npm install first"
        exit 1
    fi
    exit 0
fi

if echo "$1" | fgrep "r"
then
    MODE="-it"
    if echo "$1" | fgrep "d"
    then
        MODE="-d"
    fi
    CONFIG="config-shop"
    if echo "$1" | fgrep "t"
    then
        CONFIG="config-test"
    fi
    echo "Running with $CONFIG"
    docker run \
        $MODE \
        --rm \
        --name eum-sim \
        --add-host web.robot-shop:34.123.245.143 \
        -e "CONFIG=$CONFIG" \
        -e "BACKENDS=marketingtemp" \
        -e "DEBUG=front-end:*,load-gen:*" \
        -e "TZ=Europe/London" \
        -p "8000:8000" \
        $IMAGE
fi
