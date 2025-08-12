


echo "----------------------------------------------------------------------------------------------------------"
echo "----------------------------------------------------------------------------------------------------------"
echo "🚀 TOPOLOGY - COPY RISK TOPOLOGY TO POD - $TOPOLOGY_NAME"
echo "----------------------------------------------------------------------------------------------------------"
echo "Create Custom Topology - Copy Topology to File Observer"

export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')

export TOPOLOGY_NAME=risk-proximity
cd ibm-aiops-deployer/ansible

# Get FILE_OBSERVER_POD
FILE_OBSERVER_POD=$(oc get po -n $AIOPS_NAMESPACE -l app.kubernetes.io/instance=aiops-topology,app.kubernetes.io/name=file-observer -o jsonpath='{.items[0].metadata.name}')
echo $FILE_OBSERVER_POD
LOAD_FILE_NAME=$TOPOLOGY_NAME"-file.txt"

FILE_OBSERVER_CAP=$(pwd)"/roles/ibm-aiops-demo-content/templates/topology/$LOAD_FILE_NAME"


echo $FILE_OBSERVER_POD
echo $FILE_OBSERVER_CAP
echo $TARGET_FILE_PATH
TARGET_FILE_PATH="/opt/ibm/netcool/asm/data/file-observer/${LOAD_FILE_NAME}"
echo "  Copying capture file [${FILE_OBSERVER_CAP}] to file observer pod"
echo "oc cp -n $AIOPS_NAMESPACE ${FILE_OBSERVER_CAP} ${FILE_OBSERVER_POD}:${TARGET_FILE_PATH}"
oc cp -n $AIOPS_NAMESPACE ${FILE_OBSERVER_CAP} ${FILE_OBSERVER_POD}:${TARGET_FILE_PATH}






echo "----------------------------------------------------------------------------------------------------------"
echo "----------------------------------------------------------------------------------------------------------"
echo "🚀 TOPOLOGY - CREATE OVERLAY TOPOLOGY - $TOPOLOGY_NAME"
echo "----------------------------------------------------------------------------------------------------------"
echo "Create Custom Topology - Create File Observer Job"


export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')
LOAD_FILE_NAME=$TOPOLOGY_NAME"-file.txt"
TARGET_FILE_PATH="/opt/ibm/netcool/asm/data/file-observer/${LOAD_FILE_NAME}"


# Get Credentials
export TOPO_REST_USR=$(oc get secret aiops-topology-asm-credentials -n $AIOPS_NAMESPACE -o jsonpath='{.data.username}' | base64 --decode)
export TOPO_REST_PWD=$(oc get secret aiops-topology-asm-credentials -n $AIOPS_NAMESPACE -o jsonpath='{.data.password}' | base64 --decode)
export LOGIN="$TOPO_REST_USR:$TOPO_REST_PWD"

export TOPO_ROUTE="https://"$(oc get route -n $AIOPS_NAMESPACE aiops-topology-file-observer -o jsonpath={.spec.host})
export JOB_ID=$TOPOLOGY_NAME"-topology"

echo "  URL: $TOPO_ROUTE"
echo "  LOGIN: $LOGIN"
echo "  JOB_ID: $JOB_ID"


# Get FILE_OBSERVER JOB
curl -X "POST" "$TOPO_ROUTE/1.0/file-observer/jobs" --insecure \
  -H 'X-TenantID: cfd95b7e-3bc7-4006-a4a8-a73a79c71255' \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -u $LOGIN \
  -d "{
  \"unique_id\": \"${JOB_ID}\",
  \"description\": \"Automatically created by Nicks scripts\",
  \"parameters\": {
      \"file\": \"${TARGET_FILE_PATH}\"
      }
  }"


sleep 10






echo "----------------------------------------------------------------------------------------------------------"
echo "----------------------------------------------------------------------------------------------------------"
echo "🚀 TOPOLOGY - COPY US NETWORK RISK TOPOLOGY TO POD - $TOPOLOGY_NAME"
echo "----------------------------------------------------------------------------------------------------------"
echo "Create Custom Topology - Copy Topology to File Observer"

export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')


export TOPOLOGY_NAME=us-network-risk
cd ibm-aiops-deployer/ansible

# Get FILE_OBSERVER_POD
FILE_OBSERVER_POD=$(oc get po -n $AIOPS_NAMESPACE -l app.kubernetes.io/instance=aiops-topology,app.kubernetes.io/name=file-observer -o jsonpath='{.items[0].metadata.name}')
echo $FILE_OBSERVER_POD
LOAD_FILE_NAME=$TOPOLOGY_NAME"-file.txt"

FILE_OBSERVER_CAP=$(pwd)"/roles/ibm-aiops-demo-content/templates/topology/$LOAD_FILE_NAME"

echo $FILE_OBSERVER_POD
echo $FILE_OBSERVER_CAP
echo $TARGET_FILE_PATH
TARGET_FILE_PATH="/opt/ibm/netcool/asm/data/file-observer/${LOAD_FILE_NAME}"
echo "  Copying capture file [${FILE_OBSERVER_CAP}] to file observer pod"
echo "oc cp -n $AIOPS_NAMESPACE ${FILE_OBSERVER_CAP} ${FILE_OBSERVER_POD}:${TARGET_FILE_PATH}"
oc cp -n $AIOPS_NAMESPACE ${FILE_OBSERVER_CAP} ${FILE_OBSERVER_POD}:${TARGET_FILE_PATH}






echo "----------------------------------------------------------------------------------------------------------"
echo "----------------------------------------------------------------------------------------------------------"
echo "🚀 TOPOLOGY - CREATE OVERLAY TOPOLOGY - $TOPOLOGY_NAME"
echo "----------------------------------------------------------------------------------------------------------"
echo "Create Custom Topology - Create File Observer Job"


export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')
LOAD_FILE_NAME=$TOPOLOGY_NAME"-file.txt"
TARGET_FILE_PATH="/opt/ibm/netcool/asm/data/file-observer/${LOAD_FILE_NAME}"


# Get Credentials
export TOPO_REST_USR=$(oc get secret aiops-topology-asm-credentials -n $AIOPS_NAMESPACE -o jsonpath='{.data.username}' | base64 --decode)
export TOPO_REST_PWD=$(oc get secret aiops-topology-asm-credentials -n $AIOPS_NAMESPACE -o jsonpath='{.data.password}' | base64 --decode)
export LOGIN="$TOPO_REST_USR:$TOPO_REST_PWD"

export TOPO_ROUTE="https://"$(oc get route -n $AIOPS_NAMESPACE aiops-topology-file-observer -o jsonpath={.spec.host})
export JOB_ID=$TOPOLOGY_NAME"-topology"

echo "  URL: $TOPO_ROUTE"
echo "  LOGIN: $LOGIN"
echo "  JOB_ID: $JOB_ID"


# Get FILE_OBSERVER JOB
curl -X "POST" "$TOPO_ROUTE/1.0/file-observer/jobs" --insecure \
  -H 'X-TenantID: cfd95b7e-3bc7-4006-a4a8-a73a79c71255' \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -u $LOGIN \
  -d "{
  \"unique_id\": \"${JOB_ID}\",
  \"description\": \"Automatically created by Nicks scripts\",
  \"parameters\": {
      \"file\": \"${TARGET_FILE_PATH}\"
      }
  }"


sleep 10





echo "----------------------------------------------------------------------------------------------------------"
echo "----------------------------------------------------------------------------------------------------------"
echo "🚀 TOPOLOGY - COPY EU RISK TOPOLOGY TO POD - $TOPOLOGY_NAME"
echo "----------------------------------------------------------------------------------------------------------"

export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')

echo "Create Custom Topology - Copy Topology to File Observer"

export TOPOLOGY_NAME=risk-proximity-EU
cd ibm-aiops-deployer/ansible

# Get FILE_OBSERVER_POD
FILE_OBSERVER_POD=$(oc get po -n $AIOPS_NAMESPACE -l app.kubernetes.io/instance=aiops-topology,app.kubernetes.io/name=file-observer -o jsonpath='{.items[0].metadata.name}')
echo $FILE_OBSERVER_POD
LOAD_FILE_NAME=$TOPOLOGY_NAME"-file.txt"

FILE_OBSERVER_CAP=$(pwd)"/roles/ibm-aiops-demo-content/templates/topology/$LOAD_FILE_NAME"

echo $FILE_OBSERVER_POD
echo $FILE_OBSERVER_CAP
echo $TARGET_FILE_PATH
TARGET_FILE_PATH="/opt/ibm/netcool/asm/data/file-observer/${LOAD_FILE_NAME}"
echo "  Copying capture file [${FILE_OBSERVER_CAP}] to file observer pod"
echo "oc cp -n $AIOPS_NAMESPACE ${FILE_OBSERVER_CAP} ${FILE_OBSERVER_POD}:${TARGET_FILE_PATH}"
oc cp -n $AIOPS_NAMESPACE ${FILE_OBSERVER_CAP} ${FILE_OBSERVER_POD}:${TARGET_FILE_PATH}






echo "----------------------------------------------------------------------------------------------------------"
echo "----------------------------------------------------------------------------------------------------------"
echo "🚀 TOPOLOGY - CREATE EU OVERLAY TOPOLOGY - $TOPOLOGY_NAME"
echo "----------------------------------------------------------------------------------------------------------"
echo "Create Custom Topology - Create File Observer Job"


export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')
LOAD_FILE_NAME=$TOPOLOGY_NAME"-file.txt"
TARGET_FILE_PATH="/opt/ibm/netcool/asm/data/file-observer/${LOAD_FILE_NAME}"


# Get Credentials
export TOPO_REST_USR=$(oc get secret aiops-topology-asm-credentials -n $AIOPS_NAMESPACE -o jsonpath='{.data.username}' | base64 --decode)
export TOPO_REST_PWD=$(oc get secret aiops-topology-asm-credentials -n $AIOPS_NAMESPACE -o jsonpath='{.data.password}' | base64 --decode)
export LOGIN="$TOPO_REST_USR:$TOPO_REST_PWD"

export TOPO_ROUTE="https://"$(oc get route -n $AIOPS_NAMESPACE aiops-topology-file-observer -o jsonpath={.spec.host})
export JOB_ID=$TOPOLOGY_NAME"-topology"

echo "  URL: $TOPO_ROUTE"
echo "  LOGIN: $LOGIN"
echo "  JOB_ID: $JOB_ID"


# Get FILE_OBSERVER JOB
curl -X "POST" "$TOPO_ROUTE/1.0/file-observer/jobs" --insecure \
  -H 'X-TenantID: cfd95b7e-3bc7-4006-a4a8-a73a79c71255' \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -u $LOGIN \
  -d "{
  \"unique_id\": \"${JOB_ID}\",
  \"description\": \"Automatically created by Nicks scripts\",
  \"parameters\": {
      \"file\": \"${TARGET_FILE_PATH}\"
      }
  }"


sleep 10











  
export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')
export CONSOLE_ROUTE=$(oc get route -n $AIOPS_NAMESPACE cp-console  -o jsonpath={.spec.host})          
export CPD_ROUTE=$(oc get route -n $AIOPS_NAMESPACE cpd  -o jsonpath={.spec.host})          
export CPADMIN_PWD=$(oc -n $AIOPS_NAMESPACE get secret platform-auth-idp-credentials -o jsonpath='{.data.admin_password}' | base64 -d && echo)
export CPADMIN_USER=$(oc -n $AIOPS_NAMESPACE get secret platform-auth-idp-credentials -o jsonpath='{.data.admin_username}' | base64 -d && echo)
export ACCESS_TOKEN=$(curl -s -k -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -d "grant_type=password&username=$CPADMIN_USER&password=$CPADMIN_PWD&scope=openid" https://$CONSOLE_ROUTE/idprovider/v1/auth/identitytoken|jq -r '.access_token')
export ZEN_API_HOST=$(oc get route -n $AIOPS_NAMESPACE cpd -o jsonpath='{.spec.host}')
export ZEN_TOKEN=$(curl -k -XGET https://$ZEN_API_HOST/v1/preauth/validateAuth \
-H "username: $CPADMIN_USER" \
-H "iam-token: $ACCESS_TOKEN"|jq -r '.accessToken')
echo $ZEN_TOKEN

export ROUTE=$(oc get route -n $AIOPS_NAMESPACE cpd -o jsonpath={.spec.host})


# curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/userconfig/filters" \
# -X 'GET' \
# -H 'content-type: application/json' \
# -H 'accept: */*' \
# -H 'content-type: application/json' \
# -H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" 


curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/userconfig/filters" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{ 
      "name": "My Network Equipment",
      "description": "Automatically created by Nicks scripts",
      "type": "inventory",
      "mode": "basic",
      "accessControlList": {
          "read": {
              "teams": [],
              "users": [
                  "*"
              ]
          },
          "admin": {
              "teams": [],
              "users": [
                  "demo"
              ]
          },
          "write": {
              "teams": [],
              "users": []
          }
        },
        "conditionSet": {
            "conditions": [{
                "id": "filterBuilderCondition-myrouter",
                "type": "condition",
                "field": "entityTypes",
                "operator": "includesAny",
                "value": ["router","switch","location","networkinterface","fiberPort","fiberConnection"]
            }]
        }
}'


curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/userconfig/filters" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{ 
      "name": "My Risks",
      "description": "Automatically created by Nicks scripts",
      "type": "inventory",
      "mode": "basic",
      "accessControlList": {
          "read": {
              "teams": [],
              "users": [
                  "*"
              ]
          },
          "admin": {
              "teams": [],
              "users": [
                  "demo"
              ]
          },
          "write": {
              "teams": [],
              "users": []
          }
        },
        "conditionSet": {
            "conditions": [{
                "id": "filterBuilderCondition-myrisks",
                "type": "condition",
                "field": "entityTypes",
                "operator": "includesAny",
                "value": ["fire","alertHeadline","weatherAlert","wildfire","earthquake","storm","tsunami","volcano","avalanche","landslide","drought","heatwave","coldwave","wildfire","hazardousMaterialRelease","nuclearIncident"]
            }]
        }
}'



curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/userconfig/filters" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{ 
      "name": "RobotShop",
      "description": "Automatically created by Nicks scripts",
      "type": "inventory",
      "mode": "basic",
      "accessControlList": {
          "read": {
              "teams": [],
              "users": [
                  "*"
              ]
          },
          "admin": {
              "teams": [],
              "users": [
                  "demo"
              ]
          },
          "write": {
              "teams": [],
              "users": []
          }
        },
        "conditionSet": {
        "conditions": [{
            "id": "filterBuilderCondition-1754913872305",
            "field": "tags",
            "operator": "matches",
            "value": ["robot-shop"],
            "type": "condition"
        }]
        }
}'



export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')
export CONSOLE_ROUTE=$(oc get route -n $AIOPS_NAMESPACE cp-console  -o jsonpath={.spec.host})          
export CPD_ROUTE=$(oc get route -n $AIOPS_NAMESPACE cpd  -o jsonpath={.spec.host})          
export CPADMIN_PWD=$(oc -n $AIOPS_NAMESPACE get secret platform-auth-idp-credentials -o jsonpath='{.data.admin_password}' | base64 -d && echo)
export CPADMIN_USER=$(oc -n $AIOPS_NAMESPACE get secret platform-auth-idp-credentials -o jsonpath='{.data.admin_username}' | base64 -d && echo)
export ACCESS_TOKEN=$(curl -s -k -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -d "grant_type=password&username=$CPADMIN_USER&password=$CPADMIN_PWD&scope=openid" https://$CONSOLE_ROUTE/idprovider/v1/auth/identitytoken|jq -r '.access_token')
export ZEN_API_HOST=$(oc get route -n $AIOPS_NAMESPACE cpd -o jsonpath='{.spec.host}')
export ZEN_TOKEN=$(curl -k -XGET https://$ZEN_API_HOST/v1/preauth/validateAuth \
-H "username: $CPADMIN_USER" \
-H "iam-token: $ACCESS_TOKEN"|jq -r '.accessToken')
echo $ZEN_TOKEN

export ROUTE=$(oc get route -n $AIOPS_NAMESPACE cpd -o jsonpath={.spec.host})


      # ---------------------------------
      # inGroup
      # ---------------------------------

export result=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/templates?templateType=token" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d ' {
"keyIndexName": "topologyTemplate:inGroupTemplate",
"templateType": "token",
"description": "Automatically created by Nicks scripts",
"extraProperties": {
  "correlatable": "true",
  "iconId": "network",
  "window": {
    "type": "rolling",
    "durationMS": 900000
  },
  "defaultHopType": "e2e"
},
"userId": "demo",
"_groupCount": 0,
"name": "inGroupTemplate",
"entityTypes": ["network"]
}')





export result=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/templates?templateType=token" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d ' {
"keyIndexName": "topologyTemplate:inGroupTemplate",
"templateType": "token",
"description": "Automatically created by Nicks scripts",
"extraProperties": {
  "correlatable": "true",
  "iconId": "network",
  "window": {
    "type": "rolling",
    "durationMS": 900000
  },
  "defaultHopType": "e2e"
},
"userId": "demo",
"_groupCount": 0,
"name": "inGroupTemplate",
"entityTypes": ["network"]
}')

export templateID=$(echo $result | jq -r '._id')
echo $templateID



export resultRule=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/rules" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
  "name": "inGroupTemplate--inGroupRule",
  "ruleType": "groupPerTokenRule",
  "ruleStatus": "enabled",
  "tokens": ["Group ${inGroup}"],
  "observers": [],
  "providers": [],
  "entityTypes": [],
  "templateName": "inGroupTemplate",
  "_references": [{
      "_fromId": "'${templateID}'",
      "_edgeType": "managesRule"
  }]
}')


echo $resultRule


# ---------------------------------
# city
# ---------------------------------

export result=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/templates?templateType=token" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "cityTemplate",
    "description": "Automatically created by Nicks scripts",
    "keyIndexName": "topologyTemplate:cityTemplate",
    "templateType": "token",
    "entityTypes": ["infrastructure"],
    "extraProperties": {
        "correlatable": true,
        "iconId": "site",
        "window": {
            "type": "rolling",
            "durationMS": 900000
        },
        "defaultHopType": "e2e"
    },
    "tags": []
}')





export result=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/templates?templateType=token" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "cityTemplate",
    "description": "Automatically created by Nicks scripts",
    "keyIndexName": "topologyTemplate:cityTemplate",
    "templateType": "token",
    "entityTypes": ["infrastructure"],
    "extraProperties": {
        "correlatable": true,
        "iconId": "site",
        "window": {
            "type": "rolling",
            "durationMS": 900000
        },
        "defaultHopType": "e2e"
    },
    "tags": []
}')




export templateID=$(echo $result | jq -r '._id')
echo $templateID

export resultRule=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/rules" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "cityTemplate--cityRule",
    "ruleType": "groupPerTokenRule",
    "ruleStatus": "enabled",
    "tokens": ["Site ${city}"],
    "observers": [],
    "providers": [],
    "entityTypes": [],
    "templateName": "cityTemplate",
    "_references": [{
        "_fromId": "'${templateID}'",
        "_edgeType": "managesRule"
    }]
}')

echo $resultRule






# ---------------------------------
# app
# ---------------------------------

export result=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/templates?templateType=token" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "appTemplate",
    "description": "Automatically created by Nicks scripts",
    "keyIndexName": "topologyTemplate:appTemplate",
    "templateType": "token",
    "entityTypes": ["namespace"],
    "extraProperties": {
        "correlatable": true,
        "iconId": "application",
        "window": {
            "type": "rolling",
            "durationMS": 900000
        },
        "defaultHopType": "e2e"
    },
    "tags": []
}')



export result=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/templates?templateType=token" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "appTemplate",
    "description": "Automatically created by Nicks scripts",
    "keyIndexName": "topologyTemplate:appTemplate",
    "templateType": "token",
    "entityTypes": ["namespace"],
    "extraProperties": {
        "correlatable": true,
        "iconId": "application",
        "window": {
            "type": "rolling",
            "durationMS": 900000
        },
        "defaultHopType": "e2e"
    },
    "tags": []
}')




export templateID=$(echo $result | jq -r '._id')
echo $templateID

export resultRule=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/rules" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "appTemplate--appRule",
    "ruleType": "groupPerTokenRule",
    "ruleStatus": "enabled",
    "tokens": ["Application ${app}"],
    "observers": [],
    "providers": [],
    "entityTypes": [],
    "templateName": "appTemplate",
    "_references": [{
        "_fromId": "'${templateID}'",
        "_edgeType": "managesRule"
    }]
}')

echo $resultRule




# ---------------------------------
# location
# ---------------------------------

export result=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/templates?templateType=token" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "locationTemplate",
    "description": "Automatically created by Nicks scripts",
    "keyIndexName": "topologyTemplate:locationTemplate",
    "templateType": "token",
    "entityTypes": ["infrastructure"],
    "extraProperties": {
        "correlatable": true,
        "iconId": "site",
        "window": {
            "type": "rolling",
            "durationMS": 900000
        },
        "defaultHopType": "e2e"
    },
    "tags": []
}')



export result=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/templates?templateType=token" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "locationTemplate",
    "description": "Automatically created by Nicks scripts",
    "keyIndexName": "topologyTemplate:locationTemplate",
    "templateType": "token",
    "entityTypes": ["infrastructure"],
    "extraProperties": {
        "correlatable": true,
        "iconId": "site",
        "window": {
            "type": "rolling",
            "durationMS": 900000
        },
        "defaultHopType": "e2e"
    },
    "tags": []
}')




export templateID=$(echo $result | jq -r '._id')
echo $templateID

export resultRule=$(curl "https://$ROUTE/api/p/hdm_asm_ui_api/1.0/ui-api/rules" \
-X 'POST' \
-H 'content-type: application/json' \
-H 'accept: */*' \
-H 'content-type: application/json' \
-H "Cookie: ___tk67142224=1655282500640; ibm-private-cloud-session=$ZEN_TOKEN" \
-d '{
    "name": "locationTemplate--locationRule",
    "ruleType": "groupPerTokenRule",
    "ruleStatus": "enabled",
    "tokens": ["Site ${location}"],
    "observers": [],
    "providers": [],
    "entityTypes": [],
    "templateName": "locationTemplate",
    "_references": [{
        "_fromId": "'${templateID}'",
        "_edgeType": "managesRule"
    }]
}')

echo $resultRule









export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')
export AIO_PLATFORM_ROUTE=$(oc get route -n $AIOPS_NAMESPACE aimanager-aio-controller -o jsonpath={.spec.host})

echo "        Namespace:          $AIOPS_NAMESPACE"
echo "        AIO_PLATFORM_ROUTE: $AIO_PLATFORM_ROUTE"
echo ""

echo "Sucessfully logged in" 
echo ""
echo "Running K8S OBSERVER"



curl -X 'POST' --insecure \
"https://$AIO_PLATFORM_ROUTE/v1/observer/runjob/robot-shop-topology" \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-H "authorization: Bearer $ZEN_TOKEN"  


curl -X 'POST' --insecure \
"https://$AIO_PLATFORM_ROUTE/v1/observer/runjob/sock-shop-topology" \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-H "authorization: Bearer $ZEN_TOKEN"  

curl -X 'POST' --insecure \
"https://$AIO_PLATFORM_ROUTE/v1/observer/runjob/us-network-risk-topology" \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-H "authorization: Bearer $ZEN_TOKEN"  


curl -X 'POST' --insecure \
"https://$AIO_PLATFORM_ROUTE/v1/observer/runjob/risk-proximity-EU-topology" \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-H "authorization: Bearer $ZEN_TOKEN"  

curl -X 'POST' --insecure \
"https://$AIO_PLATFORM_ROUTE/v1/observer/runjob/acme-topology" \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-H "authorization: Bearer $ZEN_TOKEN"  


curl -X 'POST' --insecure \
"https://$AIO_PLATFORM_ROUTE/v1/observer/runjob/risk-proximity-topology" \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-H "authorization: Bearer $ZEN_TOKEN"  

