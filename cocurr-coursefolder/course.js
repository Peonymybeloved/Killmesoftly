const plusBtn = document.querySelector('.plus-btn');

// ====================== SIDEBAR NAV ======================
const sidebarRoutes = [
  '../cocurr-homepage/homepage.html',
  '../cocurr-dailytask/dailytask.html',
  '../cocurr-coursefolder/course.html'
];

document.querySelectorAll('.sidebar-icon').forEach((icon, index) => {
  icon.addEventListener('click', () => {
    const target = sidebarRoutes[index];
    if (target) {
      window.location.assign(target);
    }
  });
});

// ====================== PLUS BUTTON ======================
if (plusBtn) {
  plusBtn.addEventListener('click', () => {
    window.location.href = '../cocurr-new%20course/newcourse.html';
  });
}

// ====================== PROFILE CIRCLE ======================
(function populateProfileInitial(){
  const profile = document.getElementById('profileCircle');
  if (!profile) return;
  const email = localStorage.getItem('userEmail') || '';
  const initial = email ? email.trim().charAt(0).toUpperCase() : 'T';
  profile.textContent = initial;
})();







