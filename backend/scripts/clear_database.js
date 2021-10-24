const db = require('../db');

async function clear() {
	const collections = await (await db).collections();
	await Promise.all(collections.map(
		collection => collection.drop()
	));
	process.exit(0);
}

clear();
