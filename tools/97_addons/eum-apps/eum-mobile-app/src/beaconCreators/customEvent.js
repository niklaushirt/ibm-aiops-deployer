const { addMeta } = require('../meta');

const { getNumericValue } = require('./util');

exports.customEvent = param => {
  const { eventName, timeOffset = 0, duration = 0, meta = {}, view: customViewName } = param;
  return {
    param,
    render: async ({ beaconId, sessionId, time, view }) => {
      const beacon = {
        sid: sessionId,
        bid: beaconId,
        ti: time + getNumericValue(timeOffset),
        t: 'custom',
        cen: eventName,
        d: getNumericValue(duration),
        ec: 0,
        bs: 1,
        v: customViewName || view
      };
      addMeta(beacon, meta);
      return beacon;
    }
  };
};
