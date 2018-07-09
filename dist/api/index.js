'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

require('babel-polyfill');

var _package = require('../../package.json');

var _express = require('express');

var _facets = require('./facets');

var _facets2 = _interopRequireDefault(_facets);

var _library = require('./library');

var library = _interopRequireWildcard(_library);

var _extras = require('./extras');

var extras = _interopRequireWildcard(_extras);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import * as weather from './weather';
// import * as worldTime from './world_time';
// import * as ytsList from './yts_list';

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var api = (0, _express.Router)();

	// mount the facets resource
	api.use('/facets', (0, _facets2.default)({ config: config, db: db }));

	// perhaps expose some API metadata at the root
	api.post('/bear-webhook', function () {
		var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.prev = 0;
							_context.next = 3;
							return library.checkUser(db, req, res);

						case 3:
							_context.t0 = req.body.queryResult.action;
							_context.next = _context.t0 === 'search-books' ? 6 : _context.t0 === 'search-books-by-author' ? 7 : _context.t0 === 'search-books-by-category' ? 8 : _context.t0 === 'search-books-by-title' ? 9 : _context.t0 === 'show-all-books' ? 10 : _context.t0 === 'show-all-available-books' ? 12 : _context.t0 === 'show-borrowed-books' ? 13 : 14;
							break;

						case 6:
							return _context.abrupt('return', library.searchBooks(db, req, res));

						case 7:
							return _context.abrupt('return', library.searchBooksByAuthor(db, req, res));

						case 8:
							return _context.abrupt('return', library.searchBooksByCategory(db, req, res));

						case 9:
							return _context.abrupt('return', library.searchBooksByTitle(db, req, res));

						case 10:
							console.log("called");
							return _context.abrupt('return', library.showAllBooks(db, req, res));

						case 12:
							return _context.abrupt('return', library.showAllAvailableBooks(db, req, res));

						case 13:
							return _context.abrupt('return', library.showBorrowedBooks(db, req, res));

						case 14:
							return _context.abrupt('return', res.json({ fulfillmentText: 'There is an error 👾rstrst' }));

						case 15:
							_context.next = 21;
							break;

						case 17:
							_context.prev = 17;
							_context.t1 = _context['catch'](0);

							console.log(_context.t1);
							return _context.abrupt('return', res.json({ fulfillmentText: 'There is an error 👾' }));

						case 21:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined, [[0, 17]]);
		}));

		return function (_x, _x2) {
			return _ref2.apply(this, arguments);
		};
	}());

	return api;
};
//# sourceMappingURL=index.js.map