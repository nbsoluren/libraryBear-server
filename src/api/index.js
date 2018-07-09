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

				default:
					return res.json({ fulfillmentText: 'There is an error 👾rstrst' });
			}
		} catch(e) {
			console.log(e)
			return res.json({ fulfillmentText: 'There is an error 👾' });
		}
	});

	return api;
}
