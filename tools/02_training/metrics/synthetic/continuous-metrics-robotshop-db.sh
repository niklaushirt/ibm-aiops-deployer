#!/bin/sh



declare -a MY_RES_IDS=(
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","0acf99e5-758b-3d3f-8d8d-6c159322009d","mysql-predictive,MemoryUsagePercent,MemoryUsage,45,20"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","6e0a7aed-013f-34a7-afa2-dbb66cbf1304","mysql-predictive,MemoryUsageMean,MemoryUsage,30000,1000"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","48fddfac-009b-3cfe-a8d5-9ea76c0e3c4f","mysql-predictive,MemoryUsageMax,MemoryUsage,35000,4000"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","9ee771c4-6124-3316-ac09-a91e39b64397","mysql-predictive,PodRestarts,PodRestarts,1,1"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","6f837c30-6dbe-34ca-87b6-1f2abf7eb402","mysql-predictive,TransactionsPerSecond,TransactionsPerSecond,169,40"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","de4ef4bf-946c-3b27-9863-73c7a7af32d5","mysql-predictive,Latency,Latency,2,1"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","bdd13495-ed91-316f-8ad2-6575ab59aae5","ratings-predictive,MemoryUsagePercent,MemoryUsage,45,10"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","6e0a7aed-013f-34a7-afa2-dbb66cbf1304","ratings-predictive,MemoryUsageMean,MemoryUsage,30000,1000"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","48fddfac-009b-3cfe-a8d5-9ea76c0e3c4f","ratings-predictive,MemoryUsageMax,MemoryUsage,35000,10000"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","9ee771c4-6124-3316-ac09-a91e39b64397","ratings-predictive,PodRestarts,PodRestarts,1,1"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","6f837c30-6dbe-34ca-87b6-1f2abf7eb402","ratings-predictive,TransactionsPerSecond,TransactionsPerSecond,160,40"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","de4ef4bf-946c-3b27-9863-73c7a7af32d5","ratings-predictive,Latency,Latency,2,1"
   "cfd95b7e-3bc7-4006-a4a8-a73a79c71255","bdd13495-ed91-316f-8ad2-6575ab59aae5","DCWest1-Rack045-DELL3762,CPU1Temperature,System,ITERATIONS,90"
)


#  "dSwitch-1-vm-network-port-1,TransactionsPerSecond,TransactionsPerSecond,0,1"
#   "dcwest1-switch023,TransactionsPerSecond,TransactionsPerSecond,60,30"


export INTERVAL_SECONDS=5

export AIOPS_NAMESPACE=$(oc get po -A|grep aimanager-operator |awk '{print$1}')
echo "       ✅ OK - AI Manager:               $AIOPS_NAMESPACE"


#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# DO NOT MODIFY BELOW
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export DATE_FORMAT="+%s"
export DATE_FORMAT_READABLE="+%Y-%m-%d %H:%M:%S"



echo "   "
echo "   "
echo "   "
echo "   "
echo "   ----------------------------------------------------------------------------------------------------------------------------------------"
echo "     🚀  Inject Synthetic Metrics"
echo "   ----------------------------------------------------------------------------------------------------------------------------------------"



echo "   ----------------------------------------------------------------------------------------------------------------------------------------"
echo "     🔐  Getting Namespace"
echo "   ----------------------------------------------------------------------------------------------------------------------------------------"
export AIOPS_NAMESPACE=$(oc get po -A|grep aiops-orchestrator-controller |awk '{print$1}')

oc project $AIOPS_NAMESPACE >/dev/null 2>/dev/null




#--------------------------------------------------------------------------------------------------------------------------------------------
#  Launch Log Injection as a parallel thread
#--------------------------------------------------------------------------------------------------------------------------------------------
echo "      -------------------------------------------------------------------------------------------------------------------------------------"
echo "       🌏  Injecting Metrics Anomaly Data" 
echo "           Quit with Ctrl-Z"
echo "      -------------------------------------------------------------------------------------------------------------------------------------"
echo ""

# Loop until CTRL-C
while true
do

      export HR_BASE_TIMESTAMP=$(date "$DATE_FORMAT_READABLE")
      export BASE_TIMESTAMP=$HR_BASE_TIMESTAMP"+00"

      echo "        Iteration at "$BASE_TIMESTAMP
      VALUES=""

      for value in "${MY_RES_IDS[@]}"
      do

            #echo $value


            t_uid=$(echo $value | cut -d',' -f1)
            mr_id=$(echo $value | cut -d',' -f2)
            MY_RESOURCE_ID=$(echo $value | cut -d',' -f3)
            MY_METRIC_NAME=$(echo $value | cut -d',' -f4)
            MY_GROUP_ID=$(echo $value | cut -d',' -f5)
            MY_FIX_VALUE=$(echo $value | cut -d',' -f6)
            MY_VARIATION=$(echo $value | cut -d',' -f7)
                
            export CURRENT_VALUE=$(($RANDOM%$MY_VARIATION+$MY_FIX_VALUE))
            export AVG_VALUE=$(($MY_VARIATION/2+$MY_FIX_VALUE))
            export MAX_VALUE=$(($MY_VARIATION+$MY_FIX_VALUE))
            export MIN_VALUE=$(($MY_FIX_VALUE))

            VALUES=$VALUES"('"$t_uid"','"$mr_id"','"$BASE_TIMESTAMP"','"$CURRENT_VALUE"','"$MIN_VALUE"','"$MAX_VALUE"','"$AVG_VALUE"','f'),"

      done
      export VALUES=$(echo $VALUES | sed 's/.$//')
      export SQL_COMMAND="INSERT INTO aiops_ir_ai.metric_values (t_uid, mr_id, tstamp, value, min, max, expected, anomalous) VALUES $VALUES;"
      
      #echo $SQL_COMMAND

      oc exec -ti -n $AIOPS_NAMESPACE aiops-ir-analytics-postgres-1 -- bash -c "psql -U postgres -d aiops_ir_ai -c \"${SQL_COMMAND}\""

      sleep $INTERVAL_SECONDS
done
