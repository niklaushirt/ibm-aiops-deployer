const { getNumericValue } = require('./util');

exports.crash = param => {
  const { viewName, stackTrace, stackTrace_Parse, errMsg, errMsg_Parse, timeOffset = 0 } = param;
  return {
    param,
    render: async ({ beaconId, sessionId, time, view }) => {
      const beacon = {
        sid: sessionId,
        bid: beaconId,
        ti: time + getNumericValue(timeOffset),
        t: 'crash',
        d: 0,
        ec: 0,
        bs: 1,
        v: viewName || view,
        st: stackTrace || stackTrace_Parse,
        ast: '',
        em: errMsg || errMsg_Parse
      };
      return beacon;
    }
  };
};
