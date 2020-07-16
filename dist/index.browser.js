var ClientJWTSessionManager = (function () {
    'use strict';

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

    return ClientJWTSessionManager;

}());
//# sourceMappingURL=index.browser.js.map
