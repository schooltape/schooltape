let x = document.querySelector('[data-timetable-container] div.scrollable')

setTimeout(updateScrollbar, 500);
setInterval(updateScrollbar, 10000);

function updateScrollbar() {
    let periodNum = getCurrentPeriod();
    if (periodNum !== undefined) {
        try {
            let timetableRow = document.querySelector(".timetable tbody tr");
            let currentData = timetableRow.querySelector(`td:nth-child(${periodNum})`);
            x.scroll({
                left: currentData.offsetLeft - 55, // 16 for perfect alignment
                behavior: 'smooth' // or 'auto' to scroll instantly
            });
            console.log("Scrolling "+currentData.offsetLeft);
        } catch {}
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