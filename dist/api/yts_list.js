'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.searchYtsMovies = exports.listYtsMovies = undefined;

var listYtsMovies = exports.listYtsMovies = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(db, req, res) {
        var params;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        params = req.body.queryResult.parameters;
                        _context4.t0 = pushCards;
                        _context4.next = 4;
                        return getIdSource(req);

                    case 4:
                        _context4.t1 = _context4.sent[0];
                        _context4.next = 7;
                        return getNoOfYtsMovies(params.number);

                    case 7:
                        _context4.t2 = _context4.sent;
                        (0, _context4.t0)(_context4.t1, _context4.t2);
                        return _context4.abrupt('return', res.json({ fulfillmentText: 'Here you go 😁🎞: ' }));

                    case 10:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function listYtsMovies(_x7, _x8, _x9) {
        return _ref4.apply(this, arguments);
    };
}();

var searchYtsMovies = exports.searchYtsMovies = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(db, req, res) {
        var params, results;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        params = req.body.queryResult.parameters;
                        _context5.next = 3;
                        return getSearchedYtsMovies(params.search);

                    case 3:
                        results = _context5.sent;
                        _context5.next = 6;
                        return results.length;

                    case 6:
                        _context5.t0 = _context5.sent;

                        if (!(_context5.t0 == 0)) {
                            _context5.next = 11;
                            break;
                        }

                        return _context5.abrupt('return', res.json({ fulfillmentText: 'I found no movies like that 🤷‍♀️' }));

                    case 11:
                        _context5.next = 13;
                        return results.length;

                    case 13:
                        _context5.t1 = _context5.sent;

                        if (!(_context5.t1 == 27)) {
                            _context5.next = 24;
                            break;
                        }

                        _context5.t2 = pushCards;
                        _context5.next = 18;
                        return getIdSource(req);

                    case 18:
                        _context5.t3 = _context5.sent[0];
                        _context5.t4 = results;
                        (0, _context5.t2)(_context5.t3, _context5.t4);
                        return _context5.abrupt('return', res.json({ fulfillmentText: 'Here you go (limited to 27 results) 😁🎞: ' }));

                    case 24:
                        _context5.t5 = pushCards;
                        _context5.next = 27;
                        return getIdSource(req);

                    case 27:
                        _context5.t6 = _context5.sent[0];
                        _context5.t7 = results;
                        (0, _context5.t5)(_context5.t6, _context5.t7);
                        return _context5.abrupt('return', res.json({ fulfillmentText: 'Here you go 😁🎞: ' }));

                    case 31:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function searchYtsMovies(_x10, _x11, _x12) {
        return _ref5.apply(this, arguments);
    };
}();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _cheerio = require('cheerio');

var cheerio = _interopRequireWildcard(_cheerio);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function pushNotif(id, payload) {
    var url = 'https://graph.facebook.com/v2.6/me/messages?access_token=';
    var pageAccessToken = 'EAALqslE8is4BAGSVjDTN5oCfT5aNlcgmQIbKOZALeLHUC9Ldc5aDZARu5jRMZBhwj5WnPzuFxL8BzTlsjKLZC90FLzYmXgbnhDo5i1Gr8X9ubIMdBSAD1wSIMwRBhSrxHYSrMLyz9rYi4mffoQAQO4eZBBCv9oL7zItyLjiIfIAZDZD';

    (0, _nodeFetch2.default)(url + pageAccessToken, {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify(payload)
    }).catch(function (e) {
        console.log(e);
    });
}

function pushCards(id, cards) {
    return new Promise(function (resolve, reject) {
        var payload = {
            recipient: {
                id: id
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: []
                    }
                }
            }
        };
        var splicedCards;
        while (cards.length) {
            splicedCards = cards.splice(0, 9);
            payload.message.attachment.payload.elements = [];

            for (var i = 0; i < splicedCards.length; i++) {
                payload.message.attachment.payload.elements.push({
                    title: splicedCards[i].title + ' (' + splicedCards[i].year + ')',
                    subtitle: splicedCards[i].genre + ' — ' + splicedCards[i].rating,
                    image_url: splicedCards[i].image,
                    buttons: [{
                        type: 'web_url',
                        title: 'Open',
                        url: splicedCards[i].link
                    }]
                });
            }
            pushNotif(id, payload);
        }
        return resolve();
    });
}

function getIdSource(req) {
    return new Promise(function (resolve, reject) {
        if (req.body.originalDetectIntentRequest.hasOwnProperty('source') && req.body.originalDetectIntentRequest.source == 'facebook') {
            var source = req.body.originalDetectIntentRequest.source;
            var id = req.body.originalDetectIntentRequest.payload.data.sender.id;
            return resolve([id, source]);
        } else {
            var _source = 'DialogFlow';
            var _id = req.body.session;
            return resolve([_id, _source]);
        }
    });
}

function getHtmlFile(url) {
    var _this = this;

    return new Promise(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _nodeFetch2.default)(url);

                        case 2:
                            res = _context.sent;
                            _context.t0 = resolve;
                            _context.next = 6;
                            return res.text();

                        case 6:
                            _context.t1 = _context.sent;
                            return _context.abrupt('return', (0, _context.t0)(_context.t1));

                        case 8:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
}

function parseYtsMovies($) {
    return new Promise(function (resolve, reject) {
        return resolve($('.browse-movie-wrap').map(function (i, element) {
            return {
                image: $(element).find('.img-responsive').attr('src'),
                title: $(element).find('.browse-movie-title').text(),
                year: $(element).find('.browse-movie-year').text(),
                rating: $(element).find('.rating').text(),
                genre: $(element).find('h4').not('.rating').text(),
                link: $(element).find('.browse-movie-link').attr('href')
            };
        }).get());
    });
}

function getNoOfYtsMovies(numberOfMovies) {
    var _this2 = this;

    return new Promise(function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
            var url, html, $, movieList, pageNum;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            url = 'https://yts.am/browse-movies';
                            _context2.next = 3;
                            return getHtmlFile(url);

                        case 3:
                            html = _context2.sent;
                            $ = cheerio.load(html);
                            _context2.next = 7;
                            return parseYtsMovies($);

                        case 7:
                            movieList = _context2.sent;
                            pageNum = 2;

                        case 9:
                            if (!(movieList.length < numberOfMovies)) {
                                _context2.next = 24;
                                break;
                            }

                            _context2.next = 12;
                            return getHtmlFile(url + '?page=' + pageNum++);

                        case 12:
                            html = _context2.sent;

                            $ = cheerio.load(html);
                            _context2.t0 = [];
                            _context2.t1 = _toConsumableArray(movieList);
                            _context2.t2 = _toConsumableArray;
                            _context2.next = 19;
                            return parseYtsMovies($);

                        case 19:
                            _context2.t3 = _context2.sent;
                            _context2.t4 = (0, _context2.t2)(_context2.t3);
                            movieList = _context2.t0.concat.call(_context2.t0, _context2.t1, _context2.t4);
                            _context2.next = 9;
                            break;

                        case 24:
                            return _context2.abrupt('return', resolve(movieList.slice(0, numberOfMovies)));

                        case 25:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2);
        }));

        return function (_x3, _x4) {
            return _ref2.apply(this, arguments);
        };
    }());
}

function getSearchedYtsMovies(toSearch) {
    var _this3 = this;

    return new Promise(function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {
            var url, html, $, movieList, pageNum, hasNext;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            url = 'https://yts.am/browse-movies/' + toSearch.replace(' ', '%20') + '/all/all/0/latest';
                            _context3.next = 3;
                            return getHtmlFile(url);

                        case 3:
                            html = _context3.sent;
                            $ = cheerio.load(html);
                            _context3.next = 7;
                            return parseYtsMovies($);

                        case 7:
                            movieList = _context3.sent;
                            pageNum = 2;
                            hasNext = $('.tsc_pagination .tsc_paginationA .tsc_paginationA06').last().text() == 'Next »';

                        case 10:
                            if (!(movieList.length < 27 && hasNext)) {
                                _context3.next = 26;
                                break;
                            }

                            _context3.next = 13;
                            return getHtmlFile(url + '?page=' + pageNum++);

                        case 13:
                            html = _context3.sent;

                            $ = cheerio.load(html);
                            _context3.t0 = [];
                            _context3.t1 = _toConsumableArray(movieList);
                            _context3.t2 = _toConsumableArray;
                            _context3.next = 20;
                            return parseYtsMovies($);

                        case 20:
                            _context3.t3 = _context3.sent;
                            _context3.t4 = (0, _context3.t2)(_context3.t3);
                            movieList = _context3.t0.concat.call(_context3.t0, _context3.t1, _context3.t4);

                            hasNext = $('.tsc_pagination .tsc_paginationA .tsc_paginationA06').last().text() == 'Next »';
                            _context3.next = 10;
                            break;

                        case 26:
                            return _context3.abrupt('return', resolve(movieList.slice(0, 27)));

                        case 27:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }));

        return function (_x5, _x6) {
            return _ref3.apply(this, arguments);
        };
    }());
}
//# sourceMappingURL=yts_list.js.map