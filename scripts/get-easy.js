const Q = require('q');
const cheerio = require('cheerio');

// Automation Dependencies //
const Nightmare = require('nightmare');
const realMouse = require('nightmare-real-mouse');
const nightmare = Nightmare({
    openDevTools: {
	mode: 'detach'
    },
    show: true });
realMouse(Nightmare);

// Scraping Dependencies //
const Xray = require('x-ray');
const x = Xray();

// Url Patterns
let base = 'http://www.dice.com';
let search = 'http://www.dice.com/jobs?q=';
let search_area ='&l=';
let page = '&startPage=';

// options
let skill = 'javascript';
let location = 'Hackensack';
let url = search + skill + search_area;


module.exports = {

    getEasyApplies: () => {

	let deferred = Q.defer();

	let links = [];

	for(var i = 0; i < 10; i++){

	    url = search + skill + page + i;
	    x(url, '#search-results-control .complete-serp-result-div', [{
		position: 'h3 a',
		url: 'h3 a@href',
		easyApply: '.easyApply',
	    }])
	    ( (err, obj) => {
		obj.forEach(function(x){
		    x.easyApply ? links.push(x.url) : null;
		})
		deferred.resolve(links);
	    })
	}

	return deferred.promise;
    }
};

