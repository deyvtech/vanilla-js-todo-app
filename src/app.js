"use strict";

const todoEl = document.querySelector("#list_container");
const val = localStorage.getItem("todo")
  ? JSON.parse(localStorage.getItem("todo"))
  : [];

const unitOfTime = {
  year: 31536000,
  month: 2592000,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};


function timeElapseCount(pastTime, UTM) {
  const curDate = new Date(Date.now());
  const interval = Math.floor((new Date(curDate) - new Date(pastTime)) / 1000);

  function displayAgo(seconds_per_unit, unit_of_time) {
    const time = Math.floor(interval / seconds_per_unit);
    return `${time} ${unit_of_time}${time > 1 ? "s" : ""} ago`;
  } 

  // interval
  if (interval <= UTM.minute) {
    const sec = Math.floor(interval / UTM.second);
    return `${sec >= 1 ? sec : ""} ${
      sec === 0 ? "Just now" : `second${sec > 1 ? "s" : ""} ago`
    }`;
  }
  // minute
  if (interval <= UTM.hour) {
    return displayAgo(UTM.minute, 'minute') 
  }
  // hour
  if (interval <= UTM.day) {
    return displayAgo(UTM.hour, 'hour') 
  }
  // day
  if (interval <= UTM.month) {
    return displayAgo(UTM.day, 'day')
  }

  // month
  if (interval <= UTM.year) {
    return displayAgo(UTM.month, 'month')
  }

  // year
  if (interval >= UTM.year) {
    return displayAgo(UTM.year, 'year')
  }
}

// HTML view
function setHTMLItem(item, date) {
  const html = `
      <li class="flex items-center">
        <p>${item}</p>
        <span class="text-sm bg-sky-200 p-1 rounded-md ml-[15px]">
       ${timeElapseCount(date, unitOfTime)}
        </span>
        <div class="w-2 h-2 rounded-full ${
          item.isCompleted ? "bg-green-500-500" : "bg-red-500"
        } ml-4">
        </div>
        </li>
      `;
  todoEl.insertAdjacentHTML("afterbegin", html);
}

// display onLoad all todo
function displayAllTodo() {
  val
    .map((item) => {
      setHTMLItem(item.task, item.id);
    })
    .join("");
}
displayAllTodo();

// Add todo
function addTodo() {
  const input = document.querySelector("input");
  const btn = document.querySelector("button");

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (input.value !== "") {
      val.push({
        task: input.value,
        isCompleted: false,
        id: Date.now(),
      });

      localStorage.setItem("todo", JSON.stringify(val));
      setHTMLItem(input.value, Date.now());
    }

    input.value = "";
  });
}
addTodo();


