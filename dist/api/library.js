'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.showBorrowedBooks = exports.returnBook = undefined;

var returnBook = exports.returnBook = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(db, req, res) {
		var params, queryString, values;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						params = req.body.queryResult.parameters;
						queryString = 'SELECT id, title FROM book WHERE title RLIKE ? AND borrower = ? ORDER BY title LIMIT 1';
						_context3.t0 = '[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]';
						_context3.next = 5;
						return getIdSource(req);

					case 5:
						_context3.t1 = _context3.sent[0];
						values = [_context3.t0, _context3.t1];


						db.query(queryString, values, function (err, rows) {
							if (err) {
								console.log(err);
								return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' });
							}

							if (!rows.length) {
								return res.json({ fulfillmentText: 'But you don\'t have that book ����' });
							}

							queryString = 'UPDATE book SET borrower = null WHERE id = ? ORDER BY title LIMIT 1';

							db.query(queryString, rows[0].id, function (err, rows1) {
								if (err) {
									console.log(err);
									return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' });
								}

								return res.json(createFulfillmentSuggestions({
									text: 'Thank you for returning ' + rows[0].title + '! ����',
									suggestions: ['Borrow another book', 'Show borrowed books']
								}));
							});
						});

					case 8:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function returnBook(_x6, _x7, _x8) {
		return _ref5.apply(this, arguments);
	};
}();

var showBorrowedBooks = exports.showBorrowedBooks = function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(db, req, res) {
		var _this9 = this;

		var id, queryString;
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						_context11.next = 2;
						return getIdSource(req);

					case 2:
						id = _context11.sent[0];
						queryString = 'SELECT * FROM book WHERE borrower = ? ORDER BY title';


						db.query(queryString, id, function () {
							var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(err, rows) {
								var books, i;
								return regeneratorRuntime.wrap(function _callee10$(_context10) {
									while (1) {
										switch (_context10.prev = _context10.next) {
											case 0:
												if (!err) {
													_context10.next = 3;
													break;
												}

												console.log(err);
												return _context10.abrupt('return', res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' }));

											case 3:
												if (rows.length) {
													_context10.next = 5;
													break;
												}

												return _context10.abrupt('return', res.json({ fulfillmentText: 'You didn\'t borrow any book ����������' }));

											case 5:
												books = 'Here are your borrowed books:';

												for (i = 0; i < rows.length; i++) {
													books += '\n\n' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
												}

												_context10.t0 = pushCards;
												_context10.next = 10;
												return getIdSource(req);

											case 10:
												_context10.t1 = _context10.sent[0];
												_context10.t2 = rows;
												_context10.next = 14;
												return (0, _context10.t0)(_context10.t1, _context10.t2);

											case 14:
												return _context10.abrupt('return', res.json({ fulfillmentText: 'Here are your borrowed books ����' }));

											case 15:
											case 'end':
												return _context10.stop();
										}
									}
								}, _callee10, _this9);
							}));

							return function (_x24, _x25) {
								return _ref13.apply(this, arguments);
							};
						}());

					case 5:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, this);
	}));

	return function showBorrowedBooks(_x21, _x22, _x23) {
		return _ref12.apply(this, arguments);
	};
}();

exports.checkUser = checkUser;
exports.notifyUserReturnBook = notifyUserReturnBook;
exports.borrowBook = borrowBook;
exports.searchBooks = searchBooks;
exports.searchBooksByAuthor = searchBooksByAuthor;
exports.searchBooksByCategory = searchBooksByCategory;
exports.searchBooksByTitle = searchBooksByTitle;
exports.showAllBooks = showAllBooks;
exports.showAllAvailableBooks = showAllAvailableBooks;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function pushNotif(id, payload) {
	var url = 'https://graph.facebook.com/v2.6/me/messages?access_token=';
	var pageAccessToken = 'EAAdaLXIFrz8BAJESmV0LhUwhFUULv6o8trw2azU3cG5O6EjvKRmMZCNvpZCiIwqraghe6LCQ2iDAcirRvxcRBkY5ZBM2mnCUa9narZBcL6iM97vXHYOcqPuEQXgZAL0CP2EvXbQ7TdeKeS0tSZAXWP6XsxCVwZA2SvDXlZCYyx6YZAaMJq8gUZAqzP';

	(0, _nodeFetch2.default)(url + pageAccessToken, {
		headers: { 'Content-Type': 'application/json' },
		method: "POST",
		body: JSON.stringify(payload)
	}).catch(function (e) {
		console.log(e);
	});
}

function pushMessage(id, message) {
	pushNotif(id, {
		messaging_type: 'UPDATE',
		recipient: {
			id: id
		},
		message: {
			text: message
		}
	});
}

function pushQuickReplies(id, text, replies) {
	pushNotif(id, {
		messaging_type: 'UPDATE',
		recipient: {
			id: id
		},
		message: {
			text: text,
			quick_replies: replies.map(function (reply) {
				return {
					content_type: 'text',
					title: reply,
					payload: reply
				};
			})
		}
	});
}

function pushCards(id, cards) {
	var showAvailability = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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

			var availablity;
			for (var i = 0; i < splicedCards.length; i++) {
				if (showAvailability && splicedCards[i].borrower != id) {
					if (splicedCards[i].borrower) {
						availablity = '; Unavailable';
					} else {
						availablity = '; Available';
					}
				} else {
					availablity = '';
				}

				payload.message.attachment.payload.elements.push({
					title: splicedCards[i].title + ' by ' + splicedCards[i].author,
					subtitle: splicedCards[i].category + availablity,
					image_url: splicedCards[i].image,
					buttons: [{
						type: 'postback',
						title: splicedCards[i].borrower != id ? 'Borrow ' : 'Return ',
						payload: (splicedCards[i].borrower != id ? 'Borrow ' : 'Return ') + ' ' + splicedCards[i].title + ' book'
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

function checkFacebookUserId(db, currId, id) {
	return new Promise(function (resolve, reject) {
		var queryString = 'SELECT source FROM user WHERE id = ? AND id != ?';
		var values = [id, currId];

		db.query(queryString, values, function (err, rows) {
			if (err) {
				console.log(eer);
				return resolve(false);
			} else {
				if (rows.length && rows[0].source == 'facebook') {
					return resolve(true);
				} else {
					return resolve(false);
				}
			}
		});
	});
}

function createFulfillmentCardSuggestions(_ref) {
	var text = _ref.text,
	    imageUri = _ref.imageUri,
	    title = _ref.title,
	    subtitle = _ref.subtitle,
	    suggestions = _ref.suggestions;

	return {
		fulfillmentMessages: [{
			platform: 'ACTIONS_ON_GOOGLE',
			simpleResponses: {
				simpleResponses: [{
					textToSpeech: text
				}]
			}
		}, {
			platform: 'ACTIONS_ON_GOOGLE',
			basicCard: {
				title: title,
				subtitle: subtitle,
				image: {
					imageUri: imageUri,
					accessibilityText: 'Cannot load image.'
				}
			}
		}, {
			platform: 'ACTIONS_ON_GOOGLE',
			suggestions: {
				suggestions: suggestions.map(function (suggestion) {
					return { title: suggestion };
				})
			}
		}, {
			card: {
				title: title,
				subtitle: subtitle,
				imageUri: imageUri
			},
			platform: 'FACEBOOK'
		}, {
			quickReplies: {
				title: text,
				quickReplies: suggestions
			},
			platform: 'FACEBOOK'
		}, {
			text: {
				text: [text]
			}
		}]
	};
}

function createFulfillmentSuggestions(_ref2) {
	var text = _ref2.text,
	    suggestions = _ref2.suggestions;

	return {
		fulfillmentMessages: [{
			platform: 'ACTIONS_ON_GOOGLE',
			simpleResponses: {
				simpleResponses: [{
					textToSpeech: text
				}]
			}
		}, {
			platform: 'ACTIONS_ON_GOOGLE',
			suggestions: {
				suggestions: suggestions.map(function (suggestion) {
					return { title: suggestion };
				})
			}
		}, {
			quickReplies: {
				title: text,
				quickReplies: suggestions
			},
			platform: 'FACEBOOK'
		}, {
			text: {
				text: [text]
			}
		}]
	};
}

function checkUser(db, req, res) {
	var _this = this;

	return new Promise(function () {
		var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
			var data, id, source, queryString;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return getIdSource(req);

						case 2:
							data = _context.sent;
							id = data[0];
							source = data[1];
							queryString = 'SELECT id FROM user WHERE BINARY id = ?';


							db.query(queryString, id, function (err, rows) {
								if (err) {
									console.log(err);
									return reject();
								} else {
									if (!rows.length) {
										queryString = 'INSERT INTO user VALUES (?, ?, NOW())';
										var values = [id, source];

										db.query(queryString, values, function (err, rows) {
											if (err) {
												console.log(err);
												return reject();
											} else {
												return resolve();
											}
										});
									} else {
										queryString = 'UPDATE user SET prev_transac = NOW() WHERE id = ?';

										db.query(queryString, id, function (err, rows) {
											if (err) {
												console.log(err);
												return reject();
											} else {
												return resolve();
											}
										});
									}
								}
							});

						case 7:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		}));

		return function (_x2, _x3) {
			return _ref3.apply(this, arguments);
		};
	}());
}

function notifyUserReturnBook(db, req, res) {
	var params = req.body.queryResult.outputContexts[0].parameters;
	var notification = 'Another person wants to borrow the book ' + params.bookTitle + ', please return it immediately after use ����\n\nThank you! ����';
	pushQuickReplies(params.id, notification, ['Return ' + params.bookTitle]);
	return res.json({ fulfillmentText: 'The borrower has now been notified ��������' });
}

function borrowBook(db, req, res) {
	var _this2 = this;

	var params = req.body.queryResult.parameters;
	var queryString = 'SELECT * FROM book WHERE title RLIKE ? ORDER BY title LIMIT 1';

	db.query(queryString, '[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', function () {
		var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err, rows) {
			var userData, data, values;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							if (!err) {
								_context2.next = 3;
								break;
							}

							console.log(err);
							return _context2.abrupt('return', res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' }));

						case 3:
							if (rows.length) {
								_context2.next = 5;
								break;
							}

							return _context2.abrupt('return', res.json({ fulfillmentText: 'Can\'t find that book in the library �������������' }));

						case 5:
							if (!rows[0].borrower) {
								_context2.next = 18;
								break;
							}

							_context2.next = 8;
							return getIdSource(req);

						case 8:
							userData = _context2.sent;
							_context2.next = 11;
							return checkFacebookUserId(db, userData[0], rows[0].borrower);

						case 11:
							if (!_context2.sent) {
								_context2.next = 15;
								break;
							}

							return _context2.abrupt('return', res.json({
								fulfillmentText: 'That book has already been borrowed ������ Would you like to notify the person to return it? ����',
								outputContexts: [{
									name: req.body.session + '/contexts/libraryborrow-book-followup',
									lifespanCount: 1,
									parameters: {
										id: rows[0].borrower,
										bookTitle: rows[0].title
									}
								}]
							}));

						case 15:
							return _context2.abrupt('return', res.json({ fulfillmentText: 'That book has already been borrowed ������' }));

						case 16:
							_context2.next = 24;
							break;

						case 18:

							queryString = 'UPDATE book SET borrower = ? WHERE title RLIKE ? ORDER BY title LIMIT 1';
							_context2.next = 21;
							return getIdSource(req);

						case 21:
							data = _context2.sent;
							values = [data[0], '[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]'];


							db.query(queryString, values, function (err, rows1) {
								if (err) {
									console.log(err);
									return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' });
								}

								return res.json(createFulfillmentCardSuggestions({
									text: 'Here\'s your book! ����',
									imageUri: rows[0].image,
									title: rows[0].title + ' by ' + rows[0].author,
									subtitle: rows[0].category,
									suggestions: ['Borrow another book', 'Return ' + rows[0].title]
								}));
							});

						case 24:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, _this2);
		}));

		return function (_x4, _x5) {
			return _ref4.apply(this, arguments);
		};
	}());
}

function searchBooks(db, req, res) {
	var _this3 = this;

	var params = req.body.queryResult.parameters;
	var hasTitle = params.title != '';
	var hasAuthor = params.author != '';
	var hasCategory = params.category != '';
	var queryString;
	var values;

	if (hasTitle && hasAuthor && hasCategory) {
		queryString = 'SELECT * FROM book WHERE title RLIKE ? AND author RLIKE ? AND category RLIKE ? ORDER BY title';
		values = ['[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.author.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.category.replace('(', '\\(') + '[[:>:]]'];
	} else if (hasTitle && hasAuthor) {
		queryString = 'SELECT * FROM book WHERE title RLIKE ? AND author RLIKE ? ORDER BY title';
		values = ['[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.author.replace('(', '\\(') + '[[:>:]]'];
	} else if (hasTitle && hasCategory) {
		queryString = 'SELECT * FROM book WHERE title RLIKE ? AND category RLIKE ? ORDER BY title';
		values = ['[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.category.replace('(', '\\(') + '[[:>:]]'];
	} else if (hasAuthor && hasCategory) {
		queryString = 'SELECT * FROM book WHERE author RLIKE ? AND category RLIKE ? ORDER BY title';
		values = ['[[:<:]]' + params.author.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.category.replace('(', '\\(') + '[[:>:]]'];
	}

	if (queryString && values) {
		db.query(queryString, values, function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(err, rows) {
				var books, availability, i;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								if (!err) {
									_context4.next = 3;
									break;
								}

								console.log(err);
								return _context4.abrupt('return', res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' }));

							case 3:
								if (rows.length) {
									_context4.next = 5;
									break;
								}

								return _context4.abrupt('return', res.json({ fulfillmentText: 'That book is nowhere to be found �������������' }));

							case 5:
								books = 'Here are the books:\n��� Available ���� Taken';

								for (i = 0; i < rows.length; i++) {
									availability = rows[i].borrower ? '����' : '���';
									books += '\n\n' + availability + ' ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
								}

								_context4.t0 = pushCards;
								_context4.next = 10;
								return getIdSource(req);

							case 10:
								_context4.t1 = _context4.sent[0];
								_context4.t2 = rows;
								_context4.next = 14;
								return (0, _context4.t0)(_context4.t1, _context4.t2, true);

							case 14:
								return _context4.abrupt('return', res.json({ fulfillmentText: 'Here are the books ����' }));

							case 15:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, _this3);
			}));

			return function (_x9, _x10) {
				return _ref6.apply(this, arguments);
			};
		}());
	} else {
		return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' });
	}
}

function searchBooksByAuthor(db, req, res) {
	var _this4 = this;

	var author = req.body.queryResult.parameters.author;
	var queryString = 'SELECT * FROM book WHERE author RLIKE ? ORDER BY title';

	db.query(queryString, '[[:<:]]' + author.replace('(', '\\(') + '[[:>:]]', function () {
		var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(err, rows) {
			var books, availability, i;
			return regeneratorRuntime.wrap(function _callee5$(_context5) {
				while (1) {
					switch (_context5.prev = _context5.next) {
						case 0:
							if (!err) {
								_context5.next = 3;
								break;
							}

							console.log(err);
							return _context5.abrupt('return', res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' }));

						case 3:
							if (rows.length) {
								_context5.next = 5;
								break;
							}

							return _context5.abrupt('return', res.json({ fulfillmentText: 'That book is nowhere to be found �������������' }));

						case 5:
							books = 'Here are the books:\n��� Available ���� Taken';

							for (i = 0; i < rows.length; i++) {
								availability = rows[i].borrower ? '����' : '���';
								books += '\n\n' + availability + ' ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
							}

							_context5.t0 = pushCards;
							_context5.next = 10;
							return getIdSource(req);

						case 10:
							_context5.t1 = _context5.sent[0];
							_context5.t2 = rows;
							_context5.next = 14;
							return (0, _context5.t0)(_context5.t1, _context5.t2, true);

						case 14:
							return _context5.abrupt('return', res.json({ fulfillmentText: 'Here are the books ����' }));

						case 15:
						case 'end':
							return _context5.stop();
					}
				}
			}, _callee5, _this4);
		}));

		return function (_x11, _x12) {
			return _ref7.apply(this, arguments);
		};
	}());
}

function searchBooksByCategory(db, req, res) {
	var _this5 = this;

	var category = req.body.queryResult.parameters.category;
	var queryString = 'SELECT * FROM book WHERE category RLIKE ? ORDER BY title';

	db.query(queryString, '[[:<:]]' + category.replace('(', '\\(') + '[[:>:]]', function () {
		var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(err, rows) {
			var books, availability, i;
			return regeneratorRuntime.wrap(function _callee6$(_context6) {
				while (1) {
					switch (_context6.prev = _context6.next) {
						case 0:
							if (!err) {
								_context6.next = 3;
								break;
							}

							console.log(err);
							return _context6.abrupt('return', res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' }));

						case 3:
							if (rows.length) {
								_context6.next = 5;
								break;
							}

							return _context6.abrupt('return', res.json({ fulfillmentText: 'That book is nowhere to be found �������������' }));

						case 5:
							books = 'Here are the books:\n��� Available ���� Taken';

							for (i = 0; i < rows.length; i++) {
								availability = rows[i].borrower ? '����' : '���';
								books += '\n\n' + availability + ' ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
							}

							_context6.t0 = pushCards;
							_context6.next = 10;
							return getIdSource(req);

						case 10:
							_context6.t1 = _context6.sent[0];
							_context6.t2 = rows;
							_context6.next = 14;
							return (0, _context6.t0)(_context6.t1, _context6.t2, true);

						case 14:
							return _context6.abrupt('return', res.json({ fulfillmentText: 'Here are the books ����' }));

						case 15:
						case 'end':
							return _context6.stop();
					}
				}
			}, _callee6, _this5);
		}));

		return function (_x13, _x14) {
			return _ref8.apply(this, arguments);
		};
	}());
}

function searchBooksByTitle(db, req, res) {
	var _this6 = this;

	var title = req.body.queryResult.parameters.title;
	var queryString = 'SELECT * FROM book WHERE title RLIKE ? ORDER BY title';

	db.query(queryString, '[[:<:]]' + title.replace('(', '\\(') + '[[:>:]]', function () {
		var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(err, rows) {
			var books, availability, i;
			return regeneratorRuntime.wrap(function _callee7$(_context7) {
				while (1) {
					switch (_context7.prev = _context7.next) {
						case 0:
							if (!err) {
								_context7.next = 3;
								break;
							}

							console.log(err);
							return _context7.abrupt('return', res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' }));

						case 3:
							if (rows.length) {
								_context7.next = 5;
								break;
							}

							return _context7.abrupt('return', res.json({ fulfillmentText: 'That book is nowhere to be found �������������' }));

						case 5:
							books = 'Here are the books:\n��� Available ���� Taken';

							for (i = 0; i < rows.length; i++) {
								availability = rows[i].borrower ? '����' : '���';
								books += '\n\n' + availability + ' ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
							}

							_context7.t0 = pushCards;
							_context7.next = 10;
							return getIdSource(req);

						case 10:
							_context7.t1 = _context7.sent[0];
							_context7.t2 = rows;
							_context7.next = 14;
							return (0, _context7.t0)(_context7.t1, _context7.t2, true);

						case 14:
							return _context7.abrupt('return', res.json({ fulfillmentText: 'Here are the books ����' }));

						case 15:
						case 'end':
							return _context7.stop();
					}
				}
			}, _callee7, _this6);
		}));

		return function (_x15, _x16) {
			return _ref9.apply(this, arguments);
		};
	}());
}

function showAllBooks(db, req, res) {
	var _this7 = this;

	var queryString = 'SELECT * FROM book ORDER BY title';

	db.query(queryString, function () {
		var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(err, rows) {
			var books, availability, i;
			return regeneratorRuntime.wrap(function _callee8$(_context8) {
				while (1) {
					switch (_context8.prev = _context8.next) {
						case 0:
							if (!err) {
								_context8.next = 3;
								break;
							}

							console.log(err);
							return _context8.abrupt('return', res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' }));

						case 3:
							if (rows.length) {
								_context8.next = 5;
								break;
							}

							return _context8.abrupt('return', res.json({ fulfillmentText: 'There are currently no books ����������' }));

						case 5:
							books = 'Here are the books:\n��� Available ���� Taken';

							for (i = 0; i < rows.length; i++) {
								availability = rows[i].borrower ? '����' : '���';
								books += '\n\n' + availability + ' ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
							}

							_context8.t0 = pushCards;
							_context8.next = 10;
							return getIdSource(req);

						case 10:
							_context8.t1 = _context8.sent[0];
							_context8.t2 = rows;
							_context8.next = 14;
							return (0, _context8.t0)(_context8.t1, _context8.t2, true);

						case 14:
							return _context8.abrupt('return', res.json({ fulfillmentText: 'Here are all the books ����' }));

						case 15:
						case 'end':
							return _context8.stop();
					}
				}
			}, _callee8, _this7);
		}));

		return function (_x17, _x18) {
			return _ref10.apply(this, arguments);
		};
	}());
}

function showAllAvailableBooks(db, req, res) {
	var _this8 = this;

	var queryString = 'SELECT * FROM book WHERE borrower IS NULL ORDER BY title';

	db.query(queryString, function () {
		var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(err, rows) {
			var books, i;
			return regeneratorRuntime.wrap(function _callee9$(_context9) {
				while (1) {
					switch (_context9.prev = _context9.next) {
						case 0:
							if (!err) {
								_context9.next = 3;
								break;
							}

							console.log(err);
							return _context9.abrupt('return', res.json({ fulfillmentText: 'Hmm. I might have misunderstood that ���� Please say it more properly ����' }));

						case 3:
							if (rows.length) {
								_context9.next = 5;
								break;
							}

							return _context9.abrupt('return', res.json({ fulfillmentText: 'There are currently no available books ����������' }));

						case 5:
							books = 'Here are the available books:';

							for (i = 0; i < rows.length; i++) {
								books += '\n\n' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
							}

							_context9.t0 = pushCards;
							_context9.next = 10;
							return getIdSource(req);

						case 10:
							_context9.t1 = _context9.sent[0];
							_context9.t2 = rows;
							_context9.next = 14;
							return (0, _context9.t0)(_context9.t1, _context9.t2);

						case 14:
							return _context9.abrupt('return', res.json({ fulfillmentText: 'Here are the available books ����' }));

						case 15:
						case 'end':
							return _context9.stop();
					}
				}
			}, _callee9, _this8);
		}));

		return function (_x19, _x20) {
			return _ref11.apply(this, arguments);
		};
	}());
}
//# sourceMappingURL=library.js.map