/*
For developers:
Please read the Contributing guidelines here --> https://github.com/schooltape/schooltape/blob/main/CONTRIBUTING.md
*/
var consoleStyle = "color: lightgreen; font-weight: bold;";
console.log(`%c[subheader.js]`, consoleStyle, "Injected subheader.js!");


if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
    var timetableHeader = document.querySelectorAll("[data-timetable-header]");
    var timetableContainer = document.querySelectorAll("[data-timetable-container]");
    var timetable = document.getElementsByClassName("timetable")[0];
    console.log(`%c[subheader.js]`, consoleStyle, "Timetable found, injecting subheader...");
    updateSubheader();
    setInterval(updateSubheader, 1000);
}

// Get child node without junk nodes, with optional node name
function getChildNode(node, childNum, nodeName = null) {
    var childCounter = 0;
    for (var i = 0; i < node.childNodes.length; i++) {
        // If node type is an element node
        if (node.childNodes[i].nodeType === 1) {
            if (nodeName) {
                if (node.childNodes[i].nodeName === nodeName) {
                    childCounter++;
                }
            } else {
                childCounter++;
            }
            if (childCounter === childNum) {
                return node.childNodes[i];
            }
        }
    }
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

function getCurrentPeriod() {
    switch (true) {
        case (getDate().hour < 8):
            switch (true) {
                case (getDate().minute < 30):
                    return "No school";
                case (getDate().minute >= 30 && getDate().minute < 45):
                    return {
                        period: "Pastoral",
                        periodNum: 2
                    }
                case (getDate().minute >= 45):
                    return {
                        period: "Period 1",
                        periodNum: 3
                    }
            }
        case (getDate().hour === 9):
            switch (true) {
                case (getDate().minute < 25):
                    return {
                        period: "Period 1",
                        periodNum: 3
                    }
                case (getDate().minute >= 25):
                    return {
                        period: "Period 2",
                        periodNum: 4
                    }
            }
        case (getDate().hour === 10):
            switch (true) {
                case (getDate().minute < 5):
                    return {
                        period: "Period 2",
                        periodNum: 4
                    }
                case (getDate().minute >= 5 && getDate().minute < 45):
                    return {
                        period: "Period 3",
                        periodNum: 5
                    }
                case (getDate().minute >= 45):
                    return {
                        period: "Recess",
                        periodNum: 6
                    }
            }
        case (getDate().hour === 11):
            switch (true) {
                case (getDate().minute < 10):
                    return {
                        period: "Recess",
                        periodNum: 6
                    }
                case (getDate().minute >= 10 && getDate().minute < 51):
                    return {
                        period: "Period 4",
                        periodNum: 7
                    }
                case (getDate().minute >= 51):
                    return {
                        period: "Period 5",
                        periodNum: 8
                    }
            }
        case (getDate().hour === 12):
            switch (true) {
                case (getDate().minute < 30):
                    return {
                        period: "Period 5",
                        periodNum: 8
                    }
                case (getDate().minute >= 30):
                    return {
                        period: "Lunch",
                        periodNum: 9
                    }
            }
        case (getDate().hour === 13):
            switch (true) {
                case (getDate().minute < 25):
                    return {
                        period: "Lunch",
                        periodNum: 9
                    }
                case (getDate().minute >= 25):
                    return {
                        period: "Period 6",
                        periodNum: 11
                    }
            }
        case (getDate().hour === 14):
            switch (true) {
                case (getDate().minute < 5):
                    return {
                        period: "Period 6",
                        periodNum: 11
                    }
                case (getDate().minute >= 5 && getDate().minute < 45):
                    return {
                        period: "Period 7",
                        periodNum: 12
                    }
                case (getDate().minute >= 45):
                    return {
                        period: "Period 8",
                        periodNum: 13
                    }
            }
        case (getDate().hour === 15):
            switch (true) {
                case (getDate().minute < 24):
                    return {
                        period: "Period 8",
                        periodNum: 13
                    }
                case (getDate().minute >= 24):
                    return "No school";
            }
        default:
            return "No school";
            
    }
}

function getCurrentPeriodData(periodNum) {
    if (periodNum !== undefined) {
        try {
            var timetableRow = document.querySelector(".timetable > tr");
            var currentData = getChildNode(getChildNode(getChildNode(timetableRow, periodNum, "TD"), 1, "DIV"), 1, "DIV");
            var periodName = getChildNode(currentData, 1, "A").textContent.trim();
            var periodLink = getChildNode(currentData, 1, "A").getAttribute("href").trim();
            var periodID = getChildNode(currentData, 1, "DIV").textContent.trim();
            var periodRoom = getChildNode(currentData, 2, "DIV").textContent.trim();
            return {
                periodName: periodName,
                periodLink: periodLink,
                periodID: periodID,
                periodRoom: periodRoom
            }
        }
        catch {
            return null;
        }
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

// Function with interval of one second to update the subheader
function updateSubheader() {
    // console.log("[subheader.js] Subheader toggle is enabled");
    var subHeader = document.querySelector("h2.subheader");
    var currentPeriod = getCurrentPeriod();
    // console.log("[subheader.js] Current period number: "+currentPeriod.periodNum)
    var currentPeriodData = getCurrentPeriodData(currentPeriod.periodNum);
    
    if (currentPeriod === "No school") {
        // subHeader.innerHTML = "Currently: <strong>"+currentPeriod+"</strong> | Date: <strong>"+getDate().dateString+"</strong> | Time: <strong>"+clock()+"</strong>";
        subHeader.innerHTML = currentPeriod + " <strong>|</strong> " + getDate().dateString + " <strong>|</strong> " + clock();
    }
    else {
        if (currentPeriodData === null) {
            // subHeader.innerHTML = "Currently: <strong>"+currentPeriod.period+"</strong> | Date: <strong>"+getDate().dateString+"</strong> | Time: <strong>"+clock()+"</strong>";
            subHeader.innerHTML = currentPeriod.period + " <strong>|</strong> " + getDate().dateString + " <strong>|</strong> " + clock();
        }
        else {
            // subHeader.innerHTML = "Currently: <strong>"+currentPeriod.period+"</strong> | Date: <strong>"+getDate().dateString+"</strong> | Time: <strong>"+clock()+"</strong>";
            subHeader.innerHTML = "Currently: <strong>"+currentPeriodData.periodName+" ("+currentPeriodData.periodRoom+")</strong> | Date: <strong>"+getDate().dateString+"</strong> | Time: <strong>"+clock()+"</strong>";
        }
    }
}
