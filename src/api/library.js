import fetch from 'node-fetch';

function pushNotif(id, payload) {
	const url = 'https://graph.facebook.com/v2.6/me/messages?access_token=';
	const pageAccessToken = 'EAALqslE8is4BAGSVjDTN5oCfT5aNlcgmQIbKOZALeLHUC9Ldc5aDZARu5jRMZBhwj5WnPzuFxL8BzTlsjKLZC90FLzYmXgbnhDo5i1Gr8X9ubIMdBSAD1wSIMwRBhSrxHYSrMLyz9rYi4mffoQAQO4eZBBCv9oL7zItyLjiIfIAZDZD'
	
	fetch(url + pageAccessToken, {
		headers: { 'Content-Type': 'application/json' },
		method: "POST",
		body: JSON.stringify(payload)	  	
	})
		.catch((e) => { console.log(e); });
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
	})
}

function pushQuickReplies(id, text, replies) {
	pushNotif(id, {
		messaging_type: 'UPDATE',
		recipient: {
			id: id
		},
		message: {
			text: text,
			quick_replies: replies.map(reply => {
				return {
					content_type: 'text',
					title: reply,
					payload: reply
				}
			})
		}
	});
}

function pushCards(id, cards, showAvailability=false) {
	return new Promise((resolve, reject) => {
		var payload = {
			recipient: {
				id: id
			},
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type:'generic',
						elements:[]
					}
				}
			}
		};
		var splicedCards;
		while(cards.length)	{
			splicedCards = cards.splice(0, 9);
			payload.message.attachment.payload.elements = [];
			
			var availablity;
			for(var i = 0; i < splicedCards.length; i++) {
				if(showAvailability && splicedCards[i].borrower != id) {
					if(splicedCards[i].borrower) {
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
					buttons:[
						{
							type: 'postback',
							title: (splicedCards[i].borrower != id? 'Borrow ' : 'Return '),
							payload: (splicedCards[i].borrower != id? 'Borrow ' : 'Return ') + ' ' + splicedCards[i].title + ' book'
						}              
					]      
				});
			}
			pushNotif(id, payload);
		}
		return resolve();
	});
}

function getIdSource(req) {
	return new Promise((resolve, reject) => {
		if(req.body.originalDetectIntentRequest.hasOwnProperty('source') && req.body.originalDetectIntentRequest.source == 'facebook') {
			const source = req.body.originalDetectIntentRequest.source;
			const id = req.body.originalDetectIntentRequest.payload.data.sender.id;
			return resolve([id, source]);
		} else {
			const source = 'DialogFlow';
			const id = req.body.session;
			return resolve([id, source]);
		}
	})
}

function checkFacebookUserId(db, currId, id){
	return new Promise((resolve, reject) => {		
		const queryString = 'SELECT source FROM user WHERE id = ? AND id != ?';
		const values = [id, currId];

		db.query(queryString, values, (err, rows) => {
			if(err) {
				console.log(eer);
				return resolve(false);
			} else {
				if(rows.length && rows[0].source == 'facebook'){
					return resolve(true);
				} else {
					return resolve(false);
				}
			}
		});
	});
}

function createFulfillmentCardSuggestions({ text, imageUri, title, subtitle, suggestions }) {
	return {
		fulfillmentMessages: [
            {
				platform: 'ACTIONS_ON_GOOGLE',
            	simpleResponses: {
					simpleResponses: [{
						textToSpeech: text
					}]
				}
            },
			{
				platform: 'ACTIONS_ON_GOOGLE',
				basicCard: {
					title: title,
					subtitle: subtitle,
					image: {
						imageUri: imageUri,
						accessibilityText: 'Cannot load image.'
					}
				}
			},
			{
				platform: 'ACTIONS_ON_GOOGLE',
				suggestions: {
					suggestions: suggestions.map(suggestion => { return { title: suggestion } })
				}
			},
			{
				card: {
					title: title,
					subtitle: subtitle,
					imageUri: imageUri
				},
				platform: 'FACEBOOK'
			},
			{
				quickReplies: {
					title: text,
					quickReplies: suggestions
				},
				platform: 'FACEBOOK'
			},
			{
				text: {
					text: [text]
				}
			}
		]
	}
}

function createFulfillmentSuggestions({ text, suggestions }) {
	return {
		fulfillmentMessages: [
            {
				platform: 'ACTIONS_ON_GOOGLE',
            	simpleResponses: {
					simpleResponses: [{
						textToSpeech: text
					}]
				}
            },
			{
				platform: 'ACTIONS_ON_GOOGLE',
				suggestions: {
					suggestions: suggestions.map(suggestion => { return { title: suggestion } })
				}
			},
			{
				quickReplies: {
					title: text,
					quickReplies: suggestions
				},
				platform: 'FACEBOOK'
			},
			{
				text: {
					text: [text]
				}
			}
		]
	}
}

export function checkUser(db, req, res) {
	return new Promise(async (resolve, reject) => {
		const data = await getIdSource(req);
		const id = data[0];
		const source = data[1];

		var queryString = 'SELECT id FROM user WHERE BINARY id = ?';

		db.query(queryString, id, (err, rows) => {
			if(err) {
				console.log(err);
				return reject();
			} else {
				if(!rows.length) {
					queryString = 'INSERT INTO user VALUES (?, ?, NOW())';
					const values = [id, source];

					db.query(queryString, values, (err, rows) => {
						if(err) {
							console.log(err);
							return reject();
						} else {
							return resolve();
						}
					});
				} else {
					queryString = 'UPDATE user SET prev_transac = NOW() WHERE id = ?'
					
					db.query(queryString, id, (err, rows) => {
						if(err) {
							console.log(err);
							return reject();
						} else {
							return resolve();
						}
					});
				}
			}
		});
	});
}

export function searchBooks(db, req, res) {
	const params = req.body.queryResult.parameters;
	const hasTitle = params.title != '';
	const hasAuthor = params.author != '';
	const hasCategory = params.category != '';
	var queryString;
	var values;

	if(hasTitle && hasAuthor && hasCategory) {
		queryString = 'SELECT * FROM book WHERE title RLIKE ? AND author RLIKE ? AND category RLIKE ? ORDER BY title';
		values = ['[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.author.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.category.replace('(', '\\(') + '[[:>:]]'];
	} else if(hasTitle && hasAuthor) {
		queryString = 'SELECT * FROM book WHERE title RLIKE ? AND author RLIKE ? ORDER BY title';
		values = ['[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.author.replace('(', '\\(') + '[[:>:]]'];
	} else if(hasTitle && hasCategory) {
		queryString = 'SELECT * FROM book WHERE title RLIKE ? AND category RLIKE ? ORDER BY title';
		values = ['[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.category.replace('(', '\\(') + '[[:>:]]'];
	} else if(hasAuthor && hasCategory) {
		queryString = 'SELECT * FROM book WHERE author RLIKE ? AND category RLIKE ? ORDER BY title';
		values = ['[[:<:]]' + params.author.replace('(', '\\(') + '[[:>:]]', '[[:<:]]' + params.category.replace('(', '\\(') + '[[:>:]]'];
	}

	if(queryString && values) {
		db.query(queryString, values, async (err, rows) => {
			if(err) {
				console.log(err);
				return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that 👾 Please say it more properly 😁' });
			}

			if(!rows.length) {
				return res.json({ fulfillmentText: 'That book is nowhere to be found 🤷‍♀️' });
			}

			var books = 'Here are the books:\n✅ Available 🚫 Taken';
			var availability;
			for(var i = 0; i < rows.length; i++) {
				availability = rows[i].borrower? '🚫' : '✅';
				books += '\n\n' + availability + ' ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
			}

			await pushCards((await getIdSource(req))[0], rows, true);

			return res.json({ fulfillmentText: 'Here are the books 😁' });
		});
	} else {
		return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that 👾 Please say it more properly 😁' });
	}
}

export function searchBooksByAuthor(db, req, res) {
	const author = req.body.queryResult.parameters.author;
	const queryString = 'SELECT * FROM book WHERE author RLIKE ? ORDER BY title';

	db.query(queryString, '[[:<:]]' + author.replace('(', '\\(') + '[[:>:]]', async (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that 👾 Please say it more properly 😁' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'That book is nowhere to be found 🤷‍♀️' });
		}

		var books = 'Here are the books:\n✅ Available 🚫 Taken';
		var availability;
		for(var i = 0; i < rows.length; i++) {
			availability = rows[i].borrower? '🚫' : '✅';
			books += '\n\n' + availability + ' ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
		}

		await pushCards((await getIdSource(req))[0], rows, true);

		return res.json({ fulfillmentText: 'Here are the books 😁' });
	});
}