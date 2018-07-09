import fetch from 'node-fetch';
import moment from 'moment-timezone';

export async function datetime(db, req, res) {
    console.log("called");
    const location = req.body.queryResult.parameters.address != ''? req.body.queryResult.parameters.address : 'Manila';
    const key = 'AIzaSyC1-DXL2WaJO-PVishqsTQVI5ClY_OBfL8';

    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location.replace(' ', '+') + '&key=';    
    var result = await fetch(url + key);
    result = await result.json();

    if(!result.results.length) return res.json({ fulfillmentText: 'Oops, I don\'t know where that is 🤷‍♀️' });

    const geolocation = result.results[0].geometry.location;
    const resolvedLocation = result.results[0].formatted_address;
    
    url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + geolocation.lat + ',' + geolocation.lng + '&timestamp=' + (Date.now() / 10) + '&key='
    result = await fetch(url + key);
    result = await result.json();

    var mom = moment(new Date(new Date().getTime()));
    const datetime = mom.tz(result.timeZoneId).format('LLLL');
    return res.json({ fulfillmentText: 'It is currently ' + datetime + ' in ' + resolvedLocation + ' 😁⌚️🕓' });
}