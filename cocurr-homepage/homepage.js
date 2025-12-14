// ====================== DOM ======================
const taskTable = document.getElementById('task-table');
const plusBtn = document.querySelector('.plus-btn');

// ====================== FIREBASE ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFD3eK8SmP4z_eXAoiPzNN0gRnhxyum-U",
  authDomain: "cocurr-sofeng.firebaseapp.com",
  projectId: "cocurr-sofeng",
  storageBucket: "cocurr-sofeng.firebasestorage.app",
  messagingSenderId: "387943862464",
  appId: "1:387943862464:web:d6f4f44572d6f571fadd25"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// ====================== CONSTANTS ======================
const STATUS_OPTIONS = [
  { value: 'WIP', label: 'WIP' },
  { value: 'Review', label: 'Review' },
  { value: 'Revise', label: 'Revise' },
  { value: 'Ready', label: 'Ready' }
];

const routes = [
  '../cocurr-homepage/homepage.html',
  'dailytask.html',
  '../cocurr-coursefolder/course.html'
];

// ====================== SIDEBAR NAV ======================
document.querySelectorAll('.sidebar-icon').forEach((icon, index) => {
  if (routes[index]) {
    icon.addEventListener('click', () => {
      window.location.href = routes[index];
    });
  }
});

// ====================== AUTH STATE ======================
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) loadTasksFromFirestore(user.uid);
});

// ====================== UI HELPERS ======================
function makeStatusSpan(status) {
  const span = document.createElement('div');
  span.className = 'status-span ' + status.toLowerCase();
  span.textContent = status;
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

// ====================== ROW CREATION ======================
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

  const wipBubble = row.querySelector('.wip-bubble');
  wipBubble.className = 'wip-bubble ' + status.toLowerCase();
  wipBubble.appendChild(makeStatusSpan(status));
  const addRow = taskTable.querySelector('.add-row');
  taskTable.insertBefore(row, addRow);
  return row;
}

function createTaskRowWithId(taskId, task, deadline, status, course) {
  const row = createTaskRow(task, deadline, status, course);
  row.dataset.taskId = taskId;
  addTaskRowListeners(row);
  return row;
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

// ====================== LISTENERS ======================
function addTaskRowListeners(row) {
  const check = row.querySelector('.check-task');
  const moreBtn = row.querySelector('.more-btn');
  const editBtn = row.querySelector('.edit-btn');
  const deleteBtn = row.querySelector('.delete-btn');

  check.addEventListener('click', () => {
    row.classList.toggle('checked');
    check.classList.toggle('checked');
  });

  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.task-row').forEach(r => r.classList.remove('show-actions'));
    row.classList.toggle('show-actions');
  });

  editBtn.addEventListener('click', async () => {
    if (editBtn.textContent === 'Save') {
      await saveTask(row);
      toggleRowEdit(row, false);
      editBtn.textContent = 'Edit';
    } else {
      toggleRowEdit(row, true);
      editBtn.textContent = 'Save';
    }
  });

  deleteBtn.addEventListener('click', async () => {
    if (row.dataset.taskId) {
      await deleteDoc(
        doc(db, "users", currentUser.uid, "tasks", row.dataset.taskId)
      );
    }
    row.remove();
  });
}

// ====================== ADD NEW TASK ======================
function createEditableTaskRow() {
  const row = createTaskRow('', '', 'WIP', '');
  toggleRowEdit(row, true);
  addTaskRowListeners(row);
  row.querySelector('.task-bubble').focus();
}

if (plusBtn) plusBtn.addEventListener('click', createEditableTaskRow);

// ====================== LOAD TASKS ======================
function loadTasksFromFirestore(uid) {
  const col = collection(db, "users", uid, "tasks");

  onSnapshot(col, (snapshot) => {
    document.querySelectorAll('.task-row:not(.add-row)').forEach(r => r.remove());

    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      createTaskRowWithId(docSnap.id, d.task, d.deadline, d.status, d.course);
    });
  });
}

// ====================== PROFILE INITIAL ======================
(function () {
  const profile = document.getElementById('profileCircle');
  if (!profile || !currentUser) return;
  profile.textContent = currentUser.email.charAt(0).toUpperCase();
})();
