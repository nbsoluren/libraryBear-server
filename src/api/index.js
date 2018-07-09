import 'babel-polyfill';
import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import * as library from './library';
import * as extras from './extras';
import * as weather from './weather';
import * as worldTime from './world_time';
import * as ytsList from './yts_list';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.post('/bear-webhook', async (req, res) => {
		try {
			await library.checkUser(db, req, res);

			switch(req.body.queryResult.action) {
				case 'search-books':
					return library.searchBooks(db, req, res);
				case 'search-books-by-author':
					return library.searchBooksByAuthor(db, req, res);
				case 'search-books-by-category':
					return library.searchBooksByCategory(db, req, res);
				case 'search-books-by-title':
					return library.searchBooksByTitle(db, req, res);
				case 'show-all-books':
					console.log("called");
					return library.showAllBooks(db, req, res);
				case 'show-all-available-books':
					return library.showAllAvailableBooks(db, req, res);
				case 'show-borrowed-books':
					return library.showBorrowedBooks(db, req, res);
				case 'act-like-animal':
					return extras.actLikeAnimal(db, req, res);
					// case 'notify-user-return-book':
					// return library.notifyUserReturnBook(db, req, res);
				case 'weather':
					return weather.weather(db, req, res);
				case 'temperature':
					return weather.temperature(db, req, res);
				case 'datetime':
					return worldTime.datetime(db, req, res);
				case 'list-yts-movies':
					return ytsList.listYtsMovies(db, req, res);
				case 'search-yts-movies':
					return ytsList.searchYtsMovies(db, req, res);
				case 'borrow-book':			
					return library.borrowBook(db, req, res);
				case 'return-book':	
					return library.returnBook(db, req, res);
				case 'getName':
					return library.getStarted(db,req,res);

				default:
					return res.json({ fulfillmentText: 'There is an error 👾rstrst' });
			}
		} catch(e) {
			console.log(e)
			return res.json({ fulfillmentText: 'There is an error 👾' });
		}
	});

	api.get('/users', (req, res) => {
		const queryString = 'SELECT id, name FROM user WHERE source=\'facebook\'';
		db.query(queryString, (err, rows) => {
			if(err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️'});
			} else {
				res.json({ data: rows });
			}
		})
	});

	api.get('/groups', (req, res) => {
		const queryString = 'SELECT a.id, a.name, b.name AS `group` FROM user a JOIN user_group b ON a.id=b.user WHERE a.source=\'facebook\'';
		db.query(queryString, (err, rows) => {
			if(err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️'});
			} else {
				var groups = [];
				var found;
				for(var i = 0; i < rows.length; i++) {
					found = false;
					for(var j = 0; j < groups.length; j++) {
						if(groups[j].name == rows[i].group){
							found = true;
							groups[j].users.push({
								id: rows[i].id,
								name: rows[i].name
							});
							break;
						}
					}
					if(!found) {
						groups.push({
							name: rows[i].group,
							users: [{
								id: rows[i].id,
								name: rows[i].name
							}]
						})
					}
				}
				res.json({ data: groups });
			}
		})
	});

	api.post('/groups', (req, res) => {
		var queryString = 'SELECT name FROM user_group WHERE name = ?';

		db.query(queryString, req.body.name, (err, rows) => {
			if(err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️'});
			} else if(rows.length) {
				res.json({ message: 'Group name already taken' });
			} else {
				for(var i = 0; i < req.body.users.length; i++) {
					queryString = 'INSERT IGNORE INTO user_group VALUES(?, ?)';
					const values = [req.body.name, req.body.users[i]];

					db.query(queryString, values, (err, rows) => {
						if(err) {
							console.log(err);
							res.status(500).json({ message: 'There was a problem with the database ☹️'});
						}
					});
				}
				res.json({ message: 'Successfully created group' });
			}
		});
	})

	api.delete('/groups/:name', (req, res) => {
		var queryString = 'DELETE FROM user_group WHERE name = ?';

		db.query(queryString, req.params.name, (err, rows) => {
			if(err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️'});
			} else if(!rows.affectedRows) {
				res.json({ message: 'Group does not exist' });
			} else {
				res.json({ message: 'Successfully deleted group' });
			}
		});
	})

	api.post('/message-user', (req, res) => {
		const id = req.body.id;
		const message = req.body.message;

		const queryString = 'SELECT id FROM user WHERE source=\'facebook\'';
		db.query(queryString, (err, rows) => {
			if(err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️'});
			} else if(!rows.length) {
				res.json({ message: 'User not found in database 🤷‍♀️'});
			} else {
				functions.pushMessage(id, message);
				res.json({ message: 'Message successfully messaged user 🙂 '});
			}
		})
	});

	api.post('/message-users', (req, res) => {
		const users = req.body.id.map(user => {
			return { id: user };
		});
		const message = req.body.message;
		functions.sendToAllFb(users, message);
		res.json({ message: 'Message successfully messaged user 🙂 '});
	});

	api.post('/message-group', (req, res) => {
		const name = req.body.name;
		const message = req.body.message;

		var queryString = 'SELECT user FROM user_group WHERE name = ?';
		db.query(queryString, name, (err, rows) => {
			if(err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️'});
			} else if(!rows.length) {
				res.json({ message: 'Group does not exist 🤷‍♀️'});
			} else {
				const users = rows.map(row => {
					return { id: row.user }
				});
				functions.sendToAllFb(users, message);
				res.json({ message: 'Message successfully messaged the group 🙂 '});
			}
		})
	});

	api.post('/broadcast', (req, res) => {
		const message = req.body.message;

		const queryString = 'SELECT id FROM user WHERE source=\'facebook\'';
		db.query(queryString, (err, rows) => {
			if(err) {
				console.log(err);
				res.status(500).json({ message: 'There was a problem with the database ☹️'});
			} else if(rows.length) {
				functions.sendToAllFb(rows, message);
				res.json({ message: 'Message successfully broadcasted to all users 🙂 '});
			} else {
				res.json({ message: 'I haven\'t talked to anyone in facebook yet 🤷‍♀️'});
			}
		})
});

	return api;
}
