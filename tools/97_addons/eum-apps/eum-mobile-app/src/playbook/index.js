const _ = require('lodash');

const config = require('../config');
const robotshop = require('./robotshop');
const warehouse = require('./warehouse');
const warehouseCrash = require('./warehouseCrash');
const warehouseCrashParse = require('./warehouseCrashParse');

exports.getPlaybook = (playbook, user, opt) => {
  let renderFunc = null;
  if (!playbook) {
    renderFunc = robotshop;
  } else if (_.isObject(playbook)) {
    renderFunc = getRenderFuncByName(randomSelectPlaybook(playbook));
  } else {
    renderFunc = getRenderFuncByName(playbook, user);
  }

  if (renderFunc) {
    const services = opt.services ? opt.services : config.services;
    return renderFunc(user, services);
  }
  console.error(`Unknown playbook ${JSON.stringify(playbook)}`);
  return [];
};

function getRenderFuncByName(name, user) {
  if (config.debug) {
    console.log(`@playbook ${name}`);
  }

  if (name === 'robotshop') {
    return robotshop;
  } else if (name === 'warehouse') {
    return warehouse;
  } else if (name === 'warehouseCrash') {
    return warehouseCrash;
  } else if (name === 'warehouseCrashParse' && 'Android'.includes(user.osName)) {
    return warehouseCrashParse.androidCrash;
  } else if (name === 'warehouseCrashParse' && 'iOS'.includes(user.osName) && 'iPhone 7'.includes(user.deviceModel)) {
    return warehouseCrashParse.iOSCrashArm;
  } else if (name === 'warehouseCrashParse' && 'iOS'.includes(user.osName) && 'iPhone 13'.includes(user.deviceModel)) {
    return warehouseCrashParse.iOSCrashArme;
  }
  return null;
}

function randomSelectPlaybook(selector) {
  const idx = _.random(0, 99);

  let lastPos = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const it of _.toPairs(selector)) {
    const startPos = lastPos;
    lastPos += it[1] * 100;
    if (_.inRange(idx, startPos, lastPos)) {
      return it[0];
    }
  }
  return null;
}
