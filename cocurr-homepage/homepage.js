// Sidebar Interaction
const sidebarIcons = document.querySelectorAll('.sidebar-icon');
sidebarIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    sidebarIcons.forEach(i => i.classList.remove('active'));
    icon.classList.add('active');

    const name = icon.dataset.name;
    console.log(`Clicked sidebar icon: ${name}`);
    // TODO: add logic to show different content if needed
  });
});

// Task Check Interaction
const checkTasks = document.querySelectorAll('.check-task');
checkTasks.forEach(check => {
  check.addEventListener('click', () => {
    check.classList.toggle('checked');
    const taskBubble = check.nextElementSibling;
    if(taskBubble) taskBubble.classList.toggle('checked');
  });
});







