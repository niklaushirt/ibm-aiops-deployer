#!/bin/bash

clear
echo "***************************************************************************************************************************************************"
echo "***************************************************************************************************************************************************"
echo "***************************************************************************************************************************************************"
echo "***************************************************************************************************************************************************"
echo ""
echo "         ________  __  ___     ___    ________       "     
echo "        /  _/ __ )/  |/  /    /   |  /  _/ __ \____  _____"
echo "        / // __  / /|_/ /    / /| |  / // / / / __ \/ ___/"
echo "      _/ // /_/ / /  / /    / ___ |_/ // /_/ / /_/ (__  ) "
echo "     /___/_____/_/  /_/    /_/  |_/___/\____/ .___/____/  "
echo "                                           /_/            "
echo ""
echo "***************************************************************************************************************************************************"
echo "***************************************************************************************************************************************************"
echo ""
echo " 🚀  IBMAIOPS - Create Synthetic Metrics Data"
echo ""
echo "***************************************************************************************************************************************************"
echo "***************************************************************************************************************************************************"
echo "***************************************************************************************************************************************************"


# Output Directory
export OUTPUT_DIR=/tmp/synthetic-data/

# Arbitrary name of your metric data
export DATA_NAME=robot-shop

# Number of Metric Datapoints
export NUMBER_DATAPOINTS=1000

# Metric Format:
#   resource_name, metric_name, group_name, fixed base value, random value
#
#   Example for "fixed base value"=100 and 2random value"=10
#   Gives metrics values between 100 and 110
#   If you put "fixed base value"=ITERATIONS then it will use the counter (for PodRestarts for example)
declare -a MY_RES_IDS=(
  "demo-metric,DemoUsage,DemoUsage,0,10000"

)
































#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# DO NOT MODIFY BELOW
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Number of Global Iterations
export TIME_INCREMENT_MINUTES="0" 
export TIME_INCREMENT_SECONDS="10" 
export ADD_MSECONDS_STRING=000
export DATE_FORMAT="+%s"
export DATE_FORMAT_READABLE="+%Y-%m-%d %H:%M:%S"
export METRICS_SKEW="-13M"
export ADD_SECONDS=120

# Create Output Filename
export file_timestamp=$(date "+%Y-%m-%d-%H-%M-%S")
mkdir -p $OUTPUT_DIR
export FILENAME=$OUTPUT_DIR"synthetic-data-"$DATA_NAME"-"$file_timestamp".json"


echo "   "
echo "   "
echo "   "
echo "   "
echo "   ----------------------------------------------------------------------------------------------------------------------------------------"
echo "     🚀  Generate Synthetic Data for $DATA_NAME in $FILENAME"
echo "   ----------------------------------------------------------------------------------------------------------------------------------------"



echo '{"groups":['> $FILENAME
((ITERATIONS++))

for (( BUNDLE_ITERATIONS=1; BUNDLE_ITERATIONS <= $NUMBER_DATAPOINTS; ++BUNDLE_ITERATIONS ))
do

      ADD_SECONDS=$(($ADD_SECONDS+($TIME_INCREMENT_MINUTES*60)))
      export act_timestamp_readable=$(date -v "$METRICS_SKEW" -v "+"$ADD_SECONDS"S" "$DATE_FORMAT_READABLE")

      echo "        ♻️  ITERATION: $ITERATIONS-$BUNDLE_ITERATIONS     at "$act_timestamp_readable"   -     Seconds skew "$ADD_SECONDS"   - "$MY_TIMESTAMP

      # Time Skew
      ADD_SECONDS=$(($ADD_SECONDS+$TIME_INCREMENT_SECONDS))

      # Get timestamp in ELK format
      export MY_TIMESTAMP=$(date -v "$METRICS_SKEW" -v "+"$ADD_SECONDS"S" "$DATE_FORMAT")"$ADD_MSECONDS_STRING"
      export my_timestamp_readable=$(date -v "$METRICS_SKEW" -v "+"$ADD_SECONDS"S" "$DATE_FORMAT_READABLE")

      for value in "${MY_RES_IDS[@]}"
      do
            MY_RESOURCE_ID=$(echo $value | cut -d',' -f1)
            MY_METRIC_NAME=$(echo $value | cut -d',' -f2)
            MY_GROUP_ID=$(echo $value | cut -d',' -f3)
            MY_FIX_VALUE=$(echo $value | cut -d',' -f4)
            #echo ":"$MY_FIX_VALUE
            if [[ $MY_FIX_VALUE == "ITERATIONS" ]]; then
                  MY_FIX_VALUE=$(( BUNDLE_ITERATIONS*NUMBER_DATAPOINTS+ITERATIONS ))
            fi
            MY_VARIATION=$(echo $value | cut -d',' -f5)

            export CURRENT_VALUE=$(($RANDOM%$MY_VARIATION+$MY_FIX_VALUE))

            echo "{\"timestamp\":\"$MY_TIMESTAMP\",\"resourceID\":\"$MY_RESOURCE_ID\",\"metrics\":{\"$MY_METRIC_NAME\":$CURRENT_VALUE},\"attributes\":{\"group\":\"$MY_GROUP_ID\",\"node\":\"$MY_RESOURCE_ID\"}},">> $FILENAME
      done
done 

echo "{\"timestamp\":\"$MY_TIMESTAMP\",\"resourceID\":\"$MY_RESOURCE_ID\",\"metrics\":{\"$MY_METRIC_NAME\":$CURRENT_VALUE},\"attributes\":{\"group\":\"$MY_GROUP_ID\",\"node\":\"$MY_RESOURCE_ID\"}}">> $FILENAME
echo ']}'>> $FILENAME


echo "   "
echo "   "
echo "   "
echo "   "
echo "--------------------------------------------------------------------------------------------------------------------------------"
echo " ✅ DONE... You're good to go...."
echo "--------------------------------------------------------------------------------------------------------------------------------"


# cp /tmp/