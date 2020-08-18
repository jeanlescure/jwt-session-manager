'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var ShortUniqueId = _interopDefault(require('short-unique-id'));
var jwt = require('jsonwebtoken');

var version = '1.1.1';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || path.resolve(process.cwd(), '.env') });
var idDict = new Array(94);
for (var i = 93; i >= 0; i -= 1)
    idDict[i] = String.fromCharCode(i + 33);
var uid = new ShortUniqueId({
    dictionary: idDict,
    length: 64,
});
var ServerJWTSessionManager = /** @class */ (function () {
    function ServerJWTSessionManager(options) {
        var _this = this;
        this.serverOptions = {
            autoGenerateSecret: true,
            validateRequestHandler: function (validationData) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, false];
            }); }); },
            storeSessionKeyHandler: function (sessionKey) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ''];
            }); }); },
            validateSessionKeyInStoreHandler: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, false];
            }); }); },
        };
        this.generateSecret = function () {
            // With the provided dictionary and given the 64 character length,
            // this library can generate this amount of unique secrets:
            // 1,906,262,174,603,609,088,576,616,448,880,496,376,736,472,440,472,536,824,976,488,112,704,264,624,800,304,704,624,848,640,656,728,592,472,800,216,888,232,600,112,440,440
            // (one unquadragintillion nine hundred six quadragintillion two hundred sixty-two novemtrigintillion one hundred seventy-four octotrigintillion six hundred three septentrigintillion six hundred nine sextrigintillion eighty-eight quintrigintillion five hundred seventy-six quattuortrigintillion six hundred sixteen trestrigintillion four hundred forty-eight duotrigintillion eight hundred eighty untrigintillion four hundred ninety-six trigintillion three hundred seventy-six novemvigintillion seven hundred thirty-six octovigintillion four hundred seventy-two septenvigintillion four hundred forty sexvigintillion four hundred seventy-two quinvigintillion five hundred thirty-six quattuorvigintillion eight hundred twenty-four trevigintillion nine hundred seventy-six duovigintillion four hundred eighty-eight unvigintillion one hundred twelve vigintillion seven hundred four novemdecillion two hundred sixty-four octodecillion six hundred twenty-four septendecillion eight hundred sexdecillion three hundred four quindecillion seven hundred four quattuordecillion six hundred twenty-four tredecillion eight hundred forty-eight duodecillion six hundred forty undecillion six hundred fifty-six decillion seven hundred twenty-eight nonillion five hundred ninety-two octillion four hundred seventy-two septillion eight hundred sextillion two hundred sixteen quintillion eight hundred eighty-eight quadrillion two hundred thirty-two trillion six hundred billion one hundred twelve million four hundred forty thousand four hundred forty)
            //
            // This means the approximate probability of duplicate secrets being generetade is of
            // 1 in 1,730,418,915,111,425,280,952,848,056,848,216,368,208,136,360,064,800,224,464,872,000
            return uid();
        };
        this.generateSessionRequestToken = function (expirySeconds) {
            if (expirySeconds === void 0) { expirySeconds = 60 * 2; }
            return jwt.sign({
                exp: Math.floor(Date.now() / 1000) + expirySeconds,
            }, _this.jwtSecret);
        };
        this.checkSessionRequestToken = function (sessionRequestToken) {
            try {
                jwt.verify(sessionRequestToken, _this.jwtSecret);
                return true;
            }
            catch (e) {
                return false;
            }
        };
        this.generateSessionToken = function (sessionKey, sessionData) {
            return (!sessionKey && null) || jwt.sign({
                sessionKey: sessionKey,
                sessionData: sessionData,
            }, _this.jwtSecret);
        };
        this.processSessionRequest = function (sessionRequestToken, validationData, sessionData) { return __awaiter(_this, void 0, void 0, function () {
            var _a, checkSessionRequestToken, generateSecret, generateSessionToken, serverOptions, validateRequestHandler, storeSessionKeyHandler, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this, checkSessionRequestToken = _a.checkSessionRequestToken, generateSecret = _a.generateSecret, generateSessionToken = _a.generateSessionToken, serverOptions = _a.serverOptions;
                        validateRequestHandler = serverOptions.validateRequestHandler, storeSessionKeyHandler = serverOptions.storeSessionKeyHandler;
                        _c = checkSessionRequestToken(sessionRequestToken);
                        if (!_c) return [3 /*break*/, 2];
                        return [4 /*yield*/, validateRequestHandler(validationData)];
                    case 1:
                        _c = (_e.sent());
                        _e.label = 2;
                    case 2:
                        _b = _c;
                        if (!_b) return [3 /*break*/, 4];
                        _d = generateSessionToken;
                        return [4 /*yield*/, storeSessionKeyHandler(generateSecret(), validationData).catch(function (e) { return null; })];
                    case 3:
                        _b = _d.apply(void 0, [_e.sent(), sessionData]);
                        _e.label = 4;
                    case 4: return [2 /*return*/, (_b) || null];
                }
            });
        }); };
        this.checkSessionToken = function (sessionToken, extraValidationData) { return __awaiter(_this, void 0, void 0, function () {
            var validateSessionKeyInStoreHandler, sessionKey, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        validateSessionKeyInStoreHandler = this.serverOptions.validateSessionKeyInStoreHandler;
                        sessionKey = jwt.verify(sessionToken, this.jwtSecret).sessionKey;
                        return [4 /*yield*/, validateSessionKeyInStoreHandler(sessionKey, extraValidationData)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.dataFromSessionToken = function (sessionToken, extraValidationData) { return __awaiter(_this, void 0, void 0, function () {
            var sessionData;
            return __generator(this, function (_a) {
                if (this.checkSessionToken(sessionToken, extraValidationData)) {
                    sessionData = jwt.verify(sessionToken, this.jwtSecret).sessionData;
                    return [2 /*return*/, sessionData || null];
                }
                return [2 /*return*/, null];
            });
        }); };
        var envOptions = __assign(__assign({}, this.serverOptions), { jwtSecret: process.env.SESSION_MANAGER_SECRET });
        this.serverOptions = __assign(__assign({}, envOptions), options);
        if (!this.serverOptions.jwtSecret && this.serverOptions.autoGenerateSecret) {
            this.serverOptions.jwtSecret = this.generateSecret();
        }
        else if (!this.serverOptions.autoGenerateSecret) {
            throw new Error('Invalid Secret!');
        }
        this.serverOptions.storeJWTSecretHandler
            && (this.jwtSecretStorePromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.serverOptions.storeJWTSecretHandler(this.jwtSecret)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this];
                    }
                });
            }); })());
    }
    Object.defineProperty(ServerJWTSessionManager.prototype, "jwtSecret", {
        get: function () {
            return this.serverOptions.jwtSecret;
        },
        enumerable: false,
        configurable: true
    });
    return ServerJWTSessionManager;
}());

var ClientJWTSessionManager = /** @class */ (function () {
    function ClientJWTSessionManager(options, restoreState) {
        var _this = this;
        this.state = {
            sessionToken: null,
        };
        this.clientOptions = {
            getSessionRequestTokenHandler: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ''];
            }); }); },
            getSessionHandler: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ''];
            }); }); },
        };
        this.setState = function (newState) {
            var prevState = _this.state;
            _this.state = __assign(__assign({}, prevState), newState);
        };
        this.getSessionRequestToken = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, clientOptions, setState, getSessionRequestTokenHandler, storeSessionRequestTokenHandler, requestTokenResponse, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this, clientOptions = _a.clientOptions, setState = _a.setState;
                        getSessionRequestTokenHandler = clientOptions.getSessionRequestTokenHandler, storeSessionRequestTokenHandler = clientOptions.storeSessionRequestTokenHandler;
                        return [4 /*yield*/, getSessionRequestTokenHandler().catch(function (e) { throw e; })];
                    case 1:
                        requestTokenResponse = _c.sent();
                        setState({
                            sessionRequestToken: requestTokenResponse,
                        });
                        _b = storeSessionRequestTokenHandler;
                        if (!_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, storeSessionRequestTokenHandler(this.state.sessionRequestToken).catch(function (e) { throw e; })];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        return [2 /*return*/];
                }
            });
        }); };
        this.getSession = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, clientOptions, getSessionRequestToken, setState, getSessionHandler, storeSessionTokenHandler, sessionToken, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this, clientOptions = _a.clientOptions, getSessionRequestToken = _a.getSessionRequestToken, setState = _a.setState;
                        getSessionHandler = clientOptions.getSessionHandler, storeSessionTokenHandler = clientOptions.storeSessionTokenHandler;
                        if (!!this.state.sessionRequestToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, getSessionRequestToken()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [4 /*yield*/, getSessionHandler(this.state.sessionRequestToken).catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (error.name !== 'TokenExpiredError') {
                                            throw error;
                                        }
                                        // If token is expired simply retry once as it may be an invalid stored token
                                        return [4 /*yield*/, getSessionRequestToken().catch(function (e) { throw e; })];
                                    case 1:
                                        // If token is expired simply retry once as it may be an invalid stored token
                                        _a.sent();
                                        return [4 /*yield*/, getSessionHandler(this.state.sessionRequestToken).catch(function (e) { throw e; })];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }).catch(function (e) { throw e; })];
                    case 3:
                        sessionToken = _c.sent();
                        setState({
                            sessionToken: sessionToken
                        });
                        _b = storeSessionTokenHandler;
                        if (!_b) return [3 /*break*/, 5];
                        return [4 /*yield*/, storeSessionTokenHandler(this.sessionToken).catch(function (e) { throw e; })];
                    case 4:
                        _b = (_c.sent());
                        _c.label = 5;
                    case 5:
                        return [2 /*return*/];
                }
            });
        }); };
        this.closeSession = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, clientOptions, setState, closeSessionHandler, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this, clientOptions = _a.clientOptions, setState = _a.setState;
                        closeSessionHandler = clientOptions.closeSessionHandler;
                        _b = closeSessionHandler;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, closeSessionHandler(this.sessionToken).catch(function (e) { throw e; })];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        setState({
                            sessionToken: null,
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        this.clientOptions = __assign(__assign({}, this.clientOptions), options);
        restoreState
            && this.setState(restoreState);
    }
    Object.defineProperty(ClientJWTSessionManager.prototype, "sessionToken", {
        get: function () {
            return this.state.sessionToken;
        },
        enumerable: false,
        configurable: true
    });
    return ClientJWTSessionManager;
}());

exports.ClientJWTSessionManager = ClientJWTSessionManager;
exports.ServerJWTSessionManager = ServerJWTSessionManager;
exports.version = version;
//# sourceMappingURL=index.js.map
