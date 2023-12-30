var VError = require('verror');

var err1 = new VError('first error');

var err2 = new VError(err1, 'second error');

var err3 = new VError(err2, 'third error');

console.log(err3)
console.log(err3.message)
console.log(err3.cause().cause().message)