#!/bin/bash

export CONT_VERSION=2.0

# Build Production AMD64
docker buildx build --platform linux/amd64 -t quay.io/niklaushirt/ ibm-aiops-tools:$CONT_VERSION --load .
docker push quay.io/niklaushirt/ ibm-aiops-tools:$CONT_VERSION

