export default defineWxtPlugin(() => {
  defineStPlugin("subheader", () => {
    let style = document.createElement("style");
    style.classList = "schooltape";
    style.innerHTML = `
      .subheader span:not(:last-child):not(.period:empty)::after {
        content: " | ";
        font-weight: bold;
      }
      .subheader a {
        color: inherit;
      }
    `;
    document.head.appendChild(style);

    if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
      createSubheader();
      setInterval(updatePeriodSpan, 5000);
      setInterval(updateClockSpan, 1000);
      setInterval(updateDateSpan, 60000);
    }

    function createSubheader() {
      const subheader = document.querySelector("h2.subheader");
      // TODO: Refactor to support hot reload/uninjection
      // delete all children of the subheader
      while (subheader.firstChild) {
        subheader.removeChild(subheader.firstChild);
      }
      const span = document.createElement("span");
      span.classList = "schooltape";
      subheader.appendChild(span);

      updatePeriodSpan();
      updateClockSpan();
      updateDateSpan();
    }

    function updatePeriodSpan() {
      let periodSpan = document.querySelector(".subheader .period");
      if (!periodSpan) {
        const subheader = document.querySelector(".subheader .schooltape");
        periodSpan = document.createElement("span");
        periodSpan.classList.add("period");
        subheader.appendChild(periodSpan);
      }
      periodSpan.textContent = "";

      let period = getCurrentPeriod();
      if (period) {
        const name = period.data.name || period.header.name;
        const room = period.data.room ? ` (${period.data.room})` : "";
        let periodLink = periodSpan.querySelector("a");
        if (period.data.name && period.data.link) {
          // if there's period data
          if (!periodLink) {
            periodLink = document.createElement("a");
            periodLink.target = "_blank";
            periodSpan.appendChild(periodLink);
          }
          periodLink.href = period.data.link;
          periodLink.textContent = `${name}${room}`;
        } else {
          // if there's only the header
          periodSpan.textContent = `${name}${room}`;
          if (periodLink) {
            periodSpan.removeChild(periodLink);
          }
        }
      }
    }

    function updateClockSpan() {
      let clockSpan = document.querySelector(".subheader .clock");
      if (!clockSpan) {
        const subheader = document.querySelector(".subheader .schooltape");
        clockSpan = document.createElement("span");
        clockSpan.classList.add("clock");
        subheader.appendChild(clockSpan);
      }
      let date = new Date();
      clockSpan.textContent = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    function updateDateSpan() {
      let dateSpan = document.querySelector(".subheader .date");
      if (!dateSpan) {
        const subheader = document.querySelector(".subheader .schooltape");
        dateSpan = document.createElement("span");
        dateSpan.classList.add("date");
        subheader.appendChild(dateSpan);
      }
      let date = new Date();
      dateSpan.textContent = date.toDateString();
    }
  });
});
