// KANBAN TASK MANAGER
// DOM Manipulation

// In-memory state
let tasks = [];
let idCounter = 0;
let currentColumn = 'todo';

// DOM Reference
const modalOverlay = document.getElementById("modal-overlay");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const modalTitle = document.getElementById("modal-title");
const inputTitle = document.getElementById("input-title");
const inputDesc = document.getElementById("input-desc");
const inputPriority = document.getElementById("input-priority");
const inputDue = document.getElementById("input-due");
const taskCountBadge = document.getElementById("task-count");
const priorityFilter = document.getElementById("priority-filter");

/* returns a <li> containing: title, description, 
priority badge, due date, Edit button, Delete button */
function createTaskCard(taskObj) {

}

/* appends a new card to the right 
column and updates the task counter */
function addTask(columnId, taskObj) {

}

/* adds a CSS fade-out animation class, 
then removes the card after the animation ends */
function deleteTask(taskId) {

}

// opens the modal pre-filled with that task's existing data
function editTask(taskId) {

}

/* updates the task object in the tasks array 
and refreshes the matching card's DOM content */
function updateTask(taskId, updatedData) {

}