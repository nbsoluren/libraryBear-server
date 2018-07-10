'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback) {
	var db = _mysql2.default.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'Amazing!',
		db: 'libraryBear'
	});

	db.connect(function (err) {
		if (err) {
			console.log('Error in connecting to database');
			console.log(err.message);
		} else {
			console.log('Successfully connected to database');
		}
	});

	db.query('USE LibraryBear');

	callback(db);
};
//# sourceMappingURL=db.js.map