export EVTMGR_NAMESPACE=$(oc get po -A|grep noi-operator |awk '{print$1}')

echo ""
echo ""
echo ""
echo ""
echo "------------------------------------------------------------------------------------------------------------------------------------"

kubectl get NOI -n $EVTMGR_NAMESPACE evtmanager -o jsonpath={.status.message}
echo ""
echo ""
echo ""
echo ""



echo "------------------------------------------------------------------------------------------------------------------------------------"
appURL=$(oc get route -n $EVTMGR_NAMESPACE  evtmanager-ibm-hdm-common-ui -o jsonpath={.spec.host})|| true
echo "https://$appURL"
echo "Default credentials are: icpadmin/password"
kubectl get secret evtmanager-icpadmin-secret -o json -n ibm-evtmgr| grep ICP_ADMIN_PASSWORD  | cut -d : -f2 | cut -d '"' -f2 | base64 -d;echo
echo ""
echo ""


echo "------------------------------------------------------------------------------------------------------------------------------------"
appURL=$(oc get route -n $EVTMGR_NAMESPACE  evtmanager-impactgui-xyz -o jsonpath={.spec.host})|| true
echo "https://$appURL"
echo "Default credentials are: impactadmin//password"
kubectl get secret evtmanager-impact-secret -o json -n ibm-evtmgr| grep IMPACT_ADMIN_PASSWORD | cut -d : -f2 | cut -d '"' -f2 | base64 -d;echo
echo ""
echo ""


echo "------------------------------------------------------------------------------------------------------------------------------------"
echo "Default credentials are: smadmin/password"
kubectl get secret evtmanager-was-secret -o json -n ibm-evtmgr| grep WAS_PASSWORD | cut -d : -f2 | cut -d '"' -f2 | base64 -d;echo
echo ""
echo ""
