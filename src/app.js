"use strict";

const todoEl = document.querySelector("#list_container");
let val = localStorage.getItem("todo")
  ? JSON.parse(localStorage.getItem("todo"))
  : [];


// HTML view
function setHTMLItem(item, date) {
  const options = {
    hour: "numeric",
    minute: "2-digit",
  };
  const html = `
      <li class="flex item-center">
        <input type="checkbox" class="mx-2"/>
        <p>${item} 
            <span class="text-sm bg-sky-200 p-1 rounded-md">
            ${new Intl.DateTimeFormat("en-US", options).format(
    new Date(date)
  )}
            </span>
        </p>
        </li>
      `;
    todoEl.insertAdjacentHTML("afterbegin", html);
}

// display onLoad all todo
function displayAllTodo() {
  val.map(item => {
    setHTMLItem(item.task, item.id)
  }).join('')

}
displayAllTodo();


// Add todo
function addTodo() {
  const input = document.querySelector("input");
  const btn = document.querySelector("button");

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (input.value !== "") {
      val.unshift({
        task: input.value,
        isCompleted: false,
        id: Date.now(),
      });

      localStorage.setItem("todo", JSON.stringify(val));
      setHTMLItem(input.value, Date.now())
    }

    input.value = "";
    console.log(val);
  });
}
addTodo();


const timestamp = 1666632563517;
const past = new Date(timestamp);


