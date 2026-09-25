#!/bin/bash
# checkwatsonxkey.sh
#
# Purpose: Check whether a given API Key exists. If found, show associated data to identify project IDs
#
# Author Markus W. Fehr
# September 17, 2026

if [ $# -eq 0 ]
  then
    echo ""
    echo "No arguments supplied"
    echo "Usage: $0 <API key>"
    echo ""
    exit
fi

#
# part 1 - check if the API Key is found
#

API_KEY=$1

echo ""
echo "Watsonx API Key validation"
echo ""

RESPONSE=$(curl -s -X POST \
https://iam.cloud.ibm.com/identity/token \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=$API_KEY")

if echo "$RESPONSE" | jq -e '.access_token' > /dev/null 2>&1; then
  echo "Watsonx API Key $API_KEY found."
  echo ""
fi

if echo "$RESPONSE" | jq -e '.errorMessage' > /dev/null 2>&1; then
  echo "Watsonx API Key $API_KEY not found."
  echo ""
  echo "Detailed error message:"
  echo ""
  echo $RESPONSE | jq
  exit 1
fi

#
# part 2 - Read all projects associated to this API Key
#

IAM_TOKEN=$(echo "$RESPONSE" | jq -r .access_token)

PROJECTS=$(curl -s \
-H "Authorization: Bearer $IAM_TOKEN" \
"https://api.dataplatform.cloud.ibm.com/v2/projects?limit=100")

TOTAL=$(echo "$PROJECTS" | jq -r '.total_results')
echo "Projects found: $TOTAL"
echo ""

echo "$PROJECTS" | jq -r --arg api_key "$API_KEY" '
  .resources[] |
  "Project ID:  \(.metadata.guid)",
  "Name:        \(.entity.name)",
  "Description: \(.entity.description)",
  "Creator:     \(.entity.creator)",
  "Region:      \(.entity.storage.properties.bucket_region)",
  "",
  "export WATSONX_API_KEY=\($api_key)",
  "export WATSONX_PROJECT_ID=\(.metadata.guid)",
  "export WATSONX_API_URL=https://\(.entity.storage.properties.bucket_region).ml.cloud.ibm.com",
  ""
'


