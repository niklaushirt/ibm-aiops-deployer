

<center> <h1>Turbonomic - FinOps</h1> </center>
<center> <h2>Sample Demo Script for the live demo environment</h2> </center>




![K8s CNI](./demo/00_aimanager_insights.png)

<center> ©2023 Joel Hartmann/Niklaus Hirt / IBM </center>




# 1. Introduction

This script is intended as a guide to demonstrate Apption and Turbonomic using the live demo environment. The script is presented in a few sections. You can utilize some or all sections depending upon your client’s needs. 

The script is intended to be used with live Apptio and Turbonomic demo environment that you can reserve via [TechZone](https://techzone.ibm.com/collection/turbonomic-application-resource-management-demo-assets/resources).


In the demo script, 

- “**🚀 <u>Action</u>**” denotes a setup step for the presenter.
- “**📣 <u>Narration</u>**” denotes what the presenter will say. 
- “**ℹ️ <u>Note</u>**” denotes where the presenter may need to deviate from this demo script or add supplemental comments.

<div style="page-break-after: always;"></div>



## 1.1 Key Terminology
You should be familiar with the following terminology when discussing Turbonomic:


- **Application Resource Management**: is a top-down, application-driven approach that continuously analyzes applications' resource needs and generates fully automatable actions to ensure applications always get what they need to perform. It runs 24/7/365 and scales with the largest, most complex environments.
   To perform Application Resource Management, Turbonomic represents your environment holistically as a supply chain of resource buyers and sellers, all working together to meet application demand. By empowering buyers (VMs, instances, containers, and services) with a budget to seek the resources that applications need to perform, and sellers to price their available resources (CPU, memory, storage, network) based on utilization in real-time, Turbonomic keeps your environment within the desired state — operating conditions that achieve the following conflicting goals at the same time:

   Assured application performance

   Prevent bottlenecks, upsize containers/VMs, prioritize workload, and reduce storage latency.

   Efficient use of resources

   Consolidate workloads to reduce infrastructure usage to the minimum, downsize containers, prevent sprawl, and use the most economical cloud offerings.

- **Business Application**: A Business Application is a logical grouping of application entities and nodes that work together to compose a complete application as end users would view it. Turbonomic users can monitor overall performance, make resourcing decisions, and set policies in the context of their Business Applications.

- **Market**: The Turbonomic Market is an abstraction that represents the datacenter as buyers and sellers in a supply chain. Each entity (such as physical machines, virtual machines, storage device, volume, application component) in the environment is a buyer or seller.  The Turbonomic Supply Chain is a graphical display of the buyer and seller relationships. Turbonomic uses Virtual Currency to give a budget to buyers and assign cost to resources. This virtual currency assigns value across all tiers of your environment, making it possible to compare the cost of application transactions with the cost of space on a disk or physical space in a datacenter.

- **Target**: A Target is a resource or workload management service in your virtual environment that you have connected to Turbonomic. For example, a public cloud account on AWS (Amazon Web Services) can be a target, as can an on-prem datacenter managed by VMware vCenter Server. For each target that you configure, Turbonomic communicates with the service via the management protocol that it exposes — a REST API, SMI-S, XML, or some other management transport. Turbonomic uses this communication to discover the managed entities, monitor resource utilization, and execute actions.

- **Commodity**: The basic building block of Turbonomic supply and demand. All the resources that Turbonomic monitors are commodities. For example, the CPU capacity or memory that a host can provide are commodities. Turbonomic can also represent clusters and segments as commodities. When the user interface shows commodities, it’s showing the resources a service provides. When the interface shows commodities bought, it’s showing what that service consumes.

- **Consumes**: The services and commodities a service has bought. A service consumes other commodities. For example, a VM consumes the commodities offered by a host, and an application consumes commodities from one or more VMs. In the user interface you can explore the services that provide the commodities the current service consumes.

- **Entity**: A buyer or seller in the market. For example, a VM or a datastore is an entity.

- **Environment**: The totality of data center, network, host, storage, VM, and application resources that you are monitoring.

- **Inventory**: The list of all entities in your environment.

- **Risk Index**: A measure of the risk to Quality of Service (QoS) that a consumer will experience. The higher the Risk Index on a provider, the more risk to QoS for any consumer of that provider’s services. For example, a host provides resources to one or more VMs. The higher the Risk Index on the provider, the more likely that the VMs will experience QoS degradation. In most cases, for optimal operation the Risk Index on a provider should not go into double digits.

<div style="page-break-after: always;"></div>

## 1.2 Demonstration scenario

### 1.2.1 Overview

This use case shows clients how IBM Turbonomic proactively helps avoid application downtimes and incidents impacting end-users related to performance problems. You play the role of an SRE/Operations person who has received an eMail message from the CTO complaining that the RobotShop application is not providing a good customer experience with outages and slow response times. RobotShop is the main platform from which the fictional company sells its robots.


### 1.2.2 Use Case

The use case demonstrates how Turbonomic can assist the SRE/Operations team as they identify, verify, and ultimately optimise the RobotShop infrastructure in order to improve the customer experience. 

You will demonstrate the following major selling points around Turbonomic:

1. **Pulls data from various IT platforms**: IBM Turbonomic monitors incoming data feeds including logs, metrics, alerts, topologies, and tickets, highlighting potential problems across incoming data, based on trained machine learning models.
1. **Utilizes AI and natural language processing**: An insight layer connects the dots between structured and unstructured data, using AI and natural language processing technologies. This allows you to quickly understand the nature of the incident.
1. **Provides trust and transparency**: Using accurate and trustworthy recommendations, you can move forward with the diagnosis of IT system problems and the identification and prioritization of the best resolution path.
1. **Resolves rapidly**: Time and money are saved from out-of-the-box productivity that enables automation and utilizes pre-trained models. A “similar issue feature” from past incidents allows you to get services back online for customers and end-users.

<div style="page-break-after: always;"></div>

## 1.3 Demonstration flow
1. Scenario introduction
1. Understanding and optimising the infrastructure
   1. Login to Apptio
   1. Explore Cost Dashboard
   1. Explain True Cost
   1. Anomalies
   1. Forecast
   1. Login to Turbonomic
   1. Overview of the SupplyChain
   1. Explanation Commodities and Optimization  
   1. Zoom into Business Application
   1. Drill-down Actions
   1. Explain Efficiency Actions
   1. Explain Performance Actions
   1. [Optional] xxxx
   1. Plan
   1. Dashboard
1. Summary



# 2. Deliver the demo

## 2.1 Introduce the demo context

**📣 <u>Narration</u>** 

Welcome to this demonstration of the Turbonomic platform. In this demo, I am going to show you how Turbonomic can help your operations team proactively identify, diagnose, and resolve incidents across mission-critical workloads.

You’ll see how:

- Turbonomic intelligently correlates multiple disparate sources of information such as logs, metrics, events, tickets and topology
- All of this information is condensed and presented in actionable alerts instead of large quantities of unrelated alerts
- You can resolve a problem within seconds to minutes of being notified using Turbonomic’ automation capabilities

During the demonstration, we will be using the sample application called RobotShop, which serves as a proxy for any type of app. The application is built on a microservices architecture, and the services are running on Kubernetes cluster.

>**🚀 <u>Action</u>**
>Use demo [introductory PowerPoint presentation](https://github.com/niklaushirt/ibm-aiops-deployer/blob/main/doc/CP4AIOPS_DEMO_2023_V1.pptx?raw=true), to illustrate the narration. Adapt your details on Slide 1 and 13

**📣 <u>Narration</u>**


**ℹ️ <u>Note</u>**: We are NOT using Slack in this demo.



**📣 <u>Narration</u>**

Now let's start the demo.


<div style="page-break-after: always;"></div>

## 2.2 xxxxx


## 2.3 Login to Turbonomic

**📣 <u>Narration</u>**

Let’s take a closer look at Turbonomic.
To get started with the platform, I will log in and get started managing my environment.


>**🚀 <u>Action</u>**
   - Navigate your Web browser to the Turbonomic installation
   - Provide the user name and password for your account




![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

This page is your starting point for sessions with the Turbonomic platform. From the Home Page you can see the overviews of your environment.

To display this information, Turbonomic communicates with target services such as hypervisors, storage controllers, and public cloud accounts. Note that your Turbonomic administrator sets up the target configuration.



<div style="page-break-after: always;"></div>


## 2.3 Overview of the SupplyChain

**📣 <u>Narration</u>**

To perform Application Resource Management, Turbonomic models your environment as a market of buyers and sellers linked together in a supply chain. This supply chain represents the flow of resources from the datacenter, through the physical tiers of your environment, into the virtual tier and out to the cloud. By managing relationships between these buyers and sellers, Turbonomic provides closed-loop management of resources, from the datacenter, through to the application.

Reading the Supply Chain
By looking at the Supply Chain, you can see:

- How many entities you have on each tier: Each entry in the supply chain gives a count of entities for the given type.

- The overall health of entities in each tier: The ring for each entry indicates the percentage of pending actions for that tier in the datacenter. Ring colors indicate how critical the actions are - Green shows the percentage of entities that have no actions pending. To get actual counts of pending actions, hover on a ring to more details.

- The flow of resources between tiers: The arrow from one entry to another indicates the flow of resources. For example, the Virtual Machine entry has arrows to Hosts and to Storage. If the VMs are running in a Virtual Data Center, it will have another arrow to that as well. This means that your VMs consume resources from hosts, storage, and possibly from VDCs.


>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>


## 2.3 Integrating new Target


>**🚀 <u>Action</u>**
Click **Settings**
Click **Targets**


![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

A target is a service that performs management in your virtual environment. Turbonomic uses targets to monitor workload and to execute actions in your environment. When you configure a target, you specify the address of the service, and the credentials to connect as a client to it.

For each target, Turbonomic communicates with the service via the management protocol that it exposes — The REST API, SMI-S, XML, or some other management transport. Turbonomic uses this communication to discover the managed entities, monitor resource utilization, and execute actions.

To configure a target, you will choose the target type, specify the target's address or key, and then provide credentials to access the target. Turbonomic then discovers and validates the target, and then updates the supply chain with the entities that the target manages.



<div style="page-break-after: always;"></div>


## 2.3 Explanation Commodities and Optimization  
>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>


## 2.3 Zoom into Business Application
>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>


## 2.3 Drill-down Actions
>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>


## 2.3 Explain Performance Actions
>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>


## 2.3 Explain Efficiency Actions
>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>


## 2.3 [Optional] xxxx
>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>


## 2.3 Plan
>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>


## 2.3 Dashboard

>**🚀 <u>Action</u>**
In the Demo UI, click **Turbonomic `(1)`**



![image](./demo/image.xxxx.png)

**📣 <u>Narration</u>**

Let’s take a closer look at the incident that has been created in Turbonomic.



<div style="page-break-after: always;"></div>







# Demonstration summary
**📣 <u>Narration</u>**

Today, I have shown you how Turbonomic can assist the SRE/Operations team to identify, verify, and ultimately correct an issue with a modern, distributed application running in a cloud-native environment. The presented solution provides automatic application topology discovery, anomaly detection both with metrics and logs, and sophisticated methods of correlation of events coming from different sources. 



