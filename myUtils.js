/********************************************************
/* Function: creates data structure from csv file
/********************************************************/
function csvParse (csvFile) {
	//Constructor function for Recipients 
	//	need to pass a context '_this' to forEach
	function Recipient(headers, row) {
		_this = this; 
		headers.forEach(function(header, index) {
			_this[header] = row[index]; 
		})

		// for (var i = 0; i < headers.length; i++) {
		// 	this[headers[i]] = recipient[i];
		// }
	}
	//Create an array of recipient-arrays
	var parsedArr = csvFile.trim()
		.split('\n')
		.map(function(row) {
			return row.split(','); 		 	
		}); 
	//Shift first element off parsedArr to get headers
	var headers = parsedArr.shift();
	//Map each recipient array to a Recipient object
	//return the array of objects
	return parsedArr.map(function(row) {
		return new Recipient(headers, row); 
	}); 
}

/********************************************************
/* Function: creates a function that closes around the 
/* 	time right now, and the number of 'lookBackDays'
/*  provided as argument. 
/*	The created function responds with a boolean, 
/* 	based on whether the date passed as argument
/* 	is less than lookBackDays.  
/********************************************************/
 function createTimeFilterer(lookBackDays) {
	var MILLI_SEC_PER_DAY = 86400000;
	var timeNow = new Date(); 
	return function(dateToCheck) {
		var timeToCheck = new Date(dateToCheck);  
		var daysAgo = (timeNow - timeToCheck) / MILLI_SEC_PER_DAY; 
			return daysAgo <= lookBackDays;  
	}
}


exports.csvParse = csvParse; 
exports.createTimeFilterer = createTimeFilterer; 
