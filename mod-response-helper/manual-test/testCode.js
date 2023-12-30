const { getRichError } = require('../index');

console.log('200', getRichError(200, 'test'));
console.log('-1', getRichError(-1, 'test'));
console.log('unknow', getRichError('unknown', 'test'));
console.log('NotFound', getRichError('NotFound', 'test'));
console.log('null', getRichError(null, 'test'));
console.log('418', getRichError(418, 'test'));
console.log('460', getRichError(460, 'test'));
