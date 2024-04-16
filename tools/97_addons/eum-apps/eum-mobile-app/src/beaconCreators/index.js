const beaconCreators = require('./indexBeaconCreators');
const directives = require('./indexDirectives');

module.exports = {
  ...beaconCreators,
  ...directives
};
