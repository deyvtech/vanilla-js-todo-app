"use strict";


const todoEl = document.querySelector("#list_container");
let val = localStorage.getItem("todo")
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
function setHTMLItem(task, id, isCompleted) {
  return `
      <li class="flex items-center py-4 pl-2 rounded-md bg-sky-300" data-id="${id}">
      <img src="${
        isCompleted ? "./img/check-green.png" : "./img/check.png"
      }" alt="" class="w-[20px] mr-2 cursor-pointer" id="checkmark"/>
        <p class="${isCompleted ? 'line-through' : ''}" id="content">${task}</p>
        <span class="text-xs bg-sky-200 px-2 rounded-md ml-[15px]">
       ${timeElapseCount(id, unitOfTime)}
        </span>
  
        <img src="./img/edit.png" alt="" class="w-[20px] ml-2 cursor-pointer" id="edit"/>
        <img src="./img/delete.png" alt="" class="w-[20px] ml-2 cursor-pointer" id="delete"/>
        <button type="button" class="ml-4 px-4 py-1 rounded-md text-sky-400  bg-black" id="update">Update</button>
        <div class="w-2 h-2 rounded-full ${
          isCompleted ? "bg-green-500" : "bg-red-500"
        } ml-4">
        </div>
        </li>
      `;
}

// display onLoad all todo
function displayAllTodo() {
  val
    .map((item) => {
      todoEl.insertAdjacentHTML("afterbegin", setHTMLItem(item.task, item.id, item.isCompleted));
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
      todoEl.insertAdjacentHTML("afterbegin", setHTMLItem(val.at(-1).task, val.at(-1).id, null));
    }

    input.value = "";
  });
}
addTodo();

function todoClick(e) {
  const btnCheck = e.target.closest('#checkmark');
  const btnDelete = e.target.closest('#delete')
  const btnEdit = e.target.closest('#edit')
  const btnUpdate = e.target.closest('#update')

  // mark as complete
  if (btnCheck) {
    const parentEl = btnCheck.parentElement
    const parentElId = parentEl.dataset.id
    
    const findTodo = val.find(todo => {
      return todo.id === +parentElId
    })
  

      findTodo.isCompleted = !findTodo.isCompleted
      localStorage.setItem('todo', JSON.stringify(val))
    
      if (findTodo.isCompleted) {
        btnCheck.src = './img/check-green.png'
        parentEl.lastElementChild.classList.replace('bg-red-500', 'bg-green-500')
        btnCheck.nextElementSibling.classList.add('line-through')
        
      } else {
        btnCheck.src = './img/check.png'
        parentEl.lastElementChild.classList.replace('bg-green-500', 'bg-red-500')
        btnCheck.nextElementSibling.classList.remove('line-through')
      
      }
    
  }

  // delete todo
  if (btnDelete) {
    const parentEl = btnDelete.parentElement
    const parentElId = parentEl.dataset.id
 

    const curVal = JSON.parse(localStorage.getItem("todo"))
    const newVal = curVal.filter(item => item.id !== +parentElId)
   

    localStorage.setItem('todo', JSON.stringify(newVal))
    val = newVal


    const arEl = newVal.reverse().map(item => {

      const html = `
      <li class="flex items-center py-4 pl-2 rounded-md bg-sky-300" data-id="${item.id}">
      <img src="${
        item.isCompleted ? "./img/check-green.png" : "./img/check.png"
      }" alt="" class="w-[20px] mr-2 cursor-pointer" id="checkmark"/>
        <p class="${item.isCompleted ? 'line-through' : ''}" id="content">${item.task}</p>
        <span class="text-xs bg-sky-200 px-1 rounded-md ml-[15px]">
       ${timeElapseCount(item.id, unitOfTime)}
        </span>
  
        <img src="./img/edit.png" alt="" class="w-[20px] ml-2 cursor-pointer" id="edit"/>
        <img src="./img/delete.png" alt="" class="w-[20px] ml-2 cursor-pointer" id="delete"/>
        <button type="button" class="ml-4 px-4 py-1 rounded-md text-sky-400 bg-black" id="update">Update</button>
        <div class="w-2 h-2 rounded-full ${
          item.isCompleted ? "bg-green-500" : "bg-red-500"
        } ml-4">
        </div>
        </li>  
      `;

      return html
    }).join('')
    todoEl.innerHTML = arEl

  }

  // edit todo
  if (btnEdit) {
    const parentEl = btnEdit.parentElement
    const contentEl = parentEl.children.content
    

    contentEl.setAttribute('contentEditable', true)
    contentEl.focus()
  }

  if (btnUpdate) {
    const parentEl = btnUpdate.parentElement
    const parentElId = parentEl.dataset.id
    const contentEl = parentEl.children.content

    const findTodo = val.find(todo => {
      return todo.id === +parentElId
    })


      findTodo.task = contentEl.textContent
    localStorage.setItem('todo', JSON.stringify(val))
    
      contentEl.setAttribute('contentEditable', false)
    
  }



}
todoEl.addEventListener('click', todoClick)
