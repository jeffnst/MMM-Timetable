
//
// MMM-Timetable
//


var convertTime = function(num) {
  var rnum = Number(num)
  var m = rnum % 100
  var h = (rnum - m) / 100
  return (h * 60) + m
}

var timeFormat = function(str, format) {
  return moment(str, "HHmm").format(format)
}

Module.register("MMM-Timetable", {
  defaults: {
    //noscheduleMessage: "No schedule today", //reserved for next revision
    timeFormat: "hh:mm A",
    height: "800px",
    width: "150px",
    mode: "5days", // "today", "5days", "7days"
    refreshInterval: 1000*60,
    schedules: [ //array of schedules
      {
        title: "John's Timetable",
        schedule: [
          // [weekday, starttime(24h), endtime(24h), title, subtitle, backgroundColor(optional)]
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

    ]
  },

  getStyles: function() {
    return ["MMM-Timetable.css"]
  },

  getScripts: function() {
    return ["moment.js"]
  },

  getDom: function() {
    var schedule = this.config.schedules[this.index]

    var container = document.createElement("div")
    container.id = "TTABLE_CONTAINER"
    if (this.config.schedules.length > 1) {
      container.className = "multi"
    }

    var title = document.createElement("div")
    title.id = "TTABLE_TITLE"
    container.appendChild(title)


    var wrapper = document.createElement("div")
    wrapper.id = "TTABLE"

    var tlCol = document.createElement("div")
    var empty = document.createElement("div")
    empty.id = "TTABLE_TIME_HEADER"
    empty.className = "header"
    tlCol.appendChild(empty)

    var timeline = document.createElement("div")
    timeline.id = "TTABLE_TIMELINE"
    timeline.className = "column"
    timeline.style.height = this.config.height
    tlCol.appendChild(timeline)
    wrapper.appendChild(tlCol)
    for (i = 1; i <= 7; i++) {
      var dayCol = document.createElement("div")
      dayCol.id = "TTABLE_DAYCOLUMN_" + i
      var dayHeader = document.createElement("div")
      dayHeader.id = "TTABLE_DAY_HEADER_" + i
      dayHeader.className = "header"
      dayHeader.innerHTML = moment().isoWeekday(i).format("ddd")
      var day = document.createElement("div")
      day.id = "TTABLE_DAY_" + i
      day.className = "column day"
      day.style.width = this.config.width
      dayCol.appendChild(dayHeader)
      dayCol.appendChild(day)
      wrapper.appendChild(dayCol)
    }


    container.appendChild(wrapper)
    return container
  },

  start: function() {
    this.index = 0
    this.today = 0
  },

  notificationReceived: function(noti, payload, sender) {
    if (noti == "DOM_OBJECTS_CREATED") {
      this.draw()
    }
  },

  draw: function() {
    this.today = moment().isoWeekday()
    this.drawView(this.config.schedules[this.index])
    this.index++;
    var timer;
    if (this.index >= this.config.schedules.length) {
      this.index = 0
    }

    clearTimeout(timer)
    timer = null
    timer = setTimeout(()=>{
      this.draw()
    }, this.config.refreshInterval)
  },

  drawSchedule: function(schedule) {
    document.getElementById("TTABLE_TITLE").innerHTML = schedule.title
    var dayFilter = {
      "today" : [this.today],
      "5days" : [1,2,3,4,5],
      "7days" : [1,2,3,4,5,6,7]
    }
    var filter = dayFilter[this.config.mode]
    for(i=1; i<=7; i++) {
      var prev = document.getElementById("TTABLE_DAY_" + i)
      if (typeof prev !== "undefined") {
        prev.innerHTML = ""
      }
      var elm = document.getElementById("TTABLE_DAYCOLUMN_" + i)
      if (filter.includes(i)) {
        elm.className = "show"
      } else {
        elm.className = "hide"
      }
    }

    var tline = document.getElementById("TTABLE_TIMELINE")
    tline.innerHTML = ""

    var oHeight = document.getElementById("TTABLE_TIMELINE").offsetHeight
    var validItem = {}
    var tlItem = new Set()
    for(var i in schedule.schedule) {
      var item = schedule.schedule[i]
      if (this.config.mode == 'today') {
        if (item[0] == this.today || item[0] == 0) {
          if(typeof validItem[item[0]] == "undefined") {
            validItem[item[0]] = []
          }
          validItem[item[0]].push(item)
          tlItem.add(item[1]).add(item[2])
        }
      } else if (this.config.mode == '5days') {
        if (item[0] <= 5) {
          if(typeof validItem[item[0]] == "undefined") {
            validItem[item[0]] = []
          }
          validItem[item[0]].push(item)
          tlItem.add(item[1]).add(item[2])
        }
      } else {
        if(typeof validItem[item[0]] == "undefined") {
          validItem[item[0]] = []
        }
        validItem[item[0]].push(item)
        tlItem.add(item[1]).add(item[2])
      }
    }
    var tl = Array.from(tlItem).sort()
    var start = convertTime(tl.shift())
    var end = convertTime(tl.pop())
    var duration = end - start


    var now = convertTime(moment().format("HHmm"))
    if (start < now && now < end) {
      var elm = document.createElement("div")
      var pos = Math.floor((now - start) / duration * oHeight)
      elm.className = "now now_" + now
      elm.style.top = pos + "px"
      tline.appendChild(elm)
    }

    tl = Array.from(tlItem).sort()
    for(var j in tl) {
      var item = tl[j]
      var pos = Math.floor((convertTime(item) - start) / duration * oHeight)
      var elm = document.createElement("div")
      elm.id = "time_" + item
      elm.className = "time"
      elm.innerHTML = timeFormat(item, this.config.timeFormat)
      elm.style.top = pos + "px"
      tline.appendChild(elm)
    }


    for(var i in validItem) {
      var day = document.getElementById("TTABLE_DAY_" + i)
      day.className = "column"
      if (i == this.today) {
        day.className += " today"
      }
      day.innerHTML = ""
      var items = validItem[i]
      for (var j in items) {
        var item = items[j]
        var startTime = convertTime(item[1])
        var endTime = convertTime(item[2])
        var height = Math.floor((endTime - startTime) / duration * oHeight)
        var startPos = Math.floor((startTime - start) / duration * oHeight)
        var isNow = false
        if (this.today == i && startTime <= now && now <= endTime) {
          isNow = true
        }

        var elm = document.createElement("div")
        elm.className = "item"
        elm.className += (isNow) ? " isnow" : ""
        elm.style.top = startPos + "px"
        elm.style.height = height + "px"
        elm.style.width = this.config.width
        elm.id = "ITEM_" + item[0] + "_" + item[1] + "_" + item[2]
        if (typeof item[5] !== undefined) {
          elm.style.backgroundColor = item[5]
        }
        var title = document.createElement("p")
        title.className = "title"
        title.innerHTML = item[3]
        var subtitle = document.createElement("p")
        subtitle.className = "subtitle"
        subtitle.innerHTML = item[4]
        var period = document.createElement("p")
        period.className = "period"
        period.innerHTML = timeFormat(item[1], this.config.timeFormat) + " - " + timeFormat(item[2], this.config.timeFormat)
        elm.appendChild(title)
        elm.appendChild(period)
        elm.appendChild(subtitle)
        day.appendChild(elm)
      }
    }

  },

  drawView: function(schedule) {
    if (this.config.schedules.length > 1) {
      document.getElementById("TTABLE_CONTAINER").style.opacity = 0
      var timer = setTimeout(()=>{
        this.drawSchedule(schedule)
        document.getElementById("TTABLE_CONTAINER").style.opacity = 1
      }, 2000)
    } else {
      this.drawSchedule(schedule)
    }
  },
})