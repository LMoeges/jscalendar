# jscalendar
This is a small Javascript based Calendar. You can configure the following options:
- rootElement: if you want to change the root element, in wich the calendar is generated. (The default element is `#calendar`)
- months: the name of the months (e.g. in German March is called März). (Default is english)
- firstDayOfWeekOffset: the number of days for your start of the week. (JS default: Sunday, if you want Monday as your first day of the week, set this value to '''6''')
- stylesheet: the path for the stylesheet. (The default is `./calendar.css`)
- onBoxReady: if a function is given here it will be called after each day is created. The function used here has one parameter, as wich the day-div element will be given. 

An example on how to embedd this calendar, see [example.html](./example.html)