const db = require('../db');
const ObjectID = require('mongodb').ObjectID

const comments = [
	// TODO: add user id
	{
		user: 'icebear',
		content: 'Hello, world!',
		date: new Date()
	},
	{
		user: 'admin',
		content: 'Hello, world!',
		date: new Date()
	}
];

const papers = [
	{
		_id: ObjectID.createFromHexString('0'.repeat(23) + '0'),
		title: 'Cloudburst: Stateful Functions-as-a-Service',
		author: [
			{
				name: 'Vikram Sreekanti',
				contact: '88888888'
			},
			{
				name: 'Chenggang Wu',
				contact: 'example@gmail.com'
			},
			{
				name: 'Xiayue Charles Lin',
				contact: 'example@gmail.com'
			}
			],
		abstract: 'Function-as-a-Service (FaaS) platforms and “serverless” cloud computing are becoming increasingly popular. Current FaaS offerings are targeted at stateless functions that do minimal I/O and communication. We argue that the benefits of serverless computing can be extended to a broader range of applications and algorithms. We present the design and implementation of Cloudburst, a stateful FaaS platform that provides familiar Python programming with low-latency mutable state and communication, while maintaining the autoscaling benefits of serverless computing. Cloudburst accomplishes this by leveraging Anna, an autoscaling key-value store, for state sharing and overlay routing combined with mutable caches co-located with function executors for data locality. Performant cache consistency emerges as a key challenge in this architecture. To this end, Cloudburst provides a combination of lattice-encapsulated state and new definitions and protocols for distributed session consistency. Empirical results on benchmarks and diverse applications show that Cloudburst makes stateful functions practical, reducing the state-management overheads of current FaaS platforms by orders of magnitude while also improving the state of the art in serverless consistency.',
		pdf: 'https://www.cambridgeenglish.org/Images/young-learners-sample-papers-2018-vol1.pdf',
		comments,
		likes: [ 'admin', 'icebear', 'bob' ],
		stars: 10
	},
	{
		_id: ObjectID.createFromHexString('0'.repeat(23) + '1'),
		title: 'Serverless Computing: One Step Forward, Two Steps Back',
		author: [
			{
				name: 'Joseph M. Hellerstein',
				contact: '88888888'
			},
			{
				name: 'Jose Faleiro',
				contact: 'example@gmail.com'
			},
			{
				name: 'Joseph E. Gonzalez',
				contact: 'example@gmail.com'
			},
			{
				name: 'Johann Schleier-Smith',
				contact: 'example@gmail.com'
			}
],
		abstract: 'Serverless computing offers the potential to program the cloud in an autoscaling, pay-as-you go manner. In this paper we address critical gaps in first-generation serverless computing, which place its autoscaling potential at odds with dominant trends in modern computing: notably data-centric and distributed computing, but also open source and custom hardware. Put together, these gaps make current serverless offerings a bad fit for cloud innovation and particularly bad for data systems innovation. In addition to pinpointing some of the main shortfalls of current serverless ar- chitectures, we raise a set of challenges we believe must be met to unlock the radical potential that the cloud—with its exabytes of storage and millions of cores—should offer to innovative developers.',
		pdf: 'https://www.cambridgeenglish.org/Images/young-learners-sample-papers-2018-vol1.pdf',
		comments,
		likes: [ 'admin', 'icebear' ],
		stars: 4
	}
];

const sessions = [
	{
		_id: ObjectID.createFromHexString('1'.repeat(23) + '0'),
		theme: 'Session 1',
		date: {
			start: '2020-10-01T14:00:00.000Z',
			end: '2020-10-01T16:00:00.000Z'
		},
		location: 'Santa Clara, CA, United States\nHyatt Regency Santa Clara',
		host: 'Jim Michael',
		papers: papers.map(p => p._id)
	},
	{
		_id: ObjectID.createFromHexString('1'.repeat(23) + '1'),
		theme: 'Session 2',
		date: {
			start: '2020-10-01T14:00:00.000Z',
			end: '2020-10-01T16:00:00.000Z'
		},
		location: 'Santa Clara, CA, United States\nHyatt Regency Santa Clara',
		host: 'Jim Michael',
		papers: papers.map(p => p._id)
	}
];

const keynotes = [
	{
		_id: ObjectID.createFromHexString('4'.repeat(23) + '0'),
		theme: 'Keynote 1',
		date: {
			start: '2020-10-01T14:00:00.000Z',
			end: '2020-10-01T16:00:00.000Z'
		},
		location: 'Santa Clara, CA, United States\nHyatt Regency Santa Clara',
		host: 'Jim Michael',
		reporter: 'Jim Michael'
	},
	{
		_id: ObjectID.createFromHexString('4'.repeat(23) + '1'),
		theme: 'Keynote 2',
		date: {
			start: '2020-10-01T14:00:00.000Z',
			end: '2020-10-01T16:00:00.000Z'
		},
		location: 'Santa Clara, CA, United States\nHyatt Regency Santa Clara',
		host: 'Jim Michael',
		reporter: 'Jim Michael'
	}
];

const events = [
	{
		date: '2020-04-10',
		name: 'Tutorials are up'
	},
	{
		date: '2020-06-20',
		name: 'Registration is up'
	}
];

const conferences = [
	{
		_id: ObjectID.createFromHexString('5'.repeat(23) + '0'),
		title: "NSDI '22",
		organizer: 'USENIX',
		events,
		keynotes: keynotes.map(k => k._id),
		sessions: sessions.map(s => s._id),
		users: []
	},
	{
		_id: ObjectID.createFromHexString('5'.repeat(23) + '1'),
		title: "SREcon22 Americas",
		organizer: 'USENIX',
		events,
		keynotes: keynotes.map(k => k._id),
		sessions: sessions.map(s => s._id),
		users: []
	},
	{
		_id: ObjectID.createFromHexString('5'.repeat(23) + '2'),
		title: "FAST '22",
		organizer: 'USENIX',
		events,
		keynotes: keynotes.map(k => k._id),
		sessions: sessions.map(s => s._id),
		users: []
	},
	{
		_id: ObjectID.createFromHexString('5'.repeat(23) + '3'),
		title: "CVPR 2020",
		organizer: 'CVF',
		events,
		keynotes: keynotes.map(k => k._id),
		sessions: sessions.map(s => s._id),
		users: []
	}
];

async function mockData() {
	const conferenceCollection = (await db).collection('conferences');
	await conferenceCollection.insertMany(conferences);

	const sessionCollection = (await db).collection('sessions');
	await sessionCollection.insertMany(sessions);

	const keynoteCollection = (await db).collection('keynotes');
	await keynoteCollection.insertMany(keynotes);

	const paperCollection = (await db).collection('papers');
	await paperCollection.insertMany(papers);

	process.exit(0);
}

mockData();
