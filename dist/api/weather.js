'use strict';

Object.defineProperty(exports, "__esModule", {
       value: true
});
exports.weather = weather;
exports.temperature = temperature;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _weatherJs = require('weather-js');

var _weatherJs2 = _interopRequireDefault(_weatherJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function weather(db, req, res) {
       var location = req.body.queryResult.parameters.address != '' ? req.body.queryResult.parameters.address : 'Manila';

       _weatherJs2.default.find({ search: location, degreeType: 'C' }, function (err, result) {
              if (err) {
                     console.log(err);
                     res.json({ fulfillmentText: 'Error 👾' });
              } else {
                     if (result.length) {
                            res.json({ fulfillmentText: 'The weather in ' + result[0].current.observationpoint + ' right now is ' + result[0].current.skytext.toLowerCase() + ' \uD83C\uDF1E\u2601\uFE0F\u2744\uFE0F\uD83C\uDF19' });
                     } else {
                            res.json({ fulfillmentText: 'Oops, I don\'t know where that is \uD83E\uDD37\u200D\u2640\uFE0F' });
                     }
              }
       });
}

function temperature(db, req, res) {
       var location = req.body.queryResult.parameters.address != '' ? req.body.queryResult.parameters.address : 'Manila';
       var unit = req.body.queryResult.parameters.unit != '' ? req.body.queryResult.parameters.unit : 'C';

       _weatherJs2.default.find({ search: location, degreeType: unit }, function (err, result) {
              if (err) {
                     console.log(err);
                     res.json({ fulfillmentText: 'Error 👾' });
              } else {
                     if (result.length) {
                            res.json({ fulfillmentText: 'It is ' + result[0].current.temperature + '\xB0' + unit + ' right now in ' + result[0].current.observationpoint + ' \uD83C\uDF1E\u2601\uFE0F\u2744\uFE0F\uD83C\uDF19' });
                     } else {
                            res.json({ fulfillmentText: 'Oops, I don\'t know where that is \uD83E\uDD37\u200D\u2640\uFE0F' });
                     }
              }
       });
}
//# sourceMappingURL=weather.js.map