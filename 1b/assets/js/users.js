const STORAGE_KEY = 'foodDeliveryRegistrations';

function loadUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function persistUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function formatDate(value) {
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderSummary(users) {
  const total = users.length;
  const customers = users.filter((user) => user.userType === 'Customer').length;
  const vendors = users.filter((user) => user.userType === 'Restaurant Partner').length;
  const riders = users.filter((user) => user.userType === 'Delivery Rider').length;

  document.getElementById('totalUsers').textContent = String(total).padStart(2, '0');
  document.getElementById('customerUsers').textContent = customers;
  document.getElementById('vendorUsers').textContent = vendors;
  document.getElementById('riderUsers').textContent = riders;
}

function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';

  if (!users.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-4">No registrations yet. Open the register page and add one.</td>
      </tr>
    `;
    return;
  }

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.fullName}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.city}</td>
      <td>${user.userType}</td>
      <td>${user.address}</td>
      <td><span class="pill-tag">${user.source}</span></td>
      <td class="text-end">
        <button class="btn btn-outline-danger btn-sm" data-delete-id="${user.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const notice = sessionStorage.getItem('foodDeliveryRegistrationNotice');
  const noticeBox = document.getElementById('noticeBox');
  const searchInput = document.getElementById('searchUsers');
  const clearButton = document.getElementById('clearUsers');

  let users = loadUsers();

  renderSummary(users);
  renderUsers(users);

  if (notice) {
    noticeBox.className = 'status-box status-success';
    noticeBox.textContent = notice;
    sessionStorage.removeItem('foodDeliveryRegistrationNotice');
  } else {
    noticeBox.className = 'status-box status-info';
    noticeBox.textContent = 'Registrations stored in browser local storage will appear here.';
  }

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    const filteredUsers = users.filter((user) =>
      [user.fullName, user.email, user.phone, user.city, user.userType]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
    renderUsers(filteredUsers);
  });

  document.getElementById('usersTableBody').addEventListener('click', (event) => {
    const deleteId = event.target.getAttribute('data-delete-id');
    if (!deleteId) {
      return;
    }

    users = users.filter((user) => user.id !== deleteId);
    persistUsers(users);
    renderSummary(users);
    renderUsers(users);
  });

  clearButton.addEventListener('click', () => {
    users = [];
    persistUsers(users);
    renderSummary(users);
    renderUsers(users);
    noticeBox.className = 'status-box status-warning';
    noticeBox.textContent = 'All saved registrations were cleared from local storage.';
  });
});
