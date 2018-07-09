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

var _weather = require('./weather');

var weather = _interopRequireWildcard(_weather);

var _world_time = require('./world_time');

var worldTime = _interopRequireWildcard(_world_time);

var _yts_list = require('./yts_list');

var ytsList = _interopRequireWildcard(_yts_list);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
							_context.next = _context.t0 === 'search-books' ? 6 : _context.t0 === 'search-books-by-author' ? 7 : _context.t0 === 'search-books-by-category' ? 8 : _context.t0 === 'search-books-by-title' ? 9 : _context.t0 === 'show-all-books' ? 10 : _context.t0 === 'show-all-available-books' ? 12 : _context.t0 === 'show-borrowed-books' ? 13 : _context.t0 === 'act-like-animal' ? 14 : _context.t0 === 'weather' ? 15 : _context.t0 === 'temperature' ? 16 : _context.t0 === 'datetime' ? 17 : _context.t0 === 'list-yts-movies' ? 18 : _context.t0 === 'search-yts-movies' ? 19 : _context.t0 === 'borrow-book' ? 20 : _context.t0 === 'return-book' ? 21 : _context.t0 === 'getName' ? 22 : 23;
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
							return _context.abrupt('return', extras.actLikeAnimal(db, req, res));

						case 15:
							return _context.abrupt('return', weather.weather(db, req, res));

						case 16:
							return _context.abrupt('return', weather.temperature(db, req, res));

						case 17:
							return _context.abrupt('return', worldTime.datetime(db, req, res));

						case 18:
							return _context.abrupt('return', ytsList.listYtsMovies(db, req, res));

						case 19:
							return _context.abrupt('return', ytsList.searchYtsMovies(db, req, res));

						case 20:
							return _context.abrupt('return', library.borrowBook(db, req, res));

						case 21:
							return _context.abrupt('return', library.returnBook(db, req, res));

						case 22:
							return _context.abrupt('return', library.getStarted(db, req, res));

						case 23:
							return _context.abrupt('return', res.json({ fulfillmentText: 'There is an error 👾rstrst' }));

						case 24:
							_context.next = 30;
							break;

						case 26:
							_context.prev = 26;
							_context.t1 = _context['catch'](0);

							console.log(_context.t1);
							return _context.abrupt('return', res.json({ fulfillmentText: 'There is an error 👾' }));

						case 30:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined, [[0, 26]]);
		}));

		return function (_x, _x2) {
			return _ref2.apply(this, arguments);
		};
	}());

	api.get('/users', function (req, res) {
		var queryString = 'SELECT id, name FROM user WHERE source=\'facebook\'';
		db.query(queryString, function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️' });
			} else {
				res.json({ data: rows });
			}
		});
	});

	api.get('/groups', function (req, res) {
		var queryString = 'SELECT a.id, a.name, b.name AS `group` FROM user a JOIN user_group b ON a.id=b.user WHERE a.source=\'facebook\'';
		db.query(queryString, function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️' });
			} else {
				var groups = [];
				var found;
				for (var i = 0; i < rows.length; i++) {
					found = false;
					for (var j = 0; j < groups.length; j++) {
						if (groups[j].name == rows[i].group) {
							found = true;
							groups[j].users.push({
								id: rows[i].id,
								name: rows[i].name
							});
							break;
						}
					}
					if (!found) {
						groups.push({
							name: rows[i].group,
							users: [{
								id: rows[i].id,
								name: rows[i].name
							}]
						});
					}
				}
				res.json({ data: groups });
			}
		});
	});

	api.post('/groups', function (req, res) {
		var queryString = 'SELECT name FROM user_group WHERE name = ?';

		db.query(queryString, req.body.name, function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️' });
			} else if (rows.length) {
				res.json({ message: 'Group name already taken' });
			} else {
				for (var i = 0; i < req.body.users.length; i++) {
					queryString = 'INSERT IGNORE INTO user_group VALUES(?, ?)';
					var values = [req.body.name, req.body.users[i]];

					db.query(queryString, values, function (err, rows) {
						if (err) {
							console.log(err);
							res.status(500).json({ message: 'There was a problem with the database ☹️' });
						}
					});
				}
				res.json({ message: 'Successfully created group' });
			}
		});
	});

	api.delete('/groups/:name', function (req, res) {
		var queryString = 'DELETE FROM user_group WHERE name = ?';

		db.query(queryString, req.params.name, function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️' });
			} else if (!rows.affectedRows) {
				res.json({ message: 'Group does not exist' });
			} else {
				res.json({ message: 'Successfully deleted group' });
			}
		});
	});

	api.post('/message-user', function (req, res) {
		var id = req.body.id;
		var message = req.body.message;

		var queryString = 'SELECT id FROM user WHERE source=\'facebook\'';
		db.query(queryString, function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️' });
			} else if (!rows.length) {
				res.json({ message: 'User not found in database 🤷‍♀️' });
			} else {
				functions.pushMessage(id, message);
				res.json({ message: 'Message successfully messaged user 🙂 ' });
			}
		});
	});

	api.post('/message-users', function (req, res) {
		var users = req.body.id.map(function (user) {
			return { id: user };
		});
		var message = req.body.message;
		functions.sendToAllFb(users, message);
		res.json({ message: 'Message successfully messaged user 🙂 ' });
	});

	api.post('/message-group', function (req, res) {
		var name = req.body.name;
		var message = req.body.message;

		var queryString = 'SELECT user FROM user_group WHERE name = ?';
		db.query(queryString, name, function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️' });
			} else if (!rows.length) {
				res.json({ message: 'Group does not exist 🤷‍♀️' });
			} else {
				var users = rows.map(function (row) {
					return { id: row.user };
				});
				functions.sendToAllFb(users, message);
				res.json({ message: 'Message successfully messaged the group 🙂 ' });
			}
		});
	});

	api.post('/broadcast', function (req, res) {
		var message = req.body.message;

		var queryString = 'SELECT id FROM user WHERE source=\'facebook\'';
		db.query(queryString, function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️' });
			} else if (rows.length) {
				functions.sendToAllFb(rows, message);
				res.json({ message: 'Message successfully broadcasted to all users 🙂 ' });
			} else {
				res.json({ message: 'I haven\'t talked to anyone in facebook yet 🤷‍♀️' });
			}
		});
	});

	return api;
};
//# sourceMappingURL=index.js.map