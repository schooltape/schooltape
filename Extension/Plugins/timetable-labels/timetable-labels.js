const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
if (window.location.pathname === "/timetable" && document.getElementsByClassName("timetable")[0]) {
    for(let i = 2; i < 9; i++) { // 9-2 = 7 days, as Monday is [2]
        document.querySelector(`#content > div:nth-child(5) > div:nth-child(2) > div > table > thead > tr > th:nth-child(${i})`).innerHTML = days[i-2]
        // console.log(i)
    }
}   