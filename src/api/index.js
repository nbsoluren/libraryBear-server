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
	api.post('/tay-webhook', async (req, res) => {
		try {
			await library.checkUser(db, req, res);

			switch(req.body.queryResult.action) {
				case 'search-books':
					return library.searchBooks(db, req, res);
				case 'search-books-by-author':
					return library.searchBooksByAuthor(db, req, res);
				case 'search-books-by-category':
					return library.searchBooksByCategory(db, req, res);

				default:
					return res.json({ fulfillmentText: 'There is an error 👾' });
			}
		} catch(e) {
			console.log(e)
			return res.json({ fulfillmentText: 'There is an error 👾' });
		}
	});

	return api;
}
