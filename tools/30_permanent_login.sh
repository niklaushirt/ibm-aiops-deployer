export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')
oc project $AIOPS_NAMESPACE 
oc create serviceaccount -n default demo-admin
oc create clusterrolebinding test-admin --clusterrole=cluster-admin --serviceaccount=default:demo-admin



API_TOKEN=$(oc create token -n default demo-admin --duration=999999999s)
API_URL=$(oc status|grep -m1 "In project"|awk '{print$6}')
API_SERVER=$(echo $API_URL| cut -d ":" -f 2| tr -d '/')
CLUSTER_NAME=$(echo $API_URL| cut -d ":" -f 2| tr -d '/'| cut -d "." -f 2)
API_PORT=$(echo $API_URL| cut -d ":" -f 3)                



echo "--------------------------------------------------------------------------------------------------------"
echo " 🚀 Permanent Login for Cluster: "$CLUSTER_NAME
echo "--------------------------------------------------------------------------------------------------------"


echo "# --------------------------------------------------------------------------------------------------------">~/LOGIN_$CLUSTER_NAME.sh
echo "# 🚀 Login Info for Cluster: "$CLUSTER_NAME>>~/LOGIN_$CLUSTER_NAME.sh
echo "# --------------------------------------------------------------------------------------------------------">>~/LOGIN_$CLUSTER_NAME.sh
echo "">>~/LOGIN_$CLUSTER_NAME.sh



echo "#   --------------------------------------------------------------------------------------------------------">>~/LOGIN_$CLUSTER_NAME.sh
echo "#    🚀 Namespaces in Cluster: "$CLUSTER_NAME>>~/LOGIN_$CLUSTER_NAME.sh
CUSTOM_NAMESPACES=$(oc get ns --no-headers| grep -v openshift | grep -v kube- | grep -v open-| awk '{print $1}')
CUSTOM_NAMESPACES=( $( echo $CUSTOM_NAMESPACES ) )
for NS in ${CUSTOM_NAMESPACES[@]};
do
    echo "#       📥 $NS">>~/LOGIN_$CLUSTER_NAME.sh
done
echo "">>~/LOGIN_$CLUSTER_NAME.sh
echo "">>~/LOGIN_$CLUSTER_NAME.sh
echo "">>~/LOGIN_$CLUSTER_NAME.sh



echo "   --------------------------------------------------------------------------------------------------------"
echo "    🚀 Loging into Cluster: "$CLUSTER_NAME
oc login --server=$API_URL --token=$API_TOKEN >/dev/null 2>/dev/null 
echo "       as User:  "$(oc whoami)
echo "    ✅ DONE"
echo "  --------------------------------------------------------------------------------------------------------"




echo "#   --------------------------------------------------------------------------------------------------------">>~/LOGIN_$CLUSTER_NAME.sh
echo "#    🚀 Login for Cluster: "$CLUSTER_NAME" as User: "$(oc whoami)>>~/LOGIN_$CLUSTER_NAME.sh
echo "oc login --server=$API_URL --token=$API_TOKEN">>~/LOGIN_$CLUSTER_NAME.sh
echo "# --------------------------------------------------------------------------------------------------------">>~/LOGIN_$CLUSTER_NAME.sh


echo ""
echo "  --------------------------------------------------------------------------------------------------------"
echo "    🚀 A Login File has been created in your Home Directory: ~/LOGIN_$CLUSTER_NAME.sh"
open ~/LOGIN_$CLUSTER_NAME.sh
echo "--------------------------------------------------------------------------------------------------------"
echo "✅ DONE "
echo "--------------------------------------------------------------------------------------------------------"
