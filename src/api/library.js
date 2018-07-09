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

// export function notifyUserReturnBook(db, req, res) {
// 	const params = req.body.queryResult.outputContexts[0].parameters;
// 	const notification = 'Another person wants to borrow the book ' + params.bookTitle + ', please return it immediately after use 📖\n\nThank you! 😁';
// 	pushQuickReplies(params.id, notification, ['Return ' + params.bookTitle]);
// 	return res.json({ fulfillmentText: 'The borrower has now been notified 🔔😁' });
// }

export function borrowBook(db, req, res) {
	const params = req.body.queryResult.parameters;
	var queryString = 'SELECT * FROM book WHERE title RLIKE ? ORDER BY title LIMIT 1';

	db.query(queryString, '[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', async (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'We will get back to you on this.' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'Sorry we currently dont have that book in the library. 😖' });
		}

		if(rows[0].borrower) {
				return res.json({ fulfillmentText: 'Someone is currently borrowing that book, Sorry 😰' });
		} else {

			queryString = 'UPDATE book SET borrower = ? WHERE title RLIKE ? ORDER BY title LIMIT 1';
			const data = await getIdSource(req);
			const values = [data[0], '[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]'];

			db.query(queryString, values, (err, rows1) => {
				if(err) {
					console.log(err);
					return res.json({ fulfillmentText: 'We will get back to you on this.'  });
				}
			
				
				return res.json(createFulfillmentCardSuggestions({
					text: 'You\'ve succesfully borrowed a book!',
					imageUri: rows[0].image,
					title: rows[0].title + ' by ' + rows[0].author,
					subtitle: rows[0].category,
					suggestions: ['Borrow another book', 'Return ' + rows[0].title]
				}));
			});
		}
	});
}

export async function returnBook(db, req, res) {
	const params = req.body.queryResult.parameters;
	var queryString = 'SELECT id, title FROM book WHERE title RLIKE ? AND borrower = ? ORDER BY title LIMIT 1';
	const values = ['[[:<:]]' + params.title.replace('(', '\\(') + '[[:>:]]', (await getIdSource(req))[0]];

	db.query(queryString, values, (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'We will get back to you on this.' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'You can\'t return a book you didn\'t borrow. 😡' });
		}

		queryString = 'UPDATE book SET borrower = null WHERE id = ? ORDER BY title LIMIT 1';
		
		db.query(queryString, rows[0].id, (err, rows1) => {
			if(err) {
				console.log(err);
				return res.json({ fulfillmentText: 'Internal Error, We will get back to you on this.' });
			}

			return res.json(createFulfillmentSuggestions({
				text: 'Succesfully returned' + rows[0].title + '. 🤗',
				suggestions: ['Borrow another book', 'Show borrowed books']
			}));
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

export function searchBooksByCategory(db, req, res) {
	const category = req.body.queryResult.parameters.category;
	const queryString = 'SELECT * FROM book WHERE category RLIKE ? ORDER BY title';

	db.query(queryString, '[[:<:]]' + category.replace('(', '\\(') + '[[:>:]]', async (err, rows) => {
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

export function searchBooksByTitle(db, req, res) {
	const title = req.body.queryResult.parameters.title;
	const queryString = 'SELECT * FROM book WHERE title RLIKE ? ORDER BY title';

	db.query(queryString, '[[:<:]]' + title.replace('(', '\\(') + '[[:>:]]', async (err, rows) => {
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

export function showAllBooks(db, req, res) {
	const queryString = 'SELECT * FROM book ORDER BY title';

	db.query(queryString, async (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that 👾 Please say it more properly 😁' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'There are currently no books 🤷‍️' });
		}

		var books = 'Here are the books:\n✅ Available 🚫 Taken';
		var availability;
		for(var i = 0; i < rows.length; i++) {
			availability = rows[i].borrower? '🚫' : '✅';
			books += '\n\n' + availability + ' ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
		}

		await pushCards((await getIdSource(req))[0], rows, true);

		return res.json({ fulfillmentText: 'Here are all the books 😁' });
	});
}

export function showAllAvailableBooks(db, req, res) {
	const queryString = 'SELECT * FROM book WHERE borrower IS NULL ORDER BY title';

	db.query(queryString, async (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that 👾 Please say it more properly 😁' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'There are currently no available books 🤷‍️' });
		}

		var books = 'Here are the available books:';
		for(var i = 0; i < rows.length; i++) {
			books += '\n\n' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
		}

		await pushCards((await getIdSource(req))[0], rows);

		return res.json({ fulfillmentText: 'Here are the available books 😁' });
	});
}

export async function showBorrowedBooks(db, req, res) {
	const id = (await getIdSource(req))[0];
	const queryString = 'SELECT * FROM book WHERE borrower = ? ORDER BY title';

	db.query(queryString, id, async (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'Hmm. I might have misunderstood that 👾 Please say it more properly 😁' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'You didn\'t borrow any book 🤷‍️' });
		}

		var books = 'Here are your borrowed books:';
		for(var i = 0; i < rows.length; i++) {
			books += '\n\n' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category;
		}

		await pushCards((await getIdSource(req))[0], rows);
		
		return res.json({ fulfillmentText: 'Here are your borrowed books 😁' });
	});
}