
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('links.txt')
});

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
let url = search + skill;


/********************************************************************/
/* Some custom plugins just in case  */
/********************************************************************/
let login = exports.login = (base, user, pass) => {

    return (nightmare) => {
	nightmare
	    .goto(base)
	    .wait(30000000)
    }
}

/*
 * uses other plugins, apply(),
 * and an array of scraped links
 * to automate mass application
 */
let applyAll = exports.applyAll = () => {

    return nightmare => {
	lineReader.on('line', function (line) {
	    let links = line.split(',');

	    links.forEach(link => {
		console.log(link);
		nightmare
		    .use(apply(link))
	    });
	});

    }

}

/*
 * Applies to one job given the url
 */
var apply = exports.apply = (url) => {
    return nightmare => {
	nightmare	
	    .goto(url)
	    .wait("#applybtn-2")
	    .click('#applybtn-2')
	    .wait(3000)
	    .click('#resume-select')
	    .click('#resume-select-options li:nth-child(1) a')
    }
}


/********************************************************************/

/********************************************************************/

// array of easy apply jobs

var clickable = [];

/*
 * pass html with #search-results-control
 * to find all job urls with an easy apply option
 *
 * @param {String} url
 */
function getEasyApplies(url){ 
    fs.writeFile("links.txt", '');

    for(var i = 0; i < 1; i++){
	url = search + page + i;

	x(url, '#search-results-control .complete-serp-result-div', [{
	    position: 'h3 a',
	    url: 'h3 a@href',
	    easyApply: '.easyApply',	
	}])

	( (err, obj) => {

	    obj.forEach(function(x){
		//console.log(x.position.replace(/[^\x20-\x7E]/gmi, "").replace(/  +/g, ' '));
		x.easyApply ? fs.appendFile('links.txt', x.url, 'utf8')  : null; 
	    })
	})
    }
}

//getEasyApplies(url);

//start();
// easy apply button #applybtn-2

test();
function start(){

    nightmare
	.use(applyAll())
	.evaluate(function () {
	    return document.querySelector('#main .searchCenterMiddle li a').href
	})
	.end()
	.then(function (result) {
	    console.log(result)
	})
	.catch(function (error) {
	    console.error('Search failed:', error);
	});
};

function test(){
    nightmare
	.use(apply('https://www.dice.com/jobs/detail/UX-Designer-Harvey-Nash-USA-New-York-NY-10150/esi/JA_BH40421-961?icid=sr15-1p&q=&l=Hackensack, NJ'))
	.wait(3000)
	.click('#submit-job-btn')
	.run()
}
