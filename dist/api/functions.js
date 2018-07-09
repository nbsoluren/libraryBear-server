'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pushMessage = pushMessage;
exports.sendToAllFb = sendToAllFb;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pushToFacebook(id, payload) {
	var url = 'https://graph.facebook.com/v2.6/me/messages?access_token=';
	var pageAccessToken = 'token';

	(0, _nodeFetch2.default)(url + pageAccessToken, {
		headers: { 'Content-Type': 'application/json' },
		method: "POST",
		body: JSON.stringify(payload)
	}).catch(function (e) {
		console.log(e);
	});
}

function pushMessage(id, message) {
	pushToFacebook(id, {
		messaging_type: 'UPDATE',
		recipient: {
			id: id
		},
		message: {
			text: message
		}
	});
}

function sendToAllFb(rows, message) {
	for (var i = 0; i < rows.length; i++) {
		pushMessage(rows[i].id, message);
	}
}
//# sourceMappingURL=functions.js.map