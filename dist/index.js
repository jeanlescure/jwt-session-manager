'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var http = _interopDefault(require('http'));

var version = '0.0.1';

var Greeter = /** @class */ (function () {
    function Greeter(greeting) {
        this.greeting = greeting;
    }
    Greeter.prototype.greet = function () {
        var _a = this.greeting, greeting = _a.greeting, greetingTarget = _a.greetingTarget, version = _a.version;
        return "Greeter version " + version + " says: " + greeting + " " + greetingTarget + "!";
    };
    return Greeter;
}());

var legacyStatus = {
  status: 200,
};
var legacyStatus_1 = legacyStatus.status;

var _a = process.env, HOSTNAME = _a.HOSTNAME, PORT = _a.PORT, GREETING_TARGET = _a.GREETING_TARGET;
var greeter = new Greeter({
    greeting: 'Hello',
    greetingTarget: GREETING_TARGET,
    version: version,
});
var server = http.createServer(function (req, res) {
    res.statusCode = legacyStatus_1;
    res.setHeader('Content-Type', 'text/plain');
    res.end(greeter.greet());
});
server.listen(parseInt(PORT, 10), HOSTNAME, function () {
    console.log("Server running at http://" + HOSTNAME + ":" + PORT + "/");
});
//# sourceMappingURL=index.js.map
