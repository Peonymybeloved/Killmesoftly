const taskTable = document.getElementById('task-table');
const plusBtn = document.querySelector('.plus-btn');

function createEditableTaskRow() {
  const row = document.createElement('div');
  row.className = 'task-row';

  row.innerHTML = `
    <div class="check-task"></div>
    <div class="task-bubble" contenteditable="true" placeholder="Task name"></div>
    <div class="deadline-bubble" contenteditable="true" placeholder="Deadline"></div>
    <div class="wip-bubble" contenteditable="true" placeholder="Status"></div>
    <div class="cscc-bubble" contenteditable="true" placeholder="Course"></div>
    <div class="dot-space">
      <button class="more-btn">...</button>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;

  addTaskRowListeners(row);
  // Insert before the plus button row
  const addRow = taskTable.querySelector('.add-row');
  taskTable.insertBefore(row, addRow);
  
  // Focus on task bubble
  row.querySelector('.task-bubble').focus();
}

function createTaskRow(task, deadline, status, course) {
  const row = document.createElement('div');
  row.className = 'task-row';

  row.innerHTML = `
    <div class="check-task"></div>
    <div class="task-bubble" contenteditable="false">${task}</div>
    <div class="deadline-bubble" contenteditable="false">${deadline}</div>
    <div class="wip-bubble" contenteditable="false">${status}</div>
    <div class="cscc-bubble" contenteditable="false">${course}</div>
    <div class="dot-space">
      <button class="more-btn">...</button>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;

  addTaskRowListeners(row);
  // Insert before the plus button row
  const addRow = taskTable.querySelector('.add-row');
  taskTable.insertBefore(row, addRow);
}

function addTaskRowListeners(row) {
  const check = row.querySelector('.check-task');
  const moreBtn = row.querySelector('.more-btn');
  const editBtn = row.querySelector('.edit-btn');
  const deleteBtn = row.querySelector('.delete-btn');
  const bubbles = row.querySelectorAll('.task-bubble, .deadline-bubble, .wip-bubble, .cscc-bubble');

  // Check/Uncheck with strike-through
  check.addEventListener('click', () => {
    row.classList.toggle('checked');
    check.classList.toggle('checked');
  });

  // Show/hide Edit/Delete horizontally
  moreBtn.addEventListener('click', () => {
    document.querySelectorAll('.task-row').forEach(r => {
      if (r !== row) r.classList.remove('show-actions');
    });
    row.classList.toggle('show-actions');
  });

  // Edit task
  editBtn.addEventListener('click', () => {
    bubbles.forEach(b => b.contentEditable = !b.isContentEditable);
    if (bubbles[0].isContentEditable) bubbles[0].focus();
  });

  // Delete task
  deleteBtn.addEventListener('click', () => row.remove());
}

// Add event listener to plus button
if (plusBtn) {
  plusBtn.addEventListener('click', createEditableTaskRow);
}

// Initialize existing rows
document.querySelectorAll('.task-row:not(.add-row)').forEach(addTaskRowListeners);







