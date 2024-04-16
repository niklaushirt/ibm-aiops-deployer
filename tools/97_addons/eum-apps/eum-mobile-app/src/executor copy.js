const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const config = require('./config');
const beaconCreators = require('./beaconCreators');
const { getPlaybook } = require('./playbook');
const { transmit } = require('./transmission');
const { getTraces } = require('./getTraces');
const { addMeta } = require('./meta');
const users = require('./users');
const { getNumericValue } = require('./beaconCreators/util');
const { performance } = require('node:perf_hooks');
const moment = require('moment');

const validIdCharacters = '0123456789abcdef'.split('');
function generateUniqueIdImpl() {
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += validIdCharacters[Math.round(Math.random() * 15)];
  }
  return result;
}

exports.start = async () => {
  const reportingTarget = config.reportingTargets[process.env.REPORT_ENV];
  const notFirstTime = {};
  const limitInterval = process.env.LIMIT_INTERVAL ?? 800;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const startTime = performance.now();

      const transmissionPromises = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const url of Object.keys(reportingTarget)) {
        let opt = reportingTarget[url];
        let url= process.env.EUM_URL

        if (_.isArray(opt)) {
          opt = { keys: opt }; 
        }

        if (config.debug) {
          console.log(`@target ${url}`);
        }

        if (!notFirstTime[url]) {
          notFirstTime[url] = true;

          if (opt.apiserver && !opt.apitoken) {
            console.error(`**ERROR** apitoken not found for ${opt.apiserver} [${url}]`);
          } else if (!opt.apiserver) {
            console.warn(`**WARN** no apiserver found, correlation will not work [${url}]`);
          }
        }
        const intervalStart = opt.crashStartInterval;
        const intervalEnd = opt.crashEndInterval;
        // eslint-disable-next-line no-await-in-loop
        const bgTraces = await getTraces(url, opt);
        const user = getRandomUser();
        var playbook;
        const checkCrashParse = getTimeStamp(intervalStart, intervalEnd);
        if ('warehouseCrash'.includes(user.playbook)) {
          playbook = getPlaybook('warehouseCrash', user, opt);
        } else if ('warehouseCrashParse'.includes(checkCrashParse) && '1.42.3'.includes(user.appVersion)) {
          playbook = getPlaybook('warehouseCrashParse', user, opt);
        } else {
          playbook = getPlaybook(opt.playbook, user, opt);
        }
        // eslint-disable-next-line no-await-in-loop
        const beacons = await executePlaybook(playbook, { user, bgTraces });

        let keys=process.env.EUM_KEY
        transmissionPromises.push(
          transmit({
            url,
            keys: opt.keys,
            beacons,
            user
          })
        );
      }

      // eslint-disable-next-line no-await-in-loop
      await Promise.all(transmissionPromises);
      const end = performance.now();

      if (end - startTime < limitInterval) {
        await sleep(limitInterval - (end - startTime) + Math.random(0, 300));
      }

      if (config.debug) {
        console.log('@sleep...');
        // eslint-disable-next-line no-await-in-loop
        await sleep(1000);
      }
    } catch (e) {
      console.error(`Failed to simulate regular load`, e);
    }
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

function repeatTimes(beaconDefinition) {
  let times = 1;
  if (beaconDefinition.times === 0) {
    times = 0;
  } else if (beaconDefinition.times) {
    times = getNumericValue(beaconDefinition.times);
  }
  return times;
}

function shouldAbort(beaconDefinition) {
  return beaconDefinition.abortChance != null && Math.random() <= beaconDefinition.abortChance;
}

function shouldSkip(beaconDefinition) {
  return beaconDefinition.chance != null && Math.random() > beaconDefinition.chance;
}

async function executePlaybook(
  playbook,
  { user, bgTraces, previousView, time = Date.now(), sessionId = uuidv4()} = {}
) {
  const beacons = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const beaconDefinition of playbook) {
    if (shouldAbort(beaconDefinition)) {
      return beacons;
    } else if (shouldSkip(beaconDefinition)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const creators = beaconCreators[beaconDefinition.type](beaconDefinition);
    const bcArr = _.isArray(creators) ? creators : [creators];

    const times = repeatTimes(beaconDefinition);
    for (let index = 0; index < times; index++) {
      // eslint-disable-next-line no-restricted-syntax
      for (const bc of bcArr) {
        if (shouldAbort(bc.param)) {
          return beacons;
        } else if (shouldSkip(bc.param)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const errorneous = bc.param.errorChance && Math.random() <= bc.param.errorChance;

        let corr = {};
        if (bc.param.correlation) {
          corr = getBackendCorrelation(errorneous, bc.param.correlation, bgTraces);
        }

        /* eslint-disable-next-line no-await-in-loop */
        const beacon = await bc.render({
          beaconId: generateUniqueIdImpl(),
          sessionId,
          time,
          view: previousView,
          errorneous: !!corr.bad
        });
        addUserInformation(beacon, user);
        if (corr.bc) {
          beacon.bc = corr.bc;
          beacon.bt = corr.bt;
          beacon.d += corr.duration;
        }
        time = beacon.ti + (beacon.d || 0);
        previousView = beacon.v;
        beacons.push(beacon);
      }
    }
  }

  return beacons;
}

function getBackendCorrelation(erroneous, correlation, bgTraces) {
  const result = {};
  if (config.debug) {
    result.bc = 1;
    result.bt = `CORR-${erroneous ? 'X' : 'V'}`;
  }
  if (!bgTraces) {
    return {};
  }
  result.bad = erroneous;
  let bgcalls = erroneous ? bgTraces[`${correlation}-bad`] : bgTraces[correlation];
  if (!bgcalls || !bgcalls.length) {
    result.bad = false;
    bgcalls = bgTraces[correlation];
  }
  if (!bgcalls || !bgcalls.length) {
    return {};
  }
  const bgcall = bgcalls[_.random(0, bgcalls.length - 1)];
  result.bc = 1;
  result.bt = bgcall.id;
  result.duration = bgcall.duration;
  return result;
}

function addUserInformation(beacon, user) {
  beacon.agv = 'demoLoadGenerator';
  beacon.ui = user.id;
  beacon.un = user.fullName;
  beacon.ue = user.email;
  beacon.ul = user.language;
  beacon.bi = user.bundleIdentifier;
  beacon.ab = user.appBuild;
  beacon.av = user.appVersion;
  beacon.p = user.platform;
  beacon.osn = user.osName;
  beacon.osv = user.osVersion;
  beacon.dma = user.deviceManufacturer;
  beacon.dmo = user.deviceModel;
  beacon.dh = user.deviceHardware;
  beacon.ro = user.rooted ? '1' : '0';
  beacon.gpsm = user.googlePlayServicesMissing ? '1' : '0';
  beacon.vw = user.viewportWidth;
  beacon.vh = user.viewportHeight;
  beacon.cn = user.carrier;
  beacon.ct = user.connectionType;
  beacon.ect = user.effectiveConnectionType;
  addMeta(beacon, user.meta);
}

function getRandomUser() {
  const index = _.random(0, users.length - 1);
  return users[index];
}

function getTimeStamp(intervalStart, intervalEnd) {
  const startIntervalTime = moment(intervalStart, 'HH:mm:ss');
  const endIntervalTime = moment(intervalEnd, 'HH:mm:ss');
  if (moment().isBetween(startIntervalTime, endIntervalTime, null, '[]')) {
    return 'warehouseCrashParse';
  }
}
