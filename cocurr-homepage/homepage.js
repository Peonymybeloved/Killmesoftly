const taskTable = document.getElementById('task-table');
const plusBtn = document.querySelector('.plus-btn');

const STATUS_OPTIONS = [
  { value: 'WIP', label: 'WIP', cls: 'wip' },
  { value: 'Review', label: 'Review', cls: 'review' },
  { value: 'Revise', label: 'Revise', cls: 'revise' },
  { value: 'Ready', label: 'Ready', cls: 'ready' }
];
const routes = [
  '../cocurr-homepage/homepage.html',
  'dailytask.html',
  '../cocurr-coursefolder/course.html'
];

document.querySelectorAll('.sidebar-icon').forEach((icon, index) => {
  if (routes[index]) {
    icon.addEventListener('click', () => {
      window.location.href = routes[index];
    });
  }
});


function makeStatusSpan(status) {
  const span = document.createElement('div');
  span.className = 'status-span ' + (status ? status.toLowerCase() : 'wip');
  span.textContent = status || '';
  return span;
}

function makeStatusSelect(selected) {
  const sel = document.createElement('select');
  sel.className = 'status-select';
  STATUS_OPTIONS.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    if (opt.value === selected) o.selected = true;
    sel.appendChild(o);
  });
  return sel;
}

function createTaskRow(task = '', deadline = '', status = 'WIP', course = '') {
  const row = document.createElement('div');
  row.className = 'task-row';

  row.innerHTML = `
    <div class="check-task"></div>
    <div class="task-bubble" contenteditable="false">${task}</div>
    <div class="deadline-bubble" contenteditable="false">${deadline}</div>
    <div class="wip-bubble"></div>
    <div class="cscc-bubble" contenteditable="false">${course}</div>
    <div class="dot-space">
      <button class="more-btn">...</button>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;

  // insert status span
  const statusContainer = row.querySelector('.wip-bubble');
  statusContainer.appendChild(makeStatusSpan(status));

  addTaskRowListeners(row);
  const addRow = taskTable.querySelector('.add-row');
  taskTable.insertBefore(row, addRow);
  return row;
}

function createEditableTaskRow() {
  // Create a new blank row and immediately toggle edit mode so user can type
  const row = createTaskRow('', '', 'WIP', '');
  toggleRowEdit(row, true);
  // focus first editable field
  const taskBubble = row.querySelector('.task-bubble');
  if (taskBubble) taskBubble.focus();
}

function toggleRowEdit(row, enable) {
  const taskBubble = row.querySelector('.task-bubble');
  const deadlineBubble = row.querySelector('.deadline-bubble');
  const csccBubble = row.querySelector('.cscc-bubble');
  const statusContainer = row.querySelector('.wip-bubble');

  if (enable) {
    if (taskBubble) taskBubble.contentEditable = 'true';
    if (deadlineBubble) deadlineBubble.contentEditable = 'true';
    if (csccBubble) csccBubble.contentEditable = 'true';
    // replace status span with select
    const cur = statusContainer.querySelector('.status-span');
    const curVal = cur ? cur.textContent.trim() : 'WIP';
    const sel = makeStatusSelect(curVal);
    statusContainer.innerHTML = '';
    statusContainer.appendChild(sel);
    sel.focus();
  } else {
    if (taskBubble) taskBubble.contentEditable = 'false';
    if (deadlineBubble) deadlineBubble.contentEditable = 'false';
    if (csccBubble) csccBubble.contentEditable = 'false';
    const sel = statusContainer.querySelector('select');
    const val = sel ? sel.value : '';
    statusContainer.innerHTML = '';
    statusContainer.appendChild(makeStatusSpan(val));
  }
}

function addTaskRowListeners(row) {
  const check = row.querySelector('.check-task');
  const moreBtn = row.querySelector('.more-btn');
  const editBtn = row.querySelector('.edit-btn');
  const deleteBtn = row.querySelector('.delete-btn');

  // Check/Uncheck with strike-through
  if (check) {
    check.addEventListener('click', () => {
      row.classList.toggle('checked');
      check.classList.toggle('checked');
    });
  }

  // Show/hide Edit/Delete horizontally
  if (moreBtn) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.task-row').forEach(r => {
        if (r !== row) r.classList.remove('show-actions');
      });
      row.classList.toggle('show-actions');
    });
  }

  // Edit button toggles edit/save
  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isEditing = editBtn.textContent.trim().toLowerCase() === 'save';
      if (isEditing) {
        // save task to database
        const taskTitle = row.querySelector('.task-bubble').textContent.trim();
        const deadline = row.querySelector('.deadline-bubble').textContent.trim();
        const statusEl = row.querySelector('.wip-bubble');
        const status = statusEl.querySelector('select') ? statusEl.querySelector('select').value : statusEl.textContent.trim();
        const course = row.querySelector('.cscc-bubble').textContent.trim();
        
        // Persist to backend
        saveTaskToBackend(taskTitle, deadline, status, course);
        
        toggleRowEdit(row, false);
        editBtn.textContent = 'Edit';
      } else {
        // enter edit mode
        toggleRowEdit(row, true);
        editBtn.textContent = 'Save';
      }
    });
  }

  // Delete task
  if (deleteBtn) deleteBtn.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    row.remove(); 
  });
}

// Persist task to backend
function saveTaskToBackend(taskTitle, deadline, status, course) {
  const payload = {
    task: taskTitle,
    deadline: deadline,
    status: status,
    course: course
  };

  fetch('../cocurr-php/api_tasks.php?action=create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Task saved successfully');
    } else {
      console.error('Error saving task:', data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}

// Load tasks from backend on page load
function loadTasksFromBackend() {
  fetch('../cocurr-php/api_tasks.php?action=list')
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data && Array.isArray(data.data)) {
        data.data.forEach(taskData => {
          createTaskRow(taskData.task, taskData.deadline, taskData.status, taskData.course);
        });
      }
    })
    .catch(error => console.error('Error loading tasks:', error));
}

// Add event listener to plus button
if (plusBtn) {
  plusBtn.addEventListener('click', createEditableTaskRow);
}

// Initialize existing rows (convert static status spans if present)
document.querySelectorAll('.task-row:not(.add-row)').forEach(row => {
  // if row has a wip-bubble with inner text, wrap it into status-span
  const statusEl = row.querySelector('.wip-bubble');
  if (statusEl && statusEl.textContent.trim()) {
    const val = statusEl.textContent.trim();
    statusEl.innerHTML = '';
    statusEl.appendChild(makeStatusSpan(val));
  }
  addTaskRowListeners(row);
});

// Profile circle initial from localStorage `userEmail` first letter
(function populateProfileInitial(){
  const profile = document.getElementById('profileCircle');
  if (!profile) return;
  const email = localStorage.getItem('userEmail') || '';
  const initial = email ? email.trim().charAt(0).toUpperCase() : 'T';
  profile.textContent = initial;
})();

// Load tasks from backend on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromBackend();
});







