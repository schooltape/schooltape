/*
For developers:
Please read the Contributing guidelines here --> https://github.com/schooltape/schooltape/blob/main/CONTRIBUTING.md
*/
var consoleStyle = "color: lightgreen; font-weight: bold;";
// console.log(`%c[subheader.js]`, consoleStyle, "Injected subheader.js!");


if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
    var timetableHeader = document.querySelectorAll("[data-timetable-header]");
    var timetableContainer = document.querySelectorAll("[data-timetable-container]");
    var timetable = document.getElementsByClassName("timetable")[0];
    // console.log(`%c[subheader.js]`, consoleStyle, "Timetable found, injecting subheader...");
    updateSubheader();
    setInterval(updateSubheader, 1000);
}

// Function with interval of one second to update the subheader
function updateSubheader() {
    var subHeader = document.querySelector("h2.subheader");
    let currentPeriod = getCurrentPeriod();

    var currentPeriodData = getPeriodData(currentPeriod);
    // console.log("currentPeriodData: ", currentPeriodData)
    
    if (currentPeriodData === null) { // Failed to retrieve any data
        subHeader.innerHTML = getDate().dateString + " <strong>|</strong> " + clock();
    } else if (currentPeriodData.missingData) { // Missing period info
        subHeader.innerHTML = currentPeriodData.topPeriodName + " <strong>|</strong> " + getDate().dateString + " <strong>|</strong> " + clock();
    } else {
        subHeader.innerHTML = `<a style='color: inherit;' href='${currentPeriodData.periodLink}' target='_blank'>${currentPeriodData.periodName} (${currentPeriodData.periodRoom})</a> <strong>|</strong> ${getDate().dateString} <strong>|</strong> ${clock()}`;
    }
}

function getCurrentPeriod() {
    let periodList = getListOfPeriods();
    for (let i = 0; i < periodList.length; i++) {
        if (periodList[i] !== null && periodList[i].topPeriodTime !== undefined) {
            let times = extractTimes(periodList[i].topPeriodTime);
            let currentTime = new Date().getTime();
            let startTimestamp = times[0].getTime();
            let endTimestamp = times[1].getTime();
            if (startTimestamp <= currentTime && currentTime <= endTimestamp) { // Found a current period
                return i;
            }
        }
    }
    return null;
}

function extractTimes(periodTime) {
    let times = periodTime.split("–");
    let startTime = times[0].split(":");
    let startHour = parseInt(startTime[0]);
    let startMinute = parseInt(startTime[1].substring(0, 2));
    let startIsAM = startTime[1].substr(2) === "am";
    let endTime = times[1].split(":");
    let endHour = parseInt(endTime[0]);
    let endMinute = parseInt(endTime[1].substring(0, 2));
    let endIsAM = endTime[1].substr(2) === "am";
    
    if (!startIsAM && startHour !== 12) {
        startHour += 12;
    }
    if (!endIsAM && endHour !== 12) {
        endHour += 12;
    }

    let startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);
    let endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    return [startDate, endDate];
}

function getListOfPeriods() {
    var periodList = [];
    for (var i = 0; i < 14; i++) {
        periodList.push(getPeriodData(i));
    }
    return periodList;
}
let periodList = getListOfPeriods();
// console.log("PERIOD LIST", periodList);


function getPeriodData(periodNum) {
    if (periodNum !== undefined) {
        let periodData = {};

        periodData.missingData = false;
        try {
            periodData.topPeriodTime = document.querySelector(`.timetable thead tr th:nth-child(${periodNum}) time`).textContent.trim()
            periodData.topPeriodName = document.querySelector(`.timetable thead tr th:nth-child(${periodNum})`).childNodes[0].textContent.trim(); // 
        } catch {
            return null;
        }

        try {
            let timetableRow = document.querySelector(".timetable tbody tr");
            let currentData = timetableRow.querySelector(`td:nth-child(${periodNum}) div:nth-child(1) div:nth-child(1)`);
            periodData.periodName = currentData.querySelector("a").textContent.trim();
            periodData.periodLink = currentData.querySelector("a").getAttribute("href").trim();
            periodData.periodID = currentData.querySelector("div:nth-child(2)").textContent.trim();
            periodData.periodRoom = currentData.querySelector("div:nth-child(3)").textContent.trim();
        } catch {
            periodData.missingData = true;
        }

        return { ...periodData };
    }
}

function clock() {
    var s = getDate().second;
    var m = getDate().minute;
    var h = getDate().hour;
    // If seconds is a single digit number add a zero before it
    if (s.toString().length === 1) {
        s = "0" + s;
    }
    // If minutes is a single digit number add a zero before it
    if (m.toString().length === 1) {
        m = "0" + m;
    }

    // Get meridian (AM/PM)
    var meridian = "AM";
    if (h > 12) {
        h = h - 12;
        meridian = "PM";
    }

    // return h + ":" + m + ":" + s;
    return h + ":" + m + " " + meridian;
}

function getDate() {
    var currentDate = new Date();
    var day = currentDate.getDay();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var date = currentDate.getDate();
    var hour = currentDate.getHours();
    var minute = currentDate.getMinutes();
    var second = currentDate.getSeconds();
    var dateString = currentDate.toDateString();
    return {
        day: day,
        month: month,
        year: year,
        date: date,
        hour: hour,
        minute: minute,
        second: second,
        dateString: dateString
    }
}