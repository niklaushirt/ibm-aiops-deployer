oc delete pod  -n ibmaiops --ignore-not-found $(oc get po -n ibmaiops|grep spark|awk '{print$1}') --force --grace-period=0
oc delete pod  -n ibmaiops --ignore-not-found $(oc get po -n ibmaiops|grep metric|awk '{print$1}') --force --grace-period=0
