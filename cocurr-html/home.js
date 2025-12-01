/**
 * CoCurr Dashboard - JavaScript Functionality
 * Handles navigation, interactions, and task management
 */

// ===========================
// DOM ELEMENTS
// ===========================

const navIcons = document.querySelectorAll('.nav-icon');
const profileIcon = document.querySelector('.profile-icon');
const selectAllCheckbox = document.getElementById('selectAll');
const taskCheckboxes = document.querySelectorAll('.task-checkbox');
const taskRows = document.querySelectorAll('.task-row');
const sidePanel = document.getElementById('sidePanel');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===========================
// NAVIGATION FUNCTIONALITY
// ===========================

/**
 * Handle navigation icon clicks
 */
navIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        // Remove active class from all icons
        navIcons.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked icon
        this.classList.add('active');
        
        // Navigate based on icon class
        const iconClass = this.className;
        
        if (iconClass.includes('icon-home')) {
            navigateTo('home');
        } else if (iconClass.includes('icon-tasks')) {
            navigateTo('tasks');
        } else if (iconClass.includes('icon-calendar')) {
            navigateTo('calendar');
        } else if (iconClass.includes('icon-folder')) {
            navigateTo('files');
        } else if (iconClass.includes('icon-add')) {
            openAddTaskModal();
        }
    });
});

/**
 * Navigate to different pages
 * @param {string} page - Page to navigate to
 */
function navigateTo(page) {
    const routes = {
        'home': 'home.html',
        'tasks': 'tasks/tasks.html',
        'calendar': 'calendar.html',
        'files': 'files.html'
    };
    
    if (routes[page]) {
        // Uncomment the line below to enable navigation
        // window.location.href = routes[page];
        console.log('Navigate to:', page);
    }
}

/**
 * Open add task modal
 */
function openAddTaskModal() {
    console.log('Opening add task modal...');
    // Implement modal functionality here
    alert('Add Task modal - to be implemented');
}

// ===========================
// PROFILE MENU FUNCTIONALITY
// ===========================

/**
 * Handle profile icon click
 */
profileIcon.addEventListener('click', function() {
    console.log('Opening profile menu...');
    // Implement profile dropdown menu here
    alert('Profile Menu - to be implemented');
});

// ===========================
// CHECKBOX & SELECT ALL FUNCTIONALITY
// ===========================

/**
 * Handle select all checkbox
 */
selectAllCheckbox.addEventListener('change', function() {
    // Select/deselect all task checkboxes
    taskCheckboxes.forEach(checkbox => {
        if (checkbox !== selectAllCheckbox) {
            checkbox.checked = this.checked;
        }
    });
});

/**
 * Handle individual task checkbox changes
 */
taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        // Update select all checkbox state
        updateSelectAllCheckbox();
    });
});

/**
 * Update select all checkbox based on individual checkbox states
 */
function updateSelectAllCheckbox() {
    const totalCheckboxes = taskCheckboxes.length - 1; // Exclude select all checkbox
    const checkedCheckboxes = Array.from(taskCheckboxes).filter(cb => cb.checked && cb !== selectAllCheckbox).length;
    
    selectAllCheckbox.checked = checkedCheckboxes === totalCheckboxes;
    selectAllCheckbox.indeterminate = checkedCheckboxes > 0 && checkedCheckboxes < totalCheckboxes;
}

// ===========================
// TABLE ROW INTERACTION
// ===========================

/**
 * Handle task row click
 */
taskRows.forEach(row => {
    row.addEventListener('click', function(e) {
        // Don't trigger if clicking on checkbox
        if (e.target.type === 'checkbox') {
            return;
        }
        
        openTaskDetails(this);
    });
});

/**
 * Open task details modal/page
 * @param {HTMLElement} row - Task row element
 */
function openTaskDetails(row) {
    const taskName = row.querySelector('.task-name').textContent.trim();
    const status = row.querySelector('.status-badge').textContent.trim();
    const deadline = row.querySelector('.deadline').textContent.trim();
    const course = row.querySelector('.course-code').textContent.trim();
    
    console.log('Task Details:', {
        name: taskName,
        status: status,
        deadline: deadline,
        course: course
    });
    
    // Implement task details modal/page here
    alert(`Task: ${taskName}\nStatus: ${status}\nDeadline: ${deadline}\nCourse: ${course}`);
}

// ===========================
// FILTER FUNCTIONALITY
// ===========================

/**
 * Handle filter button clicks
 */
filterBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const filter = this.getAttribute('data-filter');
        filterTasks(filter);
    });
});

/**
 * Filter tasks by status
 * @param {string} filter - Filter type (all, wip, completed, pending)
 */
function filterTasks(filter) {
    console.log('Filtering tasks by:', filter);
    
    taskRows.forEach(row => {
        const badgeClass = row.querySelector('.status-badge').className;
        
        if (filter === 'all') {
            row.style.display = '';
        } else if (badgeClass.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Get selected tasks
 * @returns {Array} Array of selected task names
 */
function getSelectedTasks() {
    const selected = [];
    taskCheckboxes.forEach(checkbox => {
        if (checkbox.checked && checkbox !== selectAllCheckbox) {
            const row = checkbox.closest('.task-row');
            const taskName = row.querySelector('.task-name').textContent.trim();
            selected.push(taskName);
        }
    });
    return selected;
}

/**
 * Mark tasks as complete
 */
function markTasksComplete() {
    const selected = getSelectedTasks();
    if (selected.length === 0) {
        alert('Please select at least one task');
        return;
    }
    
    console.log('Marking tasks as complete:', selected);
    // Implement mark complete functionality here
}

/**
 * Delete selected tasks
 */
function deleteSelectedTasks() {
    const selected = getSelectedTasks();
    if (selected.length === 0) {
        alert('Please select at least one task');
        return;
    }
    
    if (confirm(`Delete ${selected.length} task(s)?`)) {
        console.log('Deleting tasks:', selected);
        // Implement delete functionality here
    }
}

// ===========================
// INITIALIZATION
// ===========================

/**
 * Initialize the dashboard
 */
function initDashboard() {
    console.log('Dashboard initialized');
    
    // Set first nav icon as active
    if (navIcons.length > 0) {
        navIcons[0].classList.add('active');
    }
    
    // Update select all checkbox state on load
    updateSelectAllCheckbox();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initDashboard);
