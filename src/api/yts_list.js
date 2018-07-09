import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

function pushNotif(id, payload) {
    const url = 'https://graph.facebook.com/v2.6/me/messages?access_token=';
    const pageAccessToken = 'EAALqslE8is4BAGSVjDTN5oCfT5aNlcgmQIbKOZALeLHUC9Ldc5aDZARu5jRMZBhwj5WnPzuFxL8BzTlsjKLZC90FLzYmXgbnhDo5i1Gr8X9ubIMdBSAD1wSIMwRBhSrxHYSrMLyz9rYi4mffoQAQO4eZBBCv9oL7zItyLjiIfIAZDZD'
    
    fetch(url + pageAccessToken, {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify(payload)       
    })
        .catch((e) => { console.log(e); });
}

function pushCards(id, cards) {
    return new Promise((resolve, reject) => {
        var payload = {
            recipient: {
                id: id
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type:'generic',
                        elements:[]
                    }
                }
            }
        };
        var splicedCards;
        while(cards.length) {
            splicedCards = cards.splice(0, 9);
            payload.message.attachment.payload.elements = [];
            
            for(var i = 0; i < splicedCards.length; i++) {
                payload.message.attachment.payload.elements.push({
                    title: splicedCards[i].title + ' (' + splicedCards[i].year + ')',
                    subtitle: splicedCards[i].genre + ' — ' + splicedCards[i].rating,
                    image_url: splicedCards[i].image,
                    buttons:[
                        {
                            type: 'web_url',
                            title: 'Open',
                            url: splicedCards[i].link
                        }              
                    ]      
                });
            }
            pushNotif(id, payload);
        }
        return resolve();
    });
}

function getIdSource(req) {
    return new Promise((resolve, reject) => {
        if(req.body.originalDetectIntentRequest.hasOwnProperty('source') && req.body.originalDetectIntentRequest.source == 'facebook') {
            const source = req.body.originalDetectIntentRequest.source;
            const id = req.body.originalDetectIntentRequest.payload.data.sender.id;
            return resolve([id, source]);
        } else {
            const source = 'DialogFlow';
            const id = req.body.session;
            return resolve([id, source]);
        }
    })
}

function getHtmlFile(url) {
    return new Promise(async (resolve, reject) => {
        const res = await fetch(url);
        return resolve(await res.text());
    });
}

function parseYtsMovies($) {
    return new Promise((resolve, reject) => {
        return resolve($('.browse-movie-wrap').map((i, element) => {
            return {
                image: $(element).find('.img-responsive').attr('src'),
                title: $(element).find('.browse-movie-title').text(),
                year: $(element).find('.browse-movie-year').text(),
                rating: $(element).find('.rating').text(),
                genre: $(element).find('h4').not('.rating').text(),
                link: $(element).find('.browse-movie-link').attr('href')
            };
        }).get());
    });
}

function getNoOfYtsMovies(numberOfMovies) {
    return new Promise(async (resolve, reject) => {
        var url = 'https://yts.am/browse-movies';

        var html = await getHtmlFile(url);
        var $ = cheerio.load(html);
        var movieList = await parseYtsMovies($);
        var pageNum = 2;

        while(movieList.length < numberOfMovies) {
            html = await getHtmlFile(url + '?page=' + pageNum++);
            $ = cheerio.load(html);
            movieList = [...movieList, ...(await parseYtsMovies($))];
        }

        return resolve(movieList.slice(0, numberOfMovies));
    });
}

function getSearchedYtsMovies(toSearch) {
    return new Promise(async (resolve, reject) => {
        var url = 'https://yts.am/browse-movies/' + toSearch.replace(' ', '%20') + '/all/all/0/latest';

        var html = await getHtmlFile(url);
        var $ = cheerio.load(html);
        var movieList = await parseYtsMovies($);
        var pageNum = 2;

        var hasNext = $('.tsc_pagination .tsc_paginationA .tsc_paginationA06').last().text() == 'Next »';
        while(movieList.length < 27 && hasNext) {
            html = await getHtmlFile(url + '?page=' + pageNum++);
            $ = cheerio.load(html);
            movieList = [...movieList, ...(await parseYtsMovies($))];
            hasNext = $('.tsc_pagination .tsc_paginationA .tsc_paginationA06').last().text() == 'Next »';
        }

        return resolve(movieList.slice(0, 27));
    });
}

export async function listYtsMovies(db, req, res) {
    const params = req.body.queryResult.parameters;
    pushCards((await getIdSource(req))[0], await getNoOfYtsMovies(params.number))
    return res.json({ fulfillmentText: 'Here you go 😁🎞: ' });
}

export async function searchYtsMovies(db, req, res) {
    const params = req.body.queryResult.parameters;
    var results = await getSearchedYtsMovies(params.search);

    if(await results.length == 0) {
        return res.json({ fulfillmentText: 'I found no movies like that 🤷‍♀️' });
    } else if(await results.length == 27) {
        pushCards((await getIdSource(req))[0], results);
        return res.json({ fulfillmentText: 'Here you go (limited to 27 results) 😁🎞: ' });
    } else {
        pushCards((await getIdSource(req))[0], results);
        return res.json({ fulfillmentText: 'Here you go 😁🎞: ' });
    }
}