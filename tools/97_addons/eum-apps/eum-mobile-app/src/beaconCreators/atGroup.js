const beaconCreators = require('./indexBeaconCreators');

exports.atGroup = ({ items = [] } = {}) => items.map(item => beaconCreators[item.type](item));
