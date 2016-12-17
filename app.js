const cheerio = require('cheerio');
const Q = require('q');
const getEasy = require('./get-easy');
const async = require('async');
// Automation Dependencies //
const Nightmare = require('nightmare'), 
    vo = require('vo'),
    nightmare = Nightmare({ 
	openDevTools: {
	    mode: 'detach'
	},
	show: true});

const realMouse = require('nightmare-real-mouse');
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
let skill = 'node.js';
let location = 'NY'; 

/********************************************************************/
/* Some custom plugins just in case  */
/********************************************************************/

/*
 * Applies to one job given the url
 * Url -> IO () 
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

getEasyApplies();
/********************************************************************/
/********************************************************************/
/*
 * pass html with #search-results-control
 * to find all job urls with an easy apply option
 *
 * @param {String} url
 * Url -> [Links]
 */
function getEasyApplies(){ 

    for(var i = 0; i < 50; i++){
	url =  search + skill + search_area  +  location +  page + i;

	x(url, '#search-results-control .complete-serp-result-div', [{
	    position: 'h3 a',
	    url: 'h3 a@href',
	    applied: '*[class=applytxt]',
	    easyApply: '.easyApply',	
	}])

	((err, obj) => {
	    obj.forEach(function(x){
		if(x.easyApply){
		    console.log(x.url);
		} 
	//	x.easyApply ? {console.log(x.position); console.log(x.url);}  : null; 
	    })
	})
    }

}

function applyTo(link){

    nightmare
	.goto(link)
	.wait("#applybtn-2")
	.click('#applybtn-2')
	.wait(3000)
	.click('#resume-select')
        .wait('#resume-select-options li:nth-child(1) a')
	.click('#resume-select-options li:nth-child(1) a')
	.wait(300)
	.click('#submit-job-btn')
	.wait(300)
	.then(() => {
	    console.log("applicaton process complete...");
	})
	.catch(function (error) {
	    console.error('Search failed:', error);
	});


}

function start(){
    
    getEasy
    .getEasyApplies()
    .then((urls) => {
	for(var i = 0; i < urls.length; i++){
	    setTimeout(applyTo(urls[i]), 40000);
	}
	callback();
    });
}

/* String -> String */
function prettyPrint(text){
    return text.replace(/[^\x20-\x7E]/gmi, "").replace(/  +/g, ' ');
}

function test(){
    nightmare
	.use(apply("https://www.dice.com/jobs/detail/OFSAA-Consultant-BuzzClan-LLC-Allendale-NJ-07401/90709156/809203?icid=sr2-1p&q=&l=Hackensack, NJ"))
	.wait(3000)
	.click('#submit-job-btn')
	.catch(function(err){
	    throw err;
	})

}

