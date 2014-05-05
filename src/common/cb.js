'use strict';

module.exports = function cb ( callback ) {
	if ( typeof callback === 'function' ) {
		callback();
	}
};
