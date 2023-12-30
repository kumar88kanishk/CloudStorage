const { getRichError } = require('../index.js');

/*
const err = (test) => {
	logger.info(`this is a test: ${test}`, { test });
};
*/
/*const err = {
	message: (test) => {
		logger.info(`this is a test: ${test}`, { test });
	}
};
*/
const err = 0;


const richError = getRichError('System', 'should be a system error', null, err);

console.log('-----', richError);