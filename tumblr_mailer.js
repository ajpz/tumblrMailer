var fs = require('fs'); 
var ejs = require('ejs'); 
var tumblr = require('tumblr.js'); 
// Contains .csvParse() and .createTimeFilterer() 
var myUtils = require('./myUtils.js'); 
// Contains mandrill connection keys, new client instantiation, and scott's sendEmail() code
var sendEmail = require('./ignore/sendEmail.js'); 
// Returns tumber credential object
var initTumblrCreds = require('./ignore/initTumblrCreds.js'); 

var DAY_RANGE = 23; 

// Create Tumblr client connection 
var client = tumblr.createClient(initTumblrCreds()); 

 /********************************************************
/* Function: loops through contact list and renders new
/* 		email template for each recipient. Calls sendEmail. 
/********************************************************/
function createAndSendEmail(emailTemplate, recipList, latestPosts) {
	recipList.forEach(function(contact) {
		var customTemplate = emailTemplate; 
		var customTemplate = ejs.render(customTemplate, 
			{ firstName: contact.firstName,
				numMonthsSinceContact: contact.numMonthsSinceContact,
				latestPosts: latestPosts
			});
		console.log('email sent to: '+contact.emailAddress); 
		// sendEmail(contact.firstName, contact.emailAddress, 'Jonathan', 'perez.jonathan@gmail.com', 'Keeping you blog-to-date!', customTemplate)
	})
}
/********************************************************
/* Kicks everything off: 
/*		use Tumblr API to get blog posts, filter by 
/* 		date, creates recipient list, and then kicks off 
/*		template generation and email sending
/********************************************************/
client.posts('ajp-z.tumblr.com', function(err, blog){
   //load and parse contact list and html template, generate latestPosts list
	var latestPosts = []; 
	var recipList = myUtils.csvParse(fs.readFileSync("./ignore/friend_list.csv", "utf8"));
	var emailTemplate = fs.readFileSync('html_template.ejs', 'utf8'); 
	//create a filter function time stamped NOW, with specified lookback DAY_RANGE!
	var timeFilter = myUtils.createTimeFilterer(DAY_RANGE); 
	//create object for each latest post and push to array 'latestPosts'	
	blog.posts.forEach(function(post) {
		if(timeFilter(post.date)) {
			latestPosts.push({
				post_url: post.post_url,
				title: post.title
			})
		}
	})
	createAndSendEmail(emailTemplate, recipList, latestPosts); 
})
