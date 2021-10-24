const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../db');
const ObjectID = require('mongodb').ObjectID

router.get('/', async ctx => {
	// TODO: search conferences
	const collection = (await db).collection('conferences');
	const conferences = await collection.find({}).toArray();
	console.log(conferences);
	ctx.body = conferences;
});

router.get('/:id', async ctx => {
	console.log(ctx.params.id)
	const collection = (await db).collection('conferences');
	const sessions = (await db).collection('sessions');
	const keynotes = (await db).collection('keynotes');
	const conference = await collection.findOne({ _id: ObjectID.createFromHexString(ctx.params.id) });
	console.log(conference);
	if (!conference.sessions) conference.sessions = [];
	if (!conference.keynotes) conference.keynotes = [];
	if (!conference.events) conference.events = [];
	conference.sessions = await Promise.all(conference.sessions.map(async sessionId => await sessions.findOne({ _id: ObjectID(sessionId) })));
	conference.keynotes = await Promise.all(conference.keynotes.map(async keynoteId => await keynotes.findOne({ _id: ObjectID(keynoteId) })));
	ctx.body = conference;
	console.log("get", ctx.body);
});

// Participate
router.post('/:id/users', async ctx => {
	console.log(ctx.request.body)
	const confCollection = (await db).collection('conferences');

	if (ctx.request.body.action) {
		await confCollection.updateOne(
			{ _id: ObjectID.createFromHexString(ctx.params.id) },
			{ $addToSet: { users: ctx.user.username } }
		);
	}
	else {
		await confCollection.updateOne(
			{ _id: ObjectID.createFromHexString(ctx.params.id) },
			{ $pull: { users: ctx.user.username } }
		);
	}

	ctx.status = 200;
});

router.get('/sessions/:sessionId', async ctx => {
	// TODO: get session info
	console.log(ctx.params.sessionId);
	const sessions = (await db).collection('sessions');
	const session = await sessions.findOne({ _id: ObjectID(ctx.params.sessionId) });
	ctx.body = session;
});

router.get('/keynotes/:keynoteId', async ctx => {
	// TODO: get keynote info
	console.log(ctx.params.keynoteId);
	const keynotes = (await db).collection('keynotes');
	const keynote = await keynotes.findOne({ _id: ObjectID(ctx.params.keynoteId) });
	ctx.body = keynote;
	console.log(keynote);
});


router.get('/sessions/:id/papers', async ctx => {
	const sessions = (await db).collection('sessions');
	const papers = (await db).collection('papers');
	const users = (await db).collection("users");
	console.log("getpapers");
	console.log(ctx.params.id);
	const session = await sessions.findOne({ _id: ObjectID.createFromHexString(ctx.params.id) });
	// papers
	if (!session.papers) session.papers = [];
	const result = await Promise.all(session.papers.map(async paperId => await papers.findOne({ _id: ObjectID(paperId) })));
	for (const paper of result) {
		for (const comment of paper.comments) {
			comment.user = await users.findOne({ username: comment.user });
		}
	}
	console.log(result);
	ctx.body = result;
});

router.get('/papers/:id', async ctx => {
	// TODO: get paper info
});

router.patch('/papers/:id', async ctx => {
	// TODO: like, collect or comment a paper
	console.log("User:", ctx.user);
	const { action, value } = ctx.request.body;
	const paperCollection = (await db).collection('papers');
	if (action === 'like') {
		if (value) {
			await paperCollection.updateOne(
				{ _id: ObjectID.createFromHexString(ctx.params.id) },
				{ $addToSet: { likes: ctx.user.username } }
			);
		}
		else {
			await paperCollection.updateOne(
				{ _id: ObjectID.createFromHexString(ctx.params.id) },
				{ $pull: { likes: ctx.user.username } }
			);
		}
		ctx.status = 200;
	}
	else if (action === 'star') {
		const userCollection = (await db).collection('users');
		if (value) {
			await userCollection.updateOne(
				{ username: ctx.user.username },
				{ $addToSet: { paperIds: ObjectID.createFromHexString(ctx.params.id) } }
			);
			await paperCollection.updateOne(
				{ _id: ObjectID.createFromHexString(ctx.params.id) },
				{ $inc: { stars: 1 } }
			);
		}
		else {
			await userCollection.updateOne(
				{ username: ctx.user.username },
				{ $pull: { paperIds: ObjectID.createFromHexString(ctx.params.id) } }
			);
			await paperCollection.updateOne(
				{ _id: ObjectID.createFromHexString(ctx.params.id) },
				{ $inc: { stars: -1 } }
			);
		}
		ctx.status = 200;
	}
	else if (action === 'comment') {
		await paperCollection.updateOne(
			{ _id: ObjectID.createFromHexString(ctx.params.id) },
			{
				$push: {
					comments: {
						user: ctx.user.username,
						content: value,
						date: new Date()
					}
				}
			}
		);
		ctx.status = 200;
	}
	else {
		ctx.status = 404;
	}
});


// Management

router.post('/', async (ctx,next) => {
	// TODO: setup a conference

	var data = ctx.request.body.data;
	var username = ctx.request.body.name;
	if (!data.sessions) data.sessions = [];
	const collection = (await db).collection('conferences');
	var res = await collection.insertOne(data);

	var id = ObjectID(res["insertedId"]);

	const users = (await db).collection("users");
	const user = await users.findOne({ username });
	await users.updateOne({ _id: user._id }, { $addToSet: { conferences: ObjectID(id) } });
	ctx.body = {"id":id,"code":200};
});

router.get('/myconferences/:username', async ctx  => {
	const username = ctx.params.username;
	const users = (await db).collection('users');
	const conferences = (await db).collection('conferences');
	let user =  await users.findOne({ username: username});
	if (!user.conferences) user.conferences = [];
	const result = await Promise.all(user.conferences.map(async conferenceId => await conferences.findOne({ _id: ObjectID(conferenceId) })));
	ctx.body = {"conference":result, "code":200};

});

router.post('/session', async (ctx,next) => {
	var data = ctx.request.body["data"];
	var conference_id = ctx.request.body["id"];
	const sessions = (await db).collection('sessions');
	
	var res = await sessions.insertOne(data);
	var id = ObjectID(res["insertedId"]);
	const conferences = (await db).collection('conferences');
	var conference = await conferences.findOne({ _id: ObjectID.createFromHexString(conference_id) });
	await conferences.updateOne({ _id: ObjectID.createFromHexString(conference_id) }, { $addToSet: { sessions: ObjectID(id) } });
	ctx.body = {"id":id, "code":200};
});

router.post('/keynote', async (ctx,next) => {
	var data = ctx.request.body["data"];
	var conference_id = ctx.request.body["id"];
	const keynotes = (await db).collection('keynotes');
	
	var res = await keynotes.insertOne(data);
	var id = ObjectID(res["insertedId"]);
	const conferences = (await db).collection('conferences');
	var conference = await conferences.findOne({ _id: ObjectID.createFromHexString(conference_id) });
	await conferences.updateOne({ _id: ObjectID.createFromHexString(conference_id) }, { $addToSet: { keynotes: ObjectID(id) } });
	ctx.body = {"id":id, "code":200};
});

router.post('/event', async (ctx,next) => {
	var data = ctx.request.body["data"];
	var conference_id = ctx.request.body["id"];

	const conferences = (await db).collection('conferences');
	var conference = await conferences.findOne({ _id: ObjectID.createFromHexString(conference_id) });
	await conferences.updateOne({ _id: ObjectID.createFromHexString(conference_id) }, 
	{ $addToSet: {	events: data } });
	ctx.body = {"code":200};
});



router.post('/paper', async (ctx,next) => {
	var data = ctx.request.body["data"];
	var session_id = ctx.request.body["id"];
	const papers = (await db).collection('papers');
	
	var res = await papers.insertOne(data);
	var id = ObjectID(res["insertedId"]);
	const sessions = (await db).collection('sessions');
	await sessions.updateOne({ _id: ObjectID.createFromHexString(session_id) }, { $addToSet: { papers: ObjectID(id) } });
	ctx.body = {"id":id, "code":200};
});


router.put('/:id',async (ctx, next) => {
	// TODO: modify a conference
	var new_item = ctx.request.body;
	const collection = (await db).collection('conferences');
	await collection.update({ _id: ObjectID.createFromHexString(ctx.params.id) }, new_item);
	ctx.body ={"code":200};
});

router.put('/sessions/:id',async (ctx, next) => {
	// TODO: modify a session
	var new_item = ctx.request.body;
	const sessions = (await db).collection('sessions');
	await sessions.update({ _id: ObjectID.createFromHexString(ctx.params.id) }, new_item);
	ctx.body ={"code":200};
});

router.put('/events/:id',async (ctx, next) => {
	// TODO: modify a event
	var item = ctx.request.body;
	var new_item = {"name":item.name, "date":item.date};
	var old_item = {"name":item.old_name, "date":item.old_date};
	const conferences = (await db).collection('conferences');
	await conferences.updateOne({ _id: ObjectID.createFromHexString(ctx.params.id), "events.name": old_item.name,
		"events.date": old_item.date}, { $set: { "events.$" : new_item } });
	ctx.body ={"code":200};
});

router.put('/keynotes/:id',async (ctx, next) => {
	// TODO: modify a keynote
	var new_item = ctx.request.body;
	const keynotes = (await db).collection('keynotes');
	await keynotes.update({ _id: ObjectID.createFromHexString(ctx.params.id) }, new_item);
	ctx.body ={"code":200};
});



router.put('/papers/:id',async (ctx, next) => {
	// TODO: modify a paper
	var new_item = ctx.request.body;
	const papers = (await db).collection('papers');
	await papers.update({ _id: ObjectID.createFromHexString(ctx.params.id) }, new_item);
	ctx.body ={"code": 200};
});

router.patch('/conference',async (ctx, next) => {
	var dic = ctx.request.body;
	var username = dic["username"];
	var conference_id = dic["conference"];
	
	const conferences = (await db).collection('conferences');
	await conferences.deleteOne({ _id: ObjectID(conference_id) });
	const users = (await db).collection('users');
	await users.updateOne(
		{ username: username },
		{ $pull: { conferences: ObjectID(conference_id) } }
	);
	ctx.body ={"code": 200};
});


router.patch('/session',async (ctx, next) => {
	var dic = ctx.request.body;
	var session_id = dic["session"];
	var conference_id = dic["conference"];
	
	const sessions = (await db).collection('sessions');
	await sessions.deleteOne({ _id: ObjectID(session_id) });
	const conferences = (await db).collection('conferences');
	await conferences.updateOne(
		{ _id: ObjectID(conference_id) },
		{ $pull: { sessions: ObjectID(session_id) } }
	);
	ctx.body ={"code": 200};
});

router.patch('/keynote',async (ctx, next) => {
	var dic = ctx.request.body;
	var keynote_id = dic["keynote"];
	var conference_id = dic["conference"];
	
	const keynotes = (await db).collection('keynotes');
	await keynotes.deleteOne({ _id: ObjectID(keynote_id) });
	const conferences = (await db).collection('conferences');
	await conferences.updateOne(
		{ _id: ObjectID(conference_id) },
		{ $pull: { keynotes: ObjectID(keynote_id) } }
	);
	ctx.body ={"code": 200};
});

router.patch('/event',async (ctx, next) => {
	var dic = ctx.request.body;
	var event = dic["event"];
	var conference_id = dic["conference"];
	const conferences = (await db).collection('conferences');
	await conferences.updateOne(
		{ _id: ObjectID(conference_id),"events.name":event.name, "events.date":event.date },
		{ $pull: { events: event } }
	);
	ctx.body ={"code": 200};
});


router.patch('/paper',async (ctx, next) => {
	var dic = ctx.request.body;
	var session_id = dic["session"];
	var paper_id = dic["paper"];
	const papers = (await db).collection('papers');
	await papers.deleteOne({ _id: ObjectID(paper_id) });
	const sessions = (await db).collection('sessions');
	await sessions.updateOne(
		{ _id: ObjectID(session_id) },
		{ $pull: { papers: ObjectID(paper_id) } }
	);
	ctx.body ={"code": 200};
});

router.get('/getsessions/:id', async ctx => {
	// get sessions of a conference
	const collection = (await db).collection('conferences');
	const conference = await collection.findOne({ _id: ObjectID.createFromHexString(ctx.params.id) });
	ctx.body ={"code":200,"sessions":conference.sessions};
});
router.get('/getkeynotes/:id', async ctx => {
	// get keynotes of a conference
	const collection = (await db).collection('conferences');
	const conference = await collection.findOne({ _id: ObjectID.createFromHexString(ctx.params.id) });
	ctx.body ={"code":200,"sessions":conference.keynotes};
});

router.get('/getpaper/:id', async ctx => {
	const papers = (await db).collection('papers');
	const paper = await papers.findOne({ _id: ObjectID.createFromHexString(ctx.params.id) });
	ctx.body = paper;
});


router.get('/sessions/management/:id/papers', async ctx => {
	const sessions = (await db).collection('sessions');
	const papers = (await db).collection('papers');
	const session = await sessions.findOne({ _id: ObjectID.createFromHexString(ctx.params.id) });
	if (!session.papers) session.papers = [];
	ctx.body = await Promise.all(session.papers.map(async paperId => await papers.findOne({ _id: ObjectID(paperId) })));
});

module.exports = router;
