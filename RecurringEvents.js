var fs = require('fs');
var events = JSON.parse(fs.readFileSync('RecurringEventSource.js', 'utf8'));

module.exports = {events}
