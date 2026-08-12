const darkbtn = document.querySelector("#dark-mode")
const body = document.body
let clearAll = document.querySelector("#clear-all")

const total = document.querySelector("#total")
const pending = document.querySelector("#pending")
const completed = document.querySelector("#completed")
let pendingCount;
let completeCount;

let form = document.querySelector("form")
darkbtn.addEventListener("click", () => {
   if ( body.classList.toggle("dark")) {
    darkbtn.textContent = "Light🌞"
    body.dataset.theme = "dark"
   } else {
    darkbtn.textContent = "Dark🌛"
    body.dataset.theme = "light"
   }
})

let updateIdx = null;
let tasks = document.querySelector(".tasks")

let clearAllBtn = document.querySelector("#clear-all")

let heading = document.createElement("h1")
heading.classList.add("h1")
heading.textContent = "Your Tasks"
clearAllBtn.before(heading)
let tasksArr = [
    {
        taskTitle: "Learn DOM",
        taskCategory: "Development",
        taskStatus: "pending"
    },
    {
        taskTitle: "Complete DSA Practice",
        taskCategory: "Study",
        taskStatus: "pending"
    },
    {
        taskTitle: "Go to Gym",
        taskCategory: "Health",
        taskStatus: "pending"
    },
    {
        taskTitle: "Build Todo Project",
        taskCategory: "Development",
        taskStatus: "pending"
    },
    {
        taskTitle: "Read a Book",
        taskCategory: "Personal",
        taskStatus: "pending"
    }
];
function storeTasks(){
localStorage.setItem("tasks",JSON.stringify(tasksArr))
}


let tasksArrDummy = JSON.parse(localStorage.getItem("tasks"))
if(tasksArrDummy !== null){
    tasksArr = tasksArrDummy
}
else{
    storeTasks()
}



form.addEventListener("submit", (event) => {
        let input = document.querySelector("input")

    console.log(` input.value => ${input.value}`)
    console.log(`Get attribute value => ${input.getAttribute("value")}`)

    // input.value gives me the current value entered by user in input 
    //  input.getAttribute("value") gives me the value of attribute written already in html both are not even closely related 
    event.preventDefault();

    if(input.value.trim() === "") return;
    let obj = {
        taskTitle : event.target[0].value,
        taskCategory : event.target[1].value,
        taskStatus : "pending"
    }

    if(updateIdx !== null){
        tasksArr[updateIdx] = obj
        form[2].textContent = "+ Add Task"
        updateIdx = null;
    }
    else{
        tasksArr.push(obj)
    }
    storeTasks()
    renderTasks()
    form.reset()
})
renderTasks()
function doneBtn(idx){
    let tasksAll = tasks.querySelectorAll(".task-card")
    let taskCard = tasksAll[idx]
    let done = taskCard.querySelector(".complete-btn")

    if(tasksArr[idx].taskStatus === "pending"){
        done.textContent = "Done"
    }
    else {
        done.textContent = "Pending"
    }
}
function edit(idx){
    form[0].value = tasksArr[idx].taskTitle
    form[2].textContent = "Update"
    updateIdx = idx
}
function done(idx){ 
    let tasksAll = tasks.querySelectorAll(".task-card")
    let taskCard = tasksAll[idx]

    let status = taskCard.getAttribute("data-status")

    if (status === "pending") {
    taskCard.setAttribute("data-status", "Completed")
    taskCard.classList.add("done")
    tasksArr[idx].taskStatus = "Completed"
    storeTasks()
    doneBtn(idx)
    updateCompleted()
    updatePending()
    } else {
    taskCard.classList.remove("done")
    taskCard.setAttribute("data-status", "pending")
    tasksArr[idx].taskStatus = "pending"
    storeTasks()
    doneBtn(idx)
    updatePending()
    updateCompleted()
    } 
}
tasks.addEventListener("click", (event) => {
    const taskCard = event.target.closest(".task-card");

    const id = taskCard.dataset.id - 1;

    if(event.target.classList.contains("delete-btn")){
        del(id)
    }
    if(event.target.classList.contains("edit-btn")){
        edit(id)
    }
    if(event.target.classList.contains("complete-btn")){
        done(id)
    }
})


function del(idx){
    tasksArr.splice(idx,1)
    storeTasks()
    renderTasks()
    updateTotal()
    updatePending()
    updateCompleted()
}
function clearTasks(){
   tasksArr.splice(0,tasksArr.length)
    storeTasks()
   renderTasks()
   updateTotal()
   updatePending()
   updateCompleted()
}
function updateTotal(){
    total.textContent = tasksArr.length
}

function updatePending(){
    pendingCount = 0;
    for(let i = 0; i< tasksArr.length;i++){
        if(tasksArr[i].taskStatus === "pending"){
            pendingCount++;
        }
    }
    pending.textContent = pendingCount;
}
function updateCompleted(){
        completeCount = 0;
    for(let i = 0; i< tasksArr.length;i++){
        if(tasksArr[i].taskStatus === "Completed"){
            completeCount++;
        }
    }
    completed.textContent = completeCount;
}
function renderTasks(){
    tasks.innerHTML = ""
    tasksArr.forEach((elem,idx) => {
        let taskCard = document.createElement("div")
        taskCard.classList.add("task-card")
        taskCard.innerHTML = `
    <div class="task-info ">
        <h3 class="task-h3"></h3>
        <span class="task-category"></span>
    </div>

    <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="complete-btn">Done</button>
        <button class="delete-btn">Delete</button>
    </div>`
    if (elem.taskStatus === "Completed") {
            taskCard.classList.add("done")
        }

    let h3 = taskCard.querySelector(".task-h3")
    let c = taskCard.querySelector(".task-category")
    let heading = document.createTextNode(elem.taskTitle)
    let category = document.createTextNode(elem.taskCategory)

    h3.append(heading)
    c.append(category)

    taskCard.setAttribute("data-id",idx + 1)
    taskCard.setAttribute("data-status",elem.taskStatus)
    taskCard.setAttribute("data-category",elem.taskCategory)
    tasks.append(taskCard)
    doneBtn(idx)
    })
    updateTotal()
    updatePending()
    updateCompleted()
}

let grandparent = document.querySelector(".grandparent")
let parent = document.querySelector(".parent")
let child = document.querySelector(".child")
 
let arrows = document.querySelectorAll(".arrow")
const spans = document.querySelectorAll(".capturing span, .bubbling span");

// Explanation

// Event Propagation - ham jab kisi event ko trigger krte hai jaise ke button press to browser ek journey ke through us target tak pahuchta hai vo dom tree ko traverse krta hai from top to down like from window to boody to main and then target isko hi event propagation kehte hai. ye teen phase me complete hoti hai 
// phase 1 -  Capturing - is phase me event top se leke apne target tk travel krta hai raste me jo bhi event lga ho wo trigger ho jata hai by default capturing ki value false par set hoti hai 
// phase 2 - target phase - is phase me event apne target ke paas pahuch jata hai aur usko trigger krta hai complete krta hai aur fir vapis down to top jata hai next phase me
//  phase 2 - Bubbling - is phase me event vapis down to top jata hai ye default behaviour hota hai agr ham grandparent parent aur child div teeno par event lga dege to pehle vo apne target tak jayega aur fr bubbling ke dauran baaki sab events execute honge ye by default nature hai


// Bubbling
child.addEventListener("click",()=> {
    spans[3].innerHTML = `Child <i class="ri-arrow-down-line arrow"></i>`
    console.log("Child Event inside Bubbling");
})
parent.addEventListener("click",()=> {
    spans[4].textContent = "Parent"
    console.log("Parent Event inside Bubbling");
})
grandparent.addEventListener("click",()=> {

    spans[5].textContent = "Grandparent"
    console.log("Grandparent Event inside Bubbling");
})

// Capturing
grandparent.addEventListener("click",()=> {
    spans[0].textContent = "Grandparent"
    console.log("Grandparent Event inside capturing");
},true)
parent.addEventListener("click",()=> {
    spans[1].textContent = "Parent"
    console.log("parent Event inside capturing");
},true)
child.addEventListener("click",()=> {
    spans[2].textContent = "Child"
    console.log("Child Event inside capturing");
},true)



