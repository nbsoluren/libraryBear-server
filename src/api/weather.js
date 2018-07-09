import fetch from 'node-fetch';
import weatherjs from 'weather-js'

export function weather(db, req, res) {
	const location = req.body.queryResult.parameters.address != ''? req.body.queryResult.parameters.address : 'Manila';
	
	weatherjs.find({search: location, degreeType: 'C'}, function(err, result) {
        if(err) {
        	console.log(err);
        	res.json({ fulfillmentText: 'Error 👾' })
        } else {
        	if(result.length) {
        		res.json({ fulfillmentText: `The weather in ` + result[0].current.observationpoint + ` right now is ` + result[0].current.skytext.toLowerCase() + ` 🌞☁️❄️🌙` });
        	} else {
        		res.json({ fulfillmentText: `Oops, I don\'t know where that is 🤷‍♀️` })
        	}
        }
    });
}

export function temperature(db, req, res) {
	const location = req.body.queryResult.parameters.address != ''? req.body.queryResult.parameters.address : 'Manila';
	const unit = req.body.queryResult.parameters.unit != ''? req.body.queryResult.parameters.unit : 'C';

	weatherjs.find({search: location, degreeType: unit}, function(err, result) {
        if(err) {
        	console.log(err);
        	res.json({ fulfillmentText: 'Error 👾' })
        } else {
        	if(result.length) {
        		res.json({ fulfillmentText: `It is ` + result[0].current.temperature + `°` + unit + ` right now in ` + result[0].current.observationpoint + ` 🌞☁️❄️🌙` });
        	} else {
        		res.json({ fulfillmentText: `Oops, I don\'t know where that is 🤷‍♀️` })
        	}
        }
    });
}