// KANBAN TASK MANAGER
// DOM Manipulation

// In-memory state
let tasks = [];
let idCounter = 0;
let currentColumn = 'todo';

// DOM Reference
const modalOverlay = document.getElementById('modal-overlay');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const modalTitle = document.getElementById('modal-title');
const inputTitle = document.getElementById('input-title');
const inputDesc = document.getElementById('input-desc');
const inputPriority = document.getElementById('input-priority');
const inputDue = document.getElementById('input-due');
const taskCountBadge = document.getElementById('task-count');
const priorityFilter = document.getElementById('priority-filter');

/* returns a <li> containing: title, description, 
priority badge, due date, Edit button, Delete button */
function createTaskCard(taskObj) {
	const li = document.createElement('li'); /* create brand new html element */
	li.classList.add('task-card'); /*add task-card class to li element*/

	/* set attribute (ex: data-id) to element li */
	li.setAttribute('data-id', taskObj.id); 
	li.setAttribute('data-priority', taskObj.priority);

	// TITLE
	const titleEl = document.createElement('span');
	titleEl.classList.add('task-title');
	titleEl.textContent = taskObj.title;
	//  Double-clicking a task title replaces it with an <input>
	titleEl.addEventListener('dblclick', () => startInlineEdit(li, titleE1, taskObj));

	// DESCRIPTION
	const descEl = document.createElement('p');
	descEl.classList.add('task-desc');
	descEl.textContent = taskObj.desc || ''; //empty string if no desc (optional)

	// META ROW (PRIORITY + DUE)
	const metaEl = document.createElement('div');
	metaEl.classList.add('task-meta');

	// PRIORITY BADGE
	const badgeE1 = document.createElement('span');
	badgeEl.classList.add('priority-badge', taskObj.priority);
	badgeEl.textContent = taskObj.priority;

	// DUE DATE
	const dueEl = document.createElement('span');
	dueEl.classList.add('task-due');
	dueEl.textContent = taskObj.due ? 'Due: ' + taskObj.due : '';

	// parent.appendChild(child) - insert child element (badgeEl) inside parent (metaEl)
	metaEl.appendChild(badgeEl);
	metaEl.appendChild(dueEl);

	// ACTION BUTTONS (EDIT/DELETE)
	const actionsEl = document.createElement('div');
	actionsEl.classList.add('task-actions');
	// EDIT
	const editBtn = document.createElement('button');
	editBtn.textContent = 'Edit';
	editBtn.setAttribute('data-action', 'edit');
	editBtn.setAttribute('data-id', taskObj.id);
	// DELETE
	const deleteBtn = document.createElement('button');
	deleteBtn.textContent = 'Delete';
	deleteBtn.setAttribute('data-action', 'delete');
	deleteBtn.setAttribute('data-id', taskObj.id);

	actionsEl.appendChild(editBtn);
	actionsEl.appendChild(deleteBtn);

	// assemble card
	li.appendChild(titleEl);
	li.appendChild(descEl);
	li.appendChild(metaEl);
	li.appendChild(actionsEl);

	return li;
}

/* appends a new card to the right 
column and updates the task counter */
function addTask(columnId, taskObj) {
	tasks.push(taskObj); //store task in in-memory array
	const card = createTaskCard(taskObj); //build card element

	const listEl = document.getElementById('list-' + columnId);
	listEl.appendChild(card);

	updateCounter();
}

/* adds a CSS fade-out animation class, 
then removes the card after the animation ends */
function deleteTask(taskId) {
	// querySelector - search matching element
	const card = document.querySelector('[data-id="' + taskId + '"]');
	if (!card) return;

	// fade out aniamtion
	card.classList.add('fade-out');

	setTimeout(() => {
		card.remove(); // remove card from array
		const idx = tasks.findIndex(t => t.id === taskId);
		if (idx !== -1) tasks.splice(idx, 1);
		updateCounter();
		applyFilter();
	}, 300); // transition duration, 300ms
}

// opens the modal pre-filled with that task's existing data
function editTask(taskId) {
	const task = tasks.find(t => t.id === taskId);
	if (!task) return;

	inputTitle.value = task.title;
	inputDesc.value = task.desc;
	inputPriority.value = task.priority;
	inputDue.value = task.due;

	modalTitle.textContent = 'Edit Task';

	btnSave.setAttribute('data-mode', 'edit');
	btnSave.setAttribue('data-id', taskId);

	openModal();
}

/* updates the task object in the tasks array 
and refreshes the matching card's DOM content */
function updateTask(taskId, updatedData) {
	const task = tasks.find(t => t.id === taskId);
	if(!task) return;
	Object.assign(task, updatedData);

	const card = document.querySelector('[data-id="' + taskId + '"]');
	if(!card) return;

	card.setAttribute('data-priority', task.priority);

	card.querySelector('.task-title').textContent = task.title;
	card.querySelector('.task-desc').textContent = task.desc || '';
	card.querySelector('.task-due').textContent = task.due ? 'Due: ' + task.due: '';

	const badge = card.querySelector('.priority-badge');
	badge.textContent = task.priority;
	badge.className = '';
	badge.classList.add('priority-badge', task.priority);
}

/* EVENT DELEGATION - Attach a single click listener to each column's <ul> that handles 
both Edit and Delete button clicks using data-action and data-id attributes */
function eventDelegation() {
	const lists = document.querySelectorAll('.task-list');

	lists.forEach(list => {
		list.addEventListener('click', (event) => {
			const action = event.target.getAttribute('data-action');
			const taskId = event.target.getAttribute('data-id');

			if (!action || !taskId) return;

			if (action === 'delete') {
				deleteTask(taskId);
			}

			else if (action === 'edit') {
				editTask(taskId);
			}
		});
	});
}

/* INLINE EDITING - Double-clicking a task title replaces it with 
an <input>. Pressing Enter or moving focus away commits the change. */
function startInlineEdit(card, titleEl, taskObj) {
	const input = document.createElement('input');
	input.classList.add('task-title-input');
	input.value = taskObj.title;

	card.replaceChild(input, titleEl);
	input.focus();
	input.select();

	function commitEdit() {
		const newTitle = input.value.trim() || taskObj.title;
		taskObj.title = newTitle;

		card.replaceChild(titleEl, input);
	}

	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			input.blur();
		}
	});

	input.addEventListener('blur', commitEdit);
}

/* PRIORITY FILTER - When a priority is chosen, hide non-matching cards 
using classList.toggle('is-hidden', condition) — not style.display */
function applyFilter() {
	const selected = priorityFilter.value;
	const allCards = document.querySelectorAll('.task-card');

	allCards.forEach(card => {
		const priority = card.getAttribute('data-priority');
		const shouldHide = selected !== 'all' && priority !== selected;
		card.classList.toggle('is-hidden', shouldHide);
	});
}

/* CLEAR DONE - A "Clear All" button removes every card from the Done 
column with a staggered fade-out (each card fades 100 ms after the previous) */
function clearDone() {
	const doneList = document.getElementById('list-done');
	const cards = Array.from(doneList.querySelectorAll('.task-card'));

	cards.forEach((card, index) => {
		setTimeout(() => {
			card.classList.add('fade-out');

			setTimeout(() => {
				const taskId = card.getAttribute('data-id');
				card.remove();
				const idx = tasks.findIndex(t => t.id === taskId);
				if(idx !== -1) tasks.splice(idx, 1);
				updateCounter();
			}, 300);
		}, index * 100);
	});
}

// MODAL HELPERS
function openModal() {
	modalOverlay.classList.add('is-visible');
	inputTitle.focus();
}

function closeModal() {
	modalOverlay.classList.remove('is-visible');
	resetModalForm();
}

function resetModalForm() {
	inputTitle.value = '';
	inputDesc.value = '';
	inputPriority.value = 'medium';
	inputDue.value = '';
	modalTitle.textContent = 'Add Task';
	btnSave.setAttribute('data-mode', 'add');
	btnSave.removeAttribute('data-id');
}

// COUNTER UPDATE
function updateCounter() {
	taskCountBadge.textContent = tasks.length + (tasks.length === 1 ? ' task ' : ' tasks');
}

// MAIN SETUP
function init() {
	// Add task button
	document.querySelectorAll(.'btn-add').forEach(btn => {
		btn.addEventListener('click', () => {
			currentColumn = btn.getAttribute('data-column');
			btnSave.setAttribute('data-mode', 'add');
			modalTitle.textContent = 'Add Task';
			openModal();
		});
	});

	// Save button
	btnSave.addEventListener('click', () => {
		if (!title) {
			inputTitle.focus();
			inputTitle.style.borderColor = '#e94560';
			return;
		}
		inputTitle.style.borderColor = '';

		const mode = btnSave.getAttribute('data-mode');
		const taskId = btnSave.getAttribute('data-id');

		if (mode === 'edit' && taskId) {
	      updateTask(taskId, {
	        title:    title,
	        desc:     inputDesc.value.trim(),
	        priority: inputPriority.value,
	        due:      inputDue.value
	      });
	    } else {
	      idCounter++;
	      const newTask = {
	        id:       'task-' + Date.now() + '-' + idCounter,
	        title:    title,
	        desc:     inputDesc.value.trim(),
	        priority: inputPriority.value,
	        due:      inputDue.value,
	        column:   currentColumn
      };
      addTask(currentColumn, newTask);
    }
    closeModal();
	});

	// Cancel button
	btnCancel.addEventListener('click', closeModal);

	modalOverlay.addEventListener('click', (e) => {
		if (e.target === modalOverlay) closeModal();
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeModal();
	});

	priorityFilter.addEventListener('change', applyFilter);
	document.getElementById('clea-done').addEventListener('click', clearDone);
	eventDelegation();

	// 	EXAMPLE DATA
	addTask('todo', {
	    id: 'task-demo-1', title: 'Design wireframes',
	    desc: 'Sketch the main screens', priority: 'high',
	    due: '2025-08-01', column: 'todo'
	  });
  	addTask('inprogress', {
		    id: 'task-demo-2', title: 'Write unit tests',
		    desc: '', priority: 'medium',
		    due: '2025-08-05', column: 'inprogress'
		  });
  	addTask('done', {
	    id: 'task-demo-3', title: 'Set up repository',
	    desc: 'GitHub, branching strategy', priority: 'low',
	    due: '', column: 'done'
	});
}

init();