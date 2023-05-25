
INSTALL_POD=$(oc get po -n ibmaiops-installer|grep install|awk '{print$1}')
oc logs -n ibmaiops-installer -f $INSTALL_POD