-----------------------------------------------------------------------------------
# 14 Installing OCP ELK
---------------------------------------------------------------

## 14.1 Installing OCP ELK

Use Option 🐥`22` in Easy Install to install a `ELK` instance

## 14.2 Manually installing OCP ELK

You can easily install ELK into the same cluster as IBMAIOPS.


1. Launch

	```bash
	ansible-playbook ./ansible/11_ibm-aiops-elk-install.yaml
	```
2. Wait for the pods to come up
3. Open Kibana


<div style="page-break-after: always;"></div>
