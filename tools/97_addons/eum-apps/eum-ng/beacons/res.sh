#!/bin/sh

cat beacon-pl.json | jq -r '.res' | jq '.'
