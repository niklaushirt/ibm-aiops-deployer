
INSTALL_POD=$(oc get po -n ibmaiops-installer|grep install|awk '{print$1}')
FILE_PATH="/ibmaiops-deployer/install_IBMAIOps.log"

oc cp -n ibmaiops-installer ${INSTALL_POD}:/ibmaiops-deployer/install_IBMAIOps.log ./install_IBMAIOps.log 
oc cp -n ibmaiops-installer ${INSTALL_POD}:/ibmaiops-deployer/install_IBMAIOpsDemoContent.log ./install_IBMAIOpsDemoContent.log 
oc cp -n ibmaiops-installer ${INSTALL_POD}:/ibmaiops-deployer/install_EventManager.log ./install_EventManager.log 
oc cp -n ibmaiops-installer ${INSTALL_POD}:/ibmaiops-deployer/install_InfrastructureManagement.log ./install_InfrastructureManagement.log 
oc cp -n ibmaiops-installer ${INSTALL_POD}:/ibmaiops-deployer/install_ELK.log ./install_ELK.log 
oc cp -n ibmaiops-installer ${INSTALL_POD}:/ibmaiops-deployer/install_Turbonomic.log ./install_Turbonomic.log 

oc logs -n ibmaiops-installer -f $INSTALL_POD > install.log
