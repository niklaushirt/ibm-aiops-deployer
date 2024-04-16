const { getNumericValue } = require('./util');

exports.viewChange = param => {
  const { view, timeOffset = 0 } = param;
  return {
    param,
    render: async ({ beaconId, sessionId, time }) => ({
      sid: sessionId,
      bid: beaconId,
      ti: time + getNumericValue(timeOffset),
      t: 'viewChange',
      d: 0,
      ec: 0,
      bs: 1,
      v: view
    })
  };
};
