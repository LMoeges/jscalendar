/*(c)2020 Lukas Möges*/

function generateCalendar(rootElementIdentifier){
	//First: Load Stylesheet
	loadStyles();
	//Get the root element
	var rootElement = document.querySelector(rootElementIdentifier);
	
	let year = new Date();
	let calendar= document.createElement("div");
	calendar.classList.add("calendar");
	for(i = 0; i < 12; i++){
		calendar.appendChild(generateMonth(year.getFullYear(), i));		
	}

	rootElement.appendChild(calendar);
	
	// Set the current month visible
	calendar.children[year.getMonth()].style.display="block";
}


function generateMonth(year, month){
	let monthDiv = createClassDiv("month");
	monthDiv.id= month;
	
	//Set the month Text
	let monthSpan = document.createElement("span");
	monthSpan.classList.add("monthname");
	monthSpan.innerText= config.months[month]+ " "+ year;
	
	//Create prev and next buttons
	let prev = document.createElement("button");
	prev.classList.add("prev");
	prev.id=month;
	prev.addEventListener("click", ()=>changeMonth(month, 11));
	prev.innerHTML ="&#x276E;";
	
	let next = document.createElement("button");
	next.classList.add("next");
	next.id=month;
	next.addEventListener("click", ()=>changeMonth(month, 1));
	next.innerHTML ="&#x276F;";
	
	//Create Monthly header
	let head = createClassDiv("head");
	head.appendChild(prev);
	head.appendChild(monthSpan);
	head.appendChild(next);
	monthDiv.appendChild(head);
	
	//Generate the days in a month
	let days= createClassDiv("days");
	
	let monthDate = new Date(year, month, 0);
	let invBoxes = (new Date(year, month, 1).getDay()+config.firstDayOfWeekOffset)%7;
	let neededBoxes = monthDate.getDate();
	
	//Add invisible Boxes
	for(j = 0;j<invBoxes; j++)
		days.appendChild(generateBox());
	//Add Calendar Days
	for(j = 1; j<=neededBoxes; j++)
		days.appendChild(generateBox(j));
	
	monthDiv.appendChild(days);
	return monthDiv;
}

//Function for generating the Calendardays
function generateBox(date){
	var box = document.createElement("div");
	if(!date)
		box.classList.add("day-invisible");
	else{		
		box.classList.add("day");
		let data = document.createElement("span");
		data.classList.add("date");
		data.innerText = date;
		if(config.dayclickfunction)
			box.addEventListener("click", config.dayclickfunction);
		box.appendChild(data);
	}
	return box;
}

function createClassDiv(classname){
	let div = document.createElement("div");
	div.classList.add(classname);
	return div;
}

function changeMonth(month, value){
	let months = document.getElementsByClassName("month");
	months[month%12].style.display= "none";
	months[(month+value)%12].style.display= "block";
}

function loadStyles(){
	let stylesheet = document.createElement("link");
	stylesheet.rel="stylesheet";
	stylesheet.type="text/css";
	stylesheet.href=config.stylesheet;
	document.querySelector("head").appendChild(stylesheet);
}