const cheerio = require('cheerio');
const Q = require('q');
const getEasy = require('./get-easy');
const async = require('async');
// Automation Dependencies //
const Nightmare = require('nightmare');
const realMouse = require('nightmare-real-mouse');
const nightmare = Nightmare({ 
    openDevTools: {
	mode: 'detach'
    },
    show: true});
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
 *
 * IO ()
 */
let applyAll = exports.applyAll = () => {

    return nightmare => {
	clickable.forEach( link => {
	    console.log(link);

	    // need to get links from getEasyApplies //
	    // Need to loop through links //
	    //--------------------------------//
	    nightmare
		.use(apply(link))
	    //--------------------------------//

	});
    }
}

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


/********************************************************************/
/********************************************************************/

// array of easy apply jobs
getEasyApplies();

var clickable = [];

/*
 * pass html with #search-results-control
 * to find all job urls with an easy apply option
 *
 * @param {String} url
 * Url -> [Links]
 */
function getEasyApplies(){ 

    for(var i = 0; i < 2; i++){
	url =  search + skill + search_area + location + page + i;

    console.log(url);
	x(url, '#search-results-control .complete-serp-result-div', [{
	    position: 'h3 a',
	    url: 'h3 a@href',
	//    applied: '.applytxt',
	    easyApply: '.easyApply',	
	}])

	((err, obj) => {
	    obj.forEach(function(x){
		console.log(x.position);

		if(x.applied){
		    console.log(x.position);
		}

		if(x.easyApply){
		 //   console.log(x.url);
		}
		//	console.log(prettyPrint(x.position));
		//	x.easyApply ? clickable.push(x.url)  : null; 

	    })
	})
    }
}
/*
getEasy.getEasyApplies().then((res) => {

    async.eachSeries(res, function(link, callback){
    	
	nightmare
	    .use(apply(link))
	    .wait(300)
	    .click('#submit-job-btn')
	    .wait(300)
	    .refresh()
	    .catch(function (error) {
		console.error('Search failed:', error);
	    });


	callback();
    }, function(err){
	if (err) { throw err;}
	console.log("done");
    });

});*/
/*    res.forEach(x => { 
	nightmare
	    .goto(x)
	    .wait("#applybtn-2")
	    .click('#applybtn-2')
	    .wait(3000)
	    .click('#resume-select')
	    .click('#resume-select-options li:nth-child(1) a')
	    .end()
	    .catch(function (error) {
		console.error('Search failed:', error);
	    });
    })

});

*/
//getEasyApplies(url);

/* String -> String */
function prettyPrint(text){
    return text.replace(/[^\x20-\x7E]/gmi, "").replace(/  +/g, ' ');
}

//getEasyApplies(url);

//start();
// easy apply button #applybtn-2

//test();

function start(){

    nightmare
	.use(applyAll())
	.evaluate()
	.catch(function (error) {
	    console.error('Search failed:', error);
	});
};


//test( getEasyApplies(url) ) // itrerate array
//test();
function test(){



	nightmare
            .use(apply("https://www.dice.com/jobs/detail/OFSAA-Consultant-BuzzClan-LLC-Allendale-NJ-07401/90709156/809203?icid=sr2-1p&q=&l=Hackensack, NJ"))
	    .wait(3000)
	    .click('#submit-job-btn')
	    .catch(function(err){
		throw err;
	    })
    

}

//getEasyApplies(url) // returns clickable array
