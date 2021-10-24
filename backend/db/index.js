const mongo = require('mongodb');

async function connectToDB() {
	const client = await mongo.MongoClient.connect('mongodb://localhost:27017', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	return client.db('mobile-app');
}

const db = connectToDB();

module.exports = db;
