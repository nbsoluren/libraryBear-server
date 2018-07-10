import fetch from 'node-fetch';

function pushToFacebook(id, payload) {
	const url = 'https://graph.facebook.com/v2.6/me/messages?access_token=';
	const pageAccessToken = 'EAAdaLXIFrz8BAI5jbBbAfBrV03Yl6TnFsvpqKsvfVdUZAkGO93ZCv0YRHfVrUAu1cd1vkK3J6fJNKnjYZByZAQsSC2y7hgXCfHuPxoDMqZCkNlpCpwGMAOA2UeDvkzyxxUhbPyyrSeTx9fiZCRBfP0bI0rRA1bTEWfAhqZB4uMPeM03ZAnSF5QkA'
	
	fetch(url + pageAccessToken, {
		headers: { 'Content-Type': 'application/json' },
		method: "POST",
		body: JSON.stringify(payload)	  	
	})
		.catch((e) => { console.log(e); });

}

export function pushMessage(id, message) {
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

export function sendToAllFb(rows, message) {
	for(var i = 0; i < rows.length; i++) {
		pushMessage(rows[i].id, message);
	}
}