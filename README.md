# MMM-Timetable
Display timetable for school or work.

### Screenshot
![screenshot](https://github.com/eouia/MMM-Timetable/blob/master/ttable_1.png?raw=true)

![screenshot](https://github.com/eouia/MMM-Timetable/blob/master/ttable_2.png?raw=true)


### Installation

1. Install Module
```sh
cd ~/MagicMirror/modules
git clone https://github.com/eouia/MMM-Timetable.git
```

2. Configuration
```javascript
{
  //disabled:true,
  module: "MMM-Timetable",
  position: "top_right",
  config: {
    timeFormat: "hh:mm A",
    height: "800px",
    width: "150px",
    mode: "5days", // "today", "5days", "7days"
    refreshInterval: 1000*60,
    schedules: [ //array of schedules
      {
        title: "John's Timetable",
        schedule: [
          // [weekday, starttime(24h), endtime(24h), title, subtitle, backgroundColor]
          // weekday : 1 for Monday, 2 for Tuesday, ... 7 for Sunday
          [1, "1000", "1130", "Mathmatics", "Class:1-B", "rgba(0,255,0, 0.5)"],
          [2, "0930", "1100", "Physics", "Science room"],
          [3, "1030", "1130", "Essay", "Class:1-B"],
          [4, "0930", "1150", "Mathmatics", "Class:1-A"],
          [5, "0930", "1130", "English", "Class:1-B"],
          [1, "1300", "1430", "English", "Class:1-B"],
          [2, "1300", "1430", "History", "Class:1-D", "rgba(0,255,255, 0.5)"],
          [3, "1220", "1500", "Writing", "Class:1-C"],
          [4, "1300", "1400", "Rest", ""],
          [5, "1300", "1530", "Athletes", "Playground"],
          [1, "1500", "1840", "Joy Luck Club", "Class:1-A"],
          [2, "1500", "1550", "Taekwondo school", "Dojo"],
        ]
      },
      {
        title: "Jane's Timetable",
        schedule: [
          [1, "0820", "1020", "Mathmatics", "Class:1-B", "rgba(255,0,255, 0.5)"],
          [2, "0930", "1130", "Physics", "Science room"],
        ]
      },
    ]
  }
},

```
