const checkedItemClass = "checked-item"
const tasksStorageKey = "tasks"

let nextTaskId = 1;
let deleteTaskIdRegex = new RegExp("delete_task_(\\d+)");
let taskIdRegex = new RegExp("task_(\\d+)")

let taskList = JSON.parse(localStorage.getItem(tasksStorageKey)) || []

function loadTasks() {
    taskList.forEach((task) => {
        task.id = addNewTask(task.text, task.isChecked)
    })
    updateTasksStorage()
}

function updateTasksStorage() {
    localStorage.setItem(tasksStorageKey, JSON.stringify(taskList))
}

function deleteTask(id) {
    const deleteIndex = taskList.findIndex((task) => task.id == id)
    if (deleteIndex >= 0) {
        taskList.splice(deleteIndex, 1)
        updateTasksStorage()
    }
}

function storeTask(id, isChecked, text) {
    let existTask = taskList.find((task) => {
        if (task.id == id) return task
    })

    if (existTask) {
        existTask.isChecked = isChecked;
    } else {
        taskList.push({
            id: id,
            isChecked: isChecked,
            text: text
        })
    }
    updateTasksStorage();
}

function onDeleteElement(ev) {
    // Get button element
    let deleteButton = ev.target;
    while (deleteButton.tagName !== "BUTTON") {
        deleteButton = deleteButton.parentNode;
    }
    if (deleteButton.tagName !== "BUTTON") return;

    // Delete task
    let deleteBtnId = deleteButton.getAttribute("id");
    let id = deleteTaskIdRegex.exec(deleteBtnId)[1];
    if (!id) return;
    let taskToDelete = findTaskById(id);
    if (!taskToDelete) return;
    taskToDelete.remove()
    deleteTask(id)
}

function onCheckboxChanged(ev) {
    let target = ev.target;
    if (target.tagName !== "INPUT" && target.getAttribute("type").toLowerCase() !== "checkbox") {
        return
    }

    let taskLiElement = target.parentNode;
    let taskSpanElement = taskLiElement.querySelector("span.task");
    if (!taskSpanElement) return;

    let checked = target.checked;
    if (checked) {
        taskSpanElement.classList.toggle(checkedItemClass)
    } else {
        taskSpanElement.classList.remove(checkedItemClass)
    }

    let taskId = taskIdRegex.exec(taskLiElement.id)[1];
    if (taskId) {
        storeTask(taskId, checked);
    }
}

function onAddTask() {
    let taskInputField = document.getElementById("input-task");
    let taskText = taskInputField.value;
    if (!taskText) return
    taskInputField.value = "";
    let taskId = addNewTask(taskText, false);
    storeTask(taskId, false, taskText)
}

function findTaskById(id) {
    return document.getElementById("task_" + id);
}

function getNextTaskId() {
    return nextTaskId++;
}

function createDeleteButton(id) {
    let element = document.createElement("button");
    element.classList.add("delete-btn");
    element.id = `delete_task_${id}`;
    element.innerHTML = '<i class="fa-solid fa-circle-xmark close-icon"></i>';
    element.addEventListener("click", onDeleteElement);
    return element;
}

function createItemCheckbox(isChecked) {
    let element = document.createElement("input");
    element.classList.add("item-checkbox")
    element.setAttribute("type", "checkbox")
    element.checked = isChecked
    element.addEventListener("change", onCheckboxChanged)
    return element
}

function createItemCaptionElement(text, isComplete) {
    let element = document.createElement("span");
    element.classList.add("task")
    if (isComplete) {
        element.classList.add("checked-item")
    }
    element.innerHTML = text
    return element
}

function addNewTask(text, isComplete) {
    let taskId = getNextTaskId();
    let element = createTaskElement(taskId, text, isComplete);
    document.getElementById("task-list").append(element);
    return taskId;
}

function createTaskElement(taskId, text, isComplete) {
    let element = document.createElement("li");
    element.setAttribute("id", "task_" + taskId)
    element.append(createItemCheckbox(isComplete))
    element.append(createItemCaptionElement(text, isComplete))
    element.append(createDeleteButton(taskId))
    return element;
}

loadTasks()

document.getElementById("add-task-button").addEventListener("click", onAddTask)

let deleteButtons = document.getElementsByClassName("delete-btn");
for (let button of deleteButtons) {
    button.addEventListener("click", onDeleteElement);
}

for (let itemCheckBox of document.getElementsByClassName("item-checkbox")) {
    itemCheckBox.addEventListener("change", onCheckboxChanged)
}

