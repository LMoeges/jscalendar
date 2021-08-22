# jscalendar
This is a small Javascript based Calendar. You can configure the following options:
- rootElement: if you want to change the root element, in wich the calendar is generated. (The default element is `#calendar`)
- months: the name of the months (e.g. in German March is called März). (Default is english)
- firstDayOfWeekOffset: the number of days for your start of the week. (JS default: Sunday, if you want Monday as your first day of the week, set this value to `6`)
- stylesheet: the path for the stylesheet. (The default is `./calendar.css`)
- days: here you can enter your local names for the days of the week (e.g. in German Monday is called "Montag", by default the names are in english)
- showWeekdays: when set to true the the names of the weekdays, which are set in the `days` option, will be displayed.
With the (optional) function `onBoxReady` you can insert custom text into the day elements. 
This function will be called after each day element (which is the parameter of the function) is created. 

You can also change some of the styles used in the calendar via CSS-variables. Currently there are the following variables:
```css
	--calendar-bg:transparent;     /*background of the calender*/
	--calendar-day-bg:#eee;        /*background-color of the indiviual day elements*/
	--calendar-day-bg-hover: #222; /*hover background-color of the indiviual day elements*/
	--calendar-day-col: #222;      /*font-color of the individual day elements*/
	--calendar-day-col-hover: #eee;/*font-color of the individual day elements*/
	--calendar-month-size:20px;    /*font-size of the month "header"*/
	--calendar-day-size:16px;      /*font-size of the of the number of day*/
	--calendar-weekday-size:12px;  /*font-size for the day of the week element*/
	--calender-margin-sides: 10px; /*margins on the sides of the calendar*/
```
An example on how to embedd this calendar, see [example.html](./example.html)
