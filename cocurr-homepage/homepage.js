const taskTable = document.getElementById('task-table');
const addBtn = document.getElementById('add-task-btn');

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
  taskTable.appendChild(row);
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

// Initialize existing rows
document.querySelectorAll('.task-row').forEach(addTaskRowListeners);

// Toggle checked state and strike-through
check.addEventListener('click', () => {
  check.classList.toggle('checked');
  row.classList.toggle('checked'); // applies strike-through to bubbles
});


// Add new task
addBtn.addEventListener('click', () => {
  const task = document.getElementById('new-task-input').value.trim();
  const deadline = document.getElementById('new-deadline-input').value.trim();
  const status = document.getElementById('new-status-input').value.trim();
  const course = document.getElementById('new-course-input').value.trim();
  if (!task) return;
  createTaskRow(task, deadline, status, course);
  document.getElementById('new-task-input').value = '';
  document.getElementById('new-deadline-input').value = '';
  document.getElementById('new-status-input').value = '';
  document.getElementById('new-course-input').value = '';
});







