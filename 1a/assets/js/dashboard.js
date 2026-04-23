(function () {
  const registrations = JSON.parse(
    localStorage.getItem('foodDeliveryRegistrations') || '[]'
  );

  document.querySelectorAll('[data-registrations-count]').forEach((element) => {
    element.textContent = String(registrations.length).padStart(2, '0');
  });

  document.querySelectorAll('[data-current-date]').forEach((element) => {
    element.textContent = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('[data-width]').forEach((element) => {
    element.style.width = `${element.dataset.width}%`;
  });
})();
