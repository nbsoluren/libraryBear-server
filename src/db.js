import mysql from 'mysql';

export default callback => {
	const db = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		db: 'libraryBear'
	});


	db.connect(err => {
		if (err) {
			console.log('Error in connecting to database');
			console.log(err.message);
		} else {
			console.log('Successfully connected to database');
		}
	});

	db.query('USE LibraryBear');


	callback(db);
}
