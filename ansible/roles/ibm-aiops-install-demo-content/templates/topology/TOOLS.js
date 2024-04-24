    export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')
    export TOPOLOGY_REST_USR=$(oc get secret aiops-topology-asm-credentials -n $AIOPS_NAMESPACE -o jsonpath='{.data.username}' | base64 --decode)
    export TOPOLOGY_REST_PWD=$(oc get secret aiops-topology-asm-credentials -n $AIOPS_NAMESPACE -o jsonpath='{.data.password}' | base64 --decode)
    export TOPO_MGT_ROUTE="https://"$(oc get route -n $AIOPS_NAMESPACE topology-manage -o jsonpath={.spec.host})
    export LOGIN="$TOPOLOGY_REST_USR:$TOPOLOGY_REST_PWD"

    echo "    URL: $TOPO_MGT_ROUTE/1.0/rest-observer/rest/resources"
    echo "    LOGIN: $LOGIN"

    kubectl exec -ti -n $AIOPS_NAMESPACE $(oc get po -n $AIOPS_NAMESPACE|grep topology-topology|awk '{print$1}') -- /opt/ibm/graph.tools/bin/backup_ui_config -out backup.json
    kubectl cp -n $AIOPS_NAMESPACE $(oc get po -n $AIOPS_NAMESPACE|grep topology-topology|awk '{print$1}'):/opt/ibm/netcool/asm/data/tools/backup.json ./backup.json
    open ./backup.json

    echo "Upload Topology Customization"
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    if [[ "${OS}" == "darwin" ]]; then
          echo "MAC"
          TOPOLOGY_CUSTOM_FILE=$(pwd)"/roles/ibm-aiops-install-demo-content/templates/topology/UI_config.json"
    else
          TOPOLOGY_CUSTOM_FILE="{{role_path}}/templates/topology/UI_config.json"
    fi    
    kubectl cp $TOPOLOGY_CUSTOM_FILE -n $AIOPS_NAMESPACE $(oc get po -n $AIOPS_NAMESPACE|grep topology-topology|awk '{print$1}'):/opt/ibm/netcool/asm/data/tools/asm_config.json 
    

    echo "Import Topology Customization"
    #kubectl exec -ti -n $AIOPS_NAMESPACE $(oc get po -n $AIOPS_NAMESPACE|grep topology-topology|awk '{print$1}') -- find /opt/ibm/netcool/asm/data/tools/
    kubectl exec -ti -n $AIOPS_NAMESPACE $(oc get po -n $AIOPS_NAMESPACE|grep topology-topology|awk '{print$1}') -- /opt/ibm/graph.tools/bin/import_ui_config -file asm_config.json




var name = prompt("property name", "name");
var value = prompt("property value", "value");
var options = {
    method: 'POST',
    headers: {
        "X-TenantID": "cfd95b7e-3bc7-4006-a4a8-a73a79c71255",
        "Authorization": "Basic xxxx",
        "Content-type": "application/json"
    },
    body: '{ "' + name + '": "' + value + '"}',
    onSuccess: _onSuccess,
    onError: _onError
};
asmFunctions.sendHttpRequest('https://topology-manage-ibm-aiops.apps.65f9b2d7888b49001e275e92.cloud.techzone.ibm.com/1.0/topology/resources/' + asmProperties._id, options);

function _onSuccess(response, status, headers) {
  asmFunctions.showToasterMessage("normal", "Resource updated.")
}

function _onError(response, status, headers) {
  var msg = JSON.parse(response);
  asmFunctions.showToasterMessage("critical", msg._error.description );
}

https://topology-manage-ibm-aiops.apps.65f9b2d7888b49001e275e92.cloud.techzone.ibm.com/1.0/topology/resources/



var name = prompt("property name", "name");
var value = prompt("property value", "value");
var options = {
    method: 'POST',
    headers: {
        "X-TenantID": "cfd95b7e-3bc7-4006-a4a8-a73a79c71255",
        "Authorization": "Basic xxx",
        "Content-type": "application/json"
    },
    body: '{ "' + name + '": "' + value + '"}',
    onSuccess: _onSuccess,
    onError: _onError
};
asmFunctions.sendHttpRequest('https://topology-manage-ibm-aiops.apps.65f9b2d7888b49001e275e92.cloud.techzone.ibm.com/1.0/topology/resources/' + asmProperties._id, options);

function _onSuccess(response, status, headers) {
  asmFunctions.showToasterMessage("normal", "Resource updated.")
}

function _onError(response, status, headers) {
  var msg = JSON.parse(response);
  asmFunctions.showToasterMessage("critical", msg._error.description );
}



var name = prompt("Name", "name");
var type = prompt("Type", "host");
var edgeType = prompt("Edge type", "connectedTo");
var toOrFrom = prompt("Edge 'to' or 'from' the selected node?", "to");
var options = {
    method: 'POST',
    headers: {
        "X-TenantID": "cfd95b7e-3bc7-4006-a4a8-a73a79c71255",
        "Authorization": "Basic xxxx",
        "Content-type": "application/json"
    },
    body: '{ "name":"' + name + '", "entityTypes": ["' + type + '"], "_references":[{"_' + toOrFrom + 'Id": "' + asmProperties._id +'","_edgeType": "' + edgeType + '"}]}',
    onSuccess: _onSuccess,
    onError: _onError
};
asmFunctions.sendHttpRequest('https://topology-manage-ibm-aiops.apps.65f9b2d7888b49001e275e92.cloud.techzone.ibm.com/1.0/topology/resources/', options);


function _onSuccess(response, status, headers) {
    asmFunctions.showToasterMessage('information', status + ': Created resource ' + headers.entityid);
}
function _onError(response, status, headers) {
  var msg = JSON.parse(response);
  asmFunctions.showToasterMessage("critical", msg._error.description );
}





var options = {
    method: 'DELETE',
    headers: {
        "X-TenantID": "cfd95b7e-3bc7-4006-a4a8-a73a79c71255",
        "Authorization": "Basic xxx",
        "Content-type": "application/json"
    },
    onSuccess: _onSuccess,
    onError: _onError
};
asmFunctions.sendHttpRequest('https://topology-manage-ibm-aiops.apps.65f9b2d7888b49001e275e92.cloud.techzone.ibm.com/1.0/topology/resources/' + asmProperties._id, options);

function _onSuccess(response, status, headers) {
  asmFunctions.showToasterMessage("Information", "Resource '" + asmProperties.name + "' deleted.")
}

function _onError(response, status, headers) {
  var msg = JSON.parse(response);
  asmFunctions.showToasterMessage("critical", msg._error.description );
}



https://topology-manage-ibm-aiops.apps.65f9b2d7888b49001e275e92.cloud.techzone.ibm.com




