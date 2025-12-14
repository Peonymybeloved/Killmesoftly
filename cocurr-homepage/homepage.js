const taskTable = document.getElementById('task-table');
const plusBtn = document.querySelector('.plus-btn');

/* ---------------- POPUP FUNCTION ---------------- */
function showPopup(message, type = "green") {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");
  popupMessage.textContent = message;

  if (type === "green") popup.style.backgroundColor = "#4caf50";
  else if (type === "yellow") popup.style.backgroundColor = "#FFB800";
  else if (type === "red") popup.style.backgroundColor = "#E53935";

  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

/* ---------------- CREATE ROWS ---------------- */
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

  const addRow = taskTable.querySelector('.add-row');
  taskTable.insertBefore(row, addRow);

  row.querySelector('.task-bubble').focus();
  showPopup("Task added! Fill all fields to complete.", "yellow");
}

function createTaskRow(task, deadline, status, course) {
  if (!task || !deadline || !status || !course) {
    showPopup("Please fill all fields!", "red");
    return;
  }

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

  const addRow = taskTable.querySelector('.add-row');
  taskTable.insertBefore(row, addRow);
}

/* ---------------- LISTENERS ---------------- */
function addTaskRowListeners(row) {
  const check = row.querySelector('.check-task');
  const moreBtn = row.querySelector('.more-btn');
  const editBtn = row.querySelector('.edit-btn');
  const deleteBtn = row.querySelector('.delete-btn');
  const bubbles = row.querySelectorAll('.task-bubble, .deadline-bubble, .wip-bubble, .cscc-bubble');

  // Complete task
  check.addEventListener('click', () => {
    const taskValues = Array.from(bubbles).map(b => b.textContent.trim());
    if (taskValues.some(v => v === "")) {
      showPopup("Task not completed! Fill all fields first.", "red");
      return;
    }

    row.classList.toggle('checked');
    check.classList.toggle('checked');
    showPopup(row.classList.contains('checked') ? "Task completed!" : "Task marked incomplete!", "green");
  });

  // Show/hide edit/delete buttons
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
    showPopup("Task updated!", "yellow");
  });

  // Delete task
  deleteBtn.addEventListener('click', () => {
    row.remove();
    showPopup("Task deleted successfully!", "red");
  });
}

/* ---------------- PLUS BUTTON ---------------- */
if (plusBtn) {
  plusBtn.addEventListener('click', createEditableTaskRow);
}

/* ---------------- INITIALIZE ---------------- */
document.querySelectorAll('.task-row:not(.add-row)').forEach(addTaskRowListeners);

