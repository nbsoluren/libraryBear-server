'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.datetime = undefined;

var datetime = exports.datetime = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(db, req, res) {
        var location, key, url, result, geolocation, resolvedLocation, mom, datetime;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log("called");
                        location = req.body.queryResult.parameters.address != '' ? req.body.queryResult.parameters.address : 'Manila';
                        key = 'AIzaSyC1-DXL2WaJO-PVishqsTQVI5ClY_OBfL8';
                        url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location.replace(' ', '+') + '&key=';
                        _context.next = 6;
                        return (0, _nodeFetch2.default)(url + key);

                    case 6:
                        result = _context.sent;
                        _context.next = 9;
                        return result.json();

                    case 9:
                        result = _context.sent;

                        if (result.results.length) {
                            _context.next = 12;
                            break;
                        }

                        return _context.abrupt('return', res.json({ fulfillmentText: 'Oops, I don\'t know where that is 🤷‍♀️' }));

                    case 12:
                        geolocation = result.results[0].geometry.location;
                        resolvedLocation = result.results[0].formatted_address;


                        url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + geolocation.lat + ',' + geolocation.lng + '&timestamp=' + Date.now() / 10 + '&key=';
                        _context.next = 17;
                        return (0, _nodeFetch2.default)(url + key);

                    case 17:
                        result = _context.sent;
                        _context.next = 20;
                        return result.json();

                    case 20:
                        result = _context.sent;
                        mom = (0, _momentTimezone2.default)(new Date(new Date().getTime()));
                        datetime = mom.tz(result.timeZoneId).format('LLLL');
                        return _context.abrupt('return', res.json({ fulfillmentText: 'It is currently ' + datetime + ' in ' + resolvedLocation + ' 😁⌚️🕓' }));

                    case 24:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function datetime(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=world_time.js.map