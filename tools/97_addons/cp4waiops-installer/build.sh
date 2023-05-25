#!/bin/bash

export CONT_VERSION=2.0


# Build Production AMD64
docker buildx build --platform linux/amd64 -t quay.io/niklaushirt/ibmaiops-installer:$CONT_VERSION --load .
docker push quay.io/niklaushirt/ibmaiops-installer:$CONT_VERSION




# Local Test Mac
docker build -t niklaushirt/ibmaiops-installer:arm$CONT_VERSION .
#sudo docker push ibmaiops-install:arm$CONT_VERSION
docker run -p 8080:8080 niklaushirt/ibmaiops-installer:arm$CONT_VERSION
