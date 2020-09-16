/*(c)2020 Lukas Möges*/
var calConfig = {
	rootElement:"#calendar",
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
	firstDayOfWeekOffset:6,
	showWeekdays: true,
	stylesheet:"./calendar.css"
};

function generateCalendar(config){
	if(!config)
		throw new Error("Configuration must not be empty! For more information see https://github.com/LMoeges/jscalendar");
	if(config.rootElement)
		calConfig.rootElement = config.rootElement;
	if(config.months)
		calConfig.months = config.months;
	if(config.days)
		calConfig.days = config.days;
	if(config.firstDayOfWeekOffset)
		calConfig.firstDayOfWeekOffset = config.firstDayOfWeekOffset;
	if(config.stylesheet)
		calConfig.stylesheet= config.stylesheet;
	if(config.onBoxReady)
		calConfig.onBoxReady = config.onBoxReady;
	if(config.showWeekdays!=null || config.showWeekdays != undefined)
		calConfig.showWeekdays = config.showWeekdays;
	
	//First: Load Stylesheet
	loadStyles();


	//Get the root element
	var rootElement = document.querySelector(calConfig.rootElement);
	
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
	monthSpan.innerText= calConfig.months[month]+ " "+ year;
	
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
	
	let monthDate = new Date(year, month+1, 0);
	let invBoxes = getWeekDayIncOffset(year, month, 1);
	let neededBoxes = monthDate.getDate();
	
	//Add invisible Boxes
	for(j = 0;j<invBoxes; j++)
		days.appendChild(generateBox());
	//Add Calendar Days
	for(j = 1; j<=neededBoxes; j++)
		days.appendChild(generateBox(j, month));
	
	monthDiv.appendChild(days);
	return monthDiv;
}

//Function for generating the Calendardays
function generateBox(date, month){
	var box = document.createElement("div");
	if(!date)
		box.classList.add("day-invisible");
	else{		
		box.classList.add("day");
		box.id=""+new Date().getFullYear()+"-"+(month+1)+"-"+date;

		//If the weekdays should be displayed, add them here...
		if(calConfig.showWeekdays){
			let weekday = createClassSpan("weekday");
			weekday.innerText= calConfig.days[getWeekDayIncOffset(new Date().getFullYear(), month, date)];
			box.appendChild(weekday);
		}

		let data = createClassSpan("date");

		if(!calConfig.showWeekdays)
			data.classList.add("wowd");
		data.innerText = date;
		box.appendChild(data);
		box.appendChild(createClassDiv("event"));
		
		//If it is configured to make use of this Event than create and fire it
		if(calConfig.onBoxReady){
			var boxready = new CustomEvent('boxready', {box:box});
			box.addEventListener("boxready", (e)=>{
				var day = e.target;
				calConfig.onBoxReady(day);			
			});
			box.dispatchEvent(boxready);
		}	
	}
	return box;
}

function createClassDiv(classname){return createClassElement("div", classname);}

function createClassSpan(classname){return createClassElement("span", classname);}

function createClassElement(el, classname){
	let obj = document.createElement(el);
	obj.classList.add(classname);
	return obj;
}

function getWeekDayIncOffset(year, month, day){
	return (new Date(year,month,day).getDay()+calConfig.firstDayOfWeekOffset)%7;
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
	stylesheet.href=calConfig.stylesheet;
	document.querySelector("head").appendChild(stylesheet);
}