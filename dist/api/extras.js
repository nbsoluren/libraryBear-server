'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.actLikeAnimal = actLikeAnimal;
function actLikeAnimal(db, req, res) {
	switch (req.body.queryResult.parameters.animal) {
		case 'cat':
			return res.json({ fulfillmentText: 'Meow 😺' });
		case 'dog':
			return res.json({ fulfillmentText: 'Arf arf 🐶' });
		case 'bird':
			return res.json({ fulfillmentText: 'Chirp chirp 🐦' });
		case 'cow':
			return res.json({ fulfillmentText: 'Moooooooo 🐮' });
		case 'chicken':
			return res.json({ fulfillmentText: 'Cock a doodle doo 🐔' });
		case 'pig':
			return res.json({ fulfillmentText: 'Oink oink 🐷' });
		case 'owl':
			return res.json({ fulfillmentText: 'Hooooooo hooooooo 🦉' });
		case 'monkey':
			return res.json({ fulfillmentText: '🐵🍌' });
		case 'snake':
			return res.json({ fulfillmentText: 'Hisssssss 🐍' });
		case 'raven':
			return res.json({ fulfillmentText: 'Caw! Caw! 🐦' });
		case 'human':
			return res.json({ fulfillmentText: 'aCt LiKe a HuMaN 🤪🙄' });
		case 'sheep':
			return res.json({ fulfillmentText: 'Baaaaa 🐑' });
		case 'frog':
			return res.json({ fulfillmentText: 'Ribbit ribbit 🐸' });
		case 'goat':
			return res.json({ fulfillmentText: 'Maaaaaaaa 🐐' });
		default:
			return res.json({ fulfillmentText: 'I can\'t act like that at he moment. You do it instead 😅' });
	}
}
//# sourceMappingURL=extras.js.map