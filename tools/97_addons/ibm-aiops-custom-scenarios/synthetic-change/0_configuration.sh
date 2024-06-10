# ****************************************************************************************************************************************************
# ****************************************************************************************************************************************************
# Simulate Change
# ****************************************************************************************************************************************************
# ****************************************************************************************************************************************************
#


# ----------------------------------------------------------------------------------------------------------------------------------------------------
# Custom Properties
# ----------------------------------------------------------------------------------------------------------------------------------------------------
# Simulate change in an Topology Objects Propoerties.
#
#   - `CUSTOM_PROPERTY_RESOURCE_NAME` : The Name of the resource to be affected 
#   - `CUSTOM_PROPERTY_RESOURCE_TYPE` : The Type of the resource to be affected
#   - `CUSTOM_PROPERTY_VALUES_NOK` : The values to be added/created when the Incident is being simulated
#   - `CUSTOM_PROPERTY_VALUES_OK` : The values to be added/created when the Incident is being mitigaged
#

export CUSTOM_PROPERTY_RESOURCE_NAME='mysql'
export CUSTOM_PROPERTY_RESOURCE_TYPE='deployment'
export CUSTOM_PROPERTY_VALUES_NOK='{"test1": "NOK","test2": "NOK","test3": "NOK"}'
export CUSTOM_PROPERTY_VALUES_OK='{"test1": "OK","test2": "OK","test3": "OK"}'


export RANDOM_DELAY_VALUE=15
export RANDOM_DELAY_SKEW=0

export RANDOM_TPS_VALUE=200
export RANDOM_TPS_SKEW=800

