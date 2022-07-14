// If you're looking at this, you probably know more about code than I do.
// I apologize for the messy code. I'm a journalist, not a developer. And this is an experiment, not a polished piece of software.
// If you'd like to make me aware of way the code could/should be improved, you can write me to hello@davidbauer.ch (or leave a pull request) 


////// CONFIG

// Number of flights as entered by user
var shortFlights = 0;
var mediumFlights = 0;
var longFlights = 0;

// Frequency of flying business as entered by user
var businessRegularity = 0;

// Assumptions: Average hours per flight type
const shortHours = 1;
const mediumHours = 3;
const longHours = 7;

// Assumptions: Average CO2-Equivalents in ton/hour per flight type
const shortCo2 = 0.200;
const mediumCo2 = 0.150;
const longCo2 = 0.150;

// Assumptions: Multiplier for business flights (more space per passenger, thus larger share of overall emissions per flight)
const shortBusinessMulti = 1.3;
const mediumBusinessMulti = 2;
const longBusinessMulti = 3;

// Assumption: Price in USD to compensate 1 ton of Co2
const pricePerTon = 25;

// To make sure we log data only once and only when we're not testing 
var dataLogged = false;
var testing = false;

var shareText = "How many flights have you taken in your lifetime, and how many emissions have they caused? Find out and join me in offsetting past emissions: https://labs.davidbauer.ch/flight-zero/";

////// INIT

$(document).ready(function() { 
	
	document.querySelectorAll('form').forEach(item => {
		item.addEventListener('change', function() {
    	
    	shortFlights = getInputVal('shortFlights')
		mediumFlights = getInputVal('mediumFlights');
		longFlights = getInputVal('longFlights');
		    	
    	updateCalc();
    });
    
    $('.co2perhourshort').text(shortCo2*1000);
    $('.co2perhourlong').text(longCo2*1000);
    
});

});

////// CALCULATIONS	
	
function updateCalc() {
	
	totalCo2 = shortFlights * shortHours * shortCo2 * (businessRegularity * (shortBusinessMulti -1) + 1 ) +
			   mediumFlights * mediumHours * mediumCo2 * (businessRegularity * (mediumBusinessMulti -1) + 1 ) +
			   longFlights * longHours * longCo2 * (businessRegularity * (longBusinessMulti -1) + 1 ); 
			   	
	$('.totalToCompensate').text(roundIt(totalCo2));
	$('.totalToCompensateKg').text(roundIt(totalCo2)*1000);
	
	totalCost = totalCo2 * pricePerTon;
	
	$('.totalCost').text(roundIt(totalCost));
	
	$('#businessRegularity').removeClass('hidden');

	$('#toCompensate').removeClass('hidden');
}


// to avoid introducing false precision, we round more generously the larger the numbers get
function roundIt(num) {
	
	if (num < 10) {
		return Math.round((num + Number.EPSILON) * 10) / 10;
	}
	
	else if (num < 50) {
		return Math.round(num);
	}
	
	else if (num < 200) {
		return Math.round(num/5) * 5;
	}
	
	else { return Math.round(num/10) * 10;
	}
	
}

		
// Function to get form value
function getInputVal(id){
	return document.getElementById(id).value;
}
	
////// LOGGING DATA

function logData() {
  
  console.log("Logging data anonymously");
  
  offsetsDB.push({
    shortFlights : shortFlights,
    mediumFlights : mediumFlights,
    longFlights : longFlights,
    businessRegularity : businessRegularity,
    totalCo2: totalCo2
  });
  
  console.log("Data logged anonymously. Only data you entered into the application is being logged, no additional data that might in any way identify you or the device you used.");
  dataLogged = true;

}


// USER ACTIONS

function updateBizRegularity(val) {
	businessRegularity = val;
	updateCalc();
	$('.selected').removeClass('selected');
	event.target.classList.add('selected');	
} 


function offsetnow() {
	$('.offsetinstructions').toggleClass("hidden");
	$('.offsetresult').toggleClass("hidden");
	$('.offsetbutton').text(function(i, t){
          return t === "Offset now" ? "Back" : "Offset now";
      });
    if(dataLogged === false && testing === false) {logData()};
}

function setClipboard() {		
  navigator.clipboard.writeText(shareText).then(function() {
    /* clipboard successfully set */
    $('.copythis').text('Copied ✔');
  }, function() {
    /* clipboard write failed */
  });
}



// it's the end of the code as we know it