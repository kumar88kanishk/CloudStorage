// const richError = require('../index.js').getRichErrorSync;
// const logger = require('@@magmods/sumologic-winston-logger').ES6;

// const err1 = richError('System', 'first error', null, null, false, '3456');
// //console.log('first error:', err1);

// const err2 = richError('Parameter', 'second error', null, err1, false, '1234');
// //console.log('Second error:', err2);

// const user = {
// 	name: 'a name',
// 	password: 'a password',
// 	address: {
// 		street: 'a street',
// 		city: 'a city'
// 	},
// 	print: function () {
// 		console.log(this);
// 	},
// };

// user.next = {
// 	user: user,
// }

// user.next.next = user.next;


// logger.info('this is a test info', { user });
// logger.debug('this is a test debug', { user });

// const err3 = richError('System', 'testinfo', { info: 'an info' });

// console.log(err3.info)
