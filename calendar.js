/*(c)2020 Lukas Möges*/
var calConfig = {
	rootElement:"#calendar",
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
	firstDayOfWeekOffset:6,
	showWeekdays: true,
	stylesheet:"./calendar.css"
};

const monthIdPrefix = "MID_";
const yearIdPrefix = "YID_";
const dayIdPrefix = "DID_";

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
	var rootElement = get(calConfig.rootElement);
	
	let now = new Date();
	let calendar= document.createElement("div");
	calendar.classList.add("calendar");
	for(i = 0; i < 12; i++)
		calendar.appendChild(generateMonth(now.getFullYear(), i));		
	

	rootElement.appendChild(calendar);
	
	// Set the current month visible
	calendar.children[0].style.display="block";
}


function generateMonth(year, month){
	let monthDiv = createClassDiv("month");
	let monthId =month<10?`${monthIdPrefix}${year}-0${month}`:`${monthIdPrefix}${year}-${month}` 
	monthDiv.id= monthId;
	
	//Set the month Text
	let monthSpan = document.createElement("span");
	monthSpan.classList.add("monthname");
	monthSpan.innerText= `${calConfig.months[month]} ${year}`;
	
	//Create prev and next buttons
	let prev = document.createElement("button");
	prev.classList.add("prev");
	prev.id=monthId;
	//prev.addEventListener("click", ()=>changeMonth(month, 11));
	prev.addEventListener("click", ()=>changeMonth(monthId, -1));
	prev.innerHTML ="&#x276E;";
	
	let next = document.createElement("button");
	next.classList.add("next");
	next.id=monthId;
	//next.addEventListener("click", ()=>changeMonth(month, 1));
	next.addEventListener("click", ()=>changeMonth(monthId, 1));
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
		days.appendChild(generateBox(j, month, year));
	
	monthDiv.appendChild(days);
	return monthDiv;
}

//Function for generating the Calendardays
function generateBox(date, month, year){
	var box = document.createElement("div");
	if(!date)
		box.classList.add("day-invisible");
	else{		
		box.classList.add("day");
		box.id=`${dayIdPrefix}${year}-${month + 1}-${date}`;

		//If the weekdays should be displayed, add them here...
		if(calConfig.showWeekdays){
			let weekday = createClassSpan("weekday");
			weekday.innerText= calConfig.days[getWeekDayIncOffset(year, month, date)];
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

function changeMonth(currMonthId, value){
	
	//Get the selected year and month from the clicked button id.
	let year = Number(currMonthId.match(/\d{4}/g)[0]);
	let month = Number(currMonthId.match(/-\d\d/g)[0].substring(1));
	let currMonthDiv = get(`#${currMonthId}`);
	let nextMonthDiv;

	let nextMonthNumber= month+(value);

	//Try to get the next month div for
	if(nextMonthNumber<0)
		nextMonthDiv = get(`#${monthIdPrefix}${year-1}-11`);
	else if(nextMonthNumber>11)
		nextMonthDiv=get(`#${monthIdPrefix}${year+1}-00`);
	else if(nextMonthNumber<10)
		nextMonthDiv=get(`#${monthIdPrefix}${year}-0${month+(value)}`);
	else
		nextMonthDiv=get(`#${monthIdPrefix}${year}-${month+(value)}`);

	//If the month currently does not exist, generate it. In the future this probatly will be configurable via flag.
	if(nextMonthDiv == null){
		let monthTmp;
		if(nextMonthNumber<0){
			monthTmp = generateMonth(year-1, 11);
			get(".calendar").insertBefore(monthTmp, currMonthDiv);

		}
		else if(nextMonthNumber>11){
			monthTmp = generateMonth(year+1,0);
			get(".calendar").appendChild(monthTmp); 

		}
		else{
			monthTmp = generateMonth(year, nextMonthNumber);
			get(".calendar").appendChild(monthTmp);
		}
		nextMonthDiv = monthTmp;		
	}

	currMonthDiv.style.display= "none";
	nextMonthDiv.style.display="block";
}

function loadStyles(){
	let stylesheet = document.createElement("link");
	stylesheet.rel="stylesheet";
	stylesheet.type="text/css";
	stylesheet.href=calConfig.stylesheet;
	document.querySelector("head").appendChild(stylesheet);
}

function get(element){
	return document.querySelector(element);
}