    echo "------------------------------------------------------------------------------------------------------------------------------"
    echo " ✅ CHECK WATSONX CREDENTIALS"
    echo "------------------------------------------------------------------------------------------------------------------------------"

    API_KEY=$1

    RESPONSE=$(curl -s -X POST \
    https://iam.cloud.ibm.com/identity/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=$API_KEY")

    #echo "$RESPONSE" | jq

    if echo "$RESPONSE" | jq -e '.errorMessage' > /dev/null 2>&1; then
      echo ""
      echo "    🔴🔴🔴🔴🔴🔴 WATSONX TOKEN INVALID - Error returned from IAM. You won't be able to access the WatsonX services in Concert platform."
      echo ""
      exit 1
    else
      echo ""
      echo "    ✅ Successfully retrieved IAM token. You can access the WatsonX services in Concert platform."
      echo ""
    fi

    echo "  ------------------------------------------------------------------------------------------------------------------------------"
    echo "  🛠️ Available Projects:"

    IAM_TOKEN=$(echo "$RESPONSE" | jq -r .access_token)


    curl -s \
    -H "Authorization: Bearer $IAM_TOKEN" \
    "https://api.dataplatform.cloud.ibm.com/v2/projects?limit=100" | jq -r '.resources[] | "     - " + .entity.name + " - " + .metadata.guid'
    
    echo ""
    echo ""
    echo ""



