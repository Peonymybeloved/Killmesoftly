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

  const wipBubble = row.querySelector('.wip-bubble');
  wipBubble.className = 'wip-bubble ' + status.toLowerCase();
  wipBubble.appendChild(makeStatusSpan(status));
  const addRow = taskTable.querySelector('.add-row');
  taskTable.insertBefore(row, addRow);

  row.querySelector('.task-bubble').focus();
  showPopup("Task added! Fill all fields to complete.", "yellow");
}

// ====================== EDIT MODE ======================
function toggleRowEdit(row, enable) {
  const task = row.querySelector('.task-bubble');
  const deadline = row.querySelector('.deadline-bubble');
  const course = row.querySelector('.cscc-bubble');
  const statusBox = row.querySelector('.wip-bubble');

  task.contentEditable = enable;
  course.contentEditable = enable;

  if (enable) {
    // Convert deadline to datetime input
    const deadlineValue = deadline.textContent.trim();
    deadline.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'datetime-local';
    input.className = 'deadline-input';
    input.value = deadlineValue;
    deadline.appendChild(input);
    input.focus();

    // Status: convert to select
    const cur = statusBox.textContent.trim();
    statusBox.innerHTML = '';
    const select = makeStatusSelect(cur);
    statusBox.appendChild(select);

    // Apply initial color class to statusBox based on current status
    statusBox.className = 'wip-bubble ' + cur.toLowerCase();

    // Add change listener to update bubble color in real-time
    select.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      statusBox.className = 'wip-bubble ' + selectedValue.toLowerCase();
    });
  } else {
    // Revert deadline to text display
    const input = deadline.querySelector('input[type="datetime-local"]');
    const value = input ? input.value : '';
    deadline.innerHTML = '';
    deadline.textContent = value;

    // Status: convert select back to span
    const sel = statusBox.querySelector('select');
    const selectedStatus = sel.value;
    statusBox.innerHTML = '';
    statusBox.className = 'wip-bubble ' + selectedStatus.toLowerCase();
    statusBox.appendChild(makeStatusSpan(selectedStatus));
  }

// ====================== FIRESTORE SAVE ======================
async function saveTask(row) {
  if (!currentUser) return;

  const deadlineInput = row.querySelector('.deadline-bubble input[type="datetime-local"]');
  const deadlineValue = deadlineInput ? deadlineInput.value : row.querySelector('.deadline-bubble').textContent.trim();

  const data = {
    task: row.querySelector('.task-bubble').textContent.trim(),
    deadline: deadlineValue,
    status: row.querySelector('.wip-bubble select')
      ? row.querySelector('.wip-bubble select').value
      : row.querySelector('.wip-bubble').textContent.trim(),
    course: row.querySelector('.cscc-bubble').textContent.trim(),
    createdAt: new Date()
  };

  if (row.dataset.taskId) {
    await updateDoc(
      doc(db, "users", currentUser.uid, "tasks", row.dataset.taskId),
      data
    );
  } else {
    const ref = await addDoc(
      collection(db, "users", currentUser.uid, "tasks"),
      data
    );
    row.dataset.taskId = ref.id;
  }
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

