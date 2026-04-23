const STORAGE_KEY = 'foodDeliveryRegistrations';

function readUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function sendAjaxRegistration(payload) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.timeout = 4000;

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText || '{}'));
        } catch (error) {
          resolve({});
        }
      } else {
        reject(new Error('Remote AJAX endpoint unavailable.'));
      }
    };

    xhr.onerror = function () {
      reject(new Error('AJAX request failed.'));
    };

    xhr.ontimeout = function () {
      reject(new Error('AJAX request timed out.'));
    };

    xhr.send(JSON.stringify(payload));
  });
}

function storeRegistration(payload, source) {
  const users = readUsers();
  users.unshift({
    id: `fd-user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...payload,
    source,
    createdAt: new Date().toISOString()
  });
  saveUsers(users);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const statusBox = document.getElementById('statusBox');
  const submitButton = document.getElementById('submitButton');

  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    statusBox.className = 'status-box status-info';
    statusBox.textContent = 'Submitting registration using AJAX POST...';
    submitButton.disabled = true;

    try {
      await sendAjaxRegistration(payload);
      storeRegistration(payload, 'ajax-post');
      sessionStorage.setItem(
        'foodDeliveryRegistrationNotice',
        'Registration completed with AJAX POST and saved to local storage.'
      );
      window.location.href = 'users.html';
    } catch (error) {
      storeRegistration(payload, 'local-fallback');
      sessionStorage.setItem(
        'foodDeliveryRegistrationNotice',
        'Registration saved locally after AJAX fallback. This still demonstrates the form flow.'
      );
      window.location.href = 'users.html';
    } finally {
      submitButton.disabled = false;
    }
  });
});
