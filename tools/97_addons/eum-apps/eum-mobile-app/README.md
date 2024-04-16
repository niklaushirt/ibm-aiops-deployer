# Mobile App Monitoring Simulator

## Config files

There is a list of reportingTargets within [config](./src/config.js) file.
Configuration for each cluster:
* `demo-eu` - [link](./src/config.js#L6)
* `demo-us` - [link](./src/config.js#L10-L11)
* `k8s-demo` - [link](./src/config.js#L15)

## How to build
```shell
# setup simulator
git clone git@github.com:instana/demo.git
cd demo/demo_apps/eum-apps/mobile-app-monitoring-simulator

# change reportingTargets in src/config.js file if it is needed
docker build -t gcr.io/peppy-vertex-158106/demo/eum/eum-simulator/mobile-simulator .

docker push gcr.io/peppy-vertex-158106/demo/eum/eum-simulator/mobile-simulator
```

## How To Deploy
```shell
# ensure that your kubectl config is set to appropriate K8s cluster
# depends on cluster that you want to deploy change <CLUSTER_NAME>
cd demo_apps/K8s/descriptors/prod/eum/
kubectl -n eum create -f mobile-simulator/<CLUSTER_NAME>/
```

There is a `REPORT_ENV` variable set for each K8s deployment file.
Depending on the variable, mobile-simulator is sending beacons only to particular tenant units (exactly the same units as configured in Instana agent K8s deployment file). Example:

```
REPORT_ENV="eu"
```
