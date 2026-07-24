import './admin.css';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../utils/firebase.js';
// 1. ADDED deleteWarranty and updateWarranty to the imports
import {
  registerWarranty,
  serialExists,
  getAllWarranties,
  searchWarrantyByCarNumber,
  deleteWarranty,
  updateWarranty
} from '../utils/warrantyApi.js';
import { products } from '../data/products.js';

function renderShell(mountSelector) {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  const productOptions = products.map((p) => `<option value="${p.id}">${p.title}</option>`).join('');

  mount.innerHTML = `
    <div class="admin-topbar admin-hidden" id="adminTopbar">
      <span class="admin-topbar-brand"></span>
      <div class="admin-topbar-nav" style="display:flex; gap:16px; flex-wrap:wrap; margin:8px 0;">
        <button id="navRegister" class="active" style="cursor:pointer; font-weight:bold;">Register</button>
        <button id="navDatabase" style="cursor:pointer;">Database</button>
      </div>
      <div class="admin-topbar-user">
        <span id="adminUserEmail"></span>
        <button class="admin-logout-btn" id="adminLogoutBtn">Sign out</button>
      </div>
    </div>

    <div class="admin-shell">
      <div class="admin-card" id="adminLoginCard">
        <h1>Admin sign in</h1>
        <p class="admin-subtitle section-desc" style="margin:0 0 24px;">Warranty registration is restricted to authorized staff.</p>
        <form id="adminLoginForm" novalidate>
          <div class="admin-field">
            <label for="adminEmail">Email</label>
            <input type="email" id="adminEmail" name="email" placeholder="admin@sternbeam.com" required />
          </div>
          <div class="admin-field">
            <label for="adminPassword">Password</label>
            <input type="password" id="adminPassword" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn btn-primary admin-submit">
            <span class="btn-label">Sign in</span>
            <span class="btn-sending">Signing in<i>.</i><i>.</i><i>.</i></span>
          </button>
          <p class="admin-message" id="loginMessage" role="status"></p>
        </form>
      </div>

      <div class="admin-console admin-hidden" id="adminConsole">
        <h1>Register a warranty</h1>
        <form id="adminRegisterForm" novalidate>
          <div class="admin-row">
            <div class="admin-field">
              <label for="rName">Customer name</label>
              <input type="text" id="rName" name="name" placeholder="Martin Carter" required />
            </div>
            <div class="admin-field">
              <label for="rEmail">Customer email</label>
              <input type="email" id="rEmail" name="email" placeholder="martin@email.com" required />
            </div>
          </div>
          <div class="admin-row">
            <div class="admin-field">
              <label for="rProduct">Product</label>
              <select id="rProduct" name="productId" required>${productOptions}</select>
            </div>
            <div class="admin-field">
              <label for="rSerial">Serial number</label>
              <input type="text" id="rSerial" name="serial" placeholder="e.g. SB-2026-004821" required />
            </div>
          </div>
          <div class="admin-row">
            <div class="admin-field">
              <label for="rPurchaseDate">Purchase date</label>
              <input type="date" id="rPurchaseDate" name="purchaseDate" required />
            </div>
            <div class="admin-field">
              <label for="rDealer">Dealer / store (optional)</label>
              <input type="text" id="rDealer" name="dealer" placeholder="e.g. AutoParts Direct" />
            </div>
          </div>
          <div class="admin-row">
            <div class="admin-field">
              <label for="rCarNumber">Car number</label>
              <input type="text" id="rCarNumber" name="carNumber" placeholder="e.g. HR 20 AB 1234" required />
            </div>
          </div>
          <button type="submit" class="btn btn-primary admin-submit">
            <span class="btn-label">Register warranty</span>
            <span class="btn-sending">Registering<i>.</i><i>.</i><i>.</i></span>
          </button>
          <p class="admin-message" id="registerMessage" role="status"></p>
        </form>
      </div>

      <div class="admin-console admin-hidden" id="databaseConsole" style="display:none;">
        <h1>Warranty Database</h1>
        
        <div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
  <button id="viewAllBtn" style="padding:8px 16px; cursor:pointer;">View All</button>
  <input type="text" id="searchInput" placeholder="Search by Car Number..." style="padding:8px; flex-grow:1; min-width:200px; max-width:300px; border:1px solid #ccc; border-radius:4px;" />
  <button id="searchBtn" style="padding:8px 16px; cursor:pointer;">Search</button>
</div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse: collapse; text-align:left;">
            <thead>
              <tr style="border-bottom: 2px solid #ddd;">
                <th style="padding:10px;">Name</th>
                <th style="padding:10px;">Email</th>
                <th style="padding:10px;">Serial</th>
                <th style="padding:10px;">Product</th>
                <th style="padding:10px;">Car Number</th>
                <th style="padding:10px;">Purchase Date</th>
                <!-- 2. ADDED the Actions column header here -->
                <th style="padding:10px;">Actions</th> 
              </tr>
            </thead>
            <tbody id="tableBody">
              </tbody>
          </table>
          <p id="tableMessage" style="margin-top:16px; color:#666;"></p>
        </div>
      </div>
    </div>
  `;
}

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = `admin-message show ${type}`;
}

function setSending(button, isSending) {
  button.classList.toggle('sending', isSending);
  button.disabled = isSending;
}

export function initAdminApp(mountSelector = '#admin-mount') {
  renderShell(mountSelector);

  const topbar = document.getElementById('adminTopbar');
  const loginCard = document.getElementById('adminLoginCard');
  const adminConsole = document.getElementById('adminConsole');
  const databaseConsole = document.getElementById('databaseConsole');
  const userEmailEl = document.getElementById('adminUserEmail');

  // Navigation
  const navRegister = document.getElementById('navRegister');
  const navDatabase = document.getElementById('navDatabase');

  function showPanel(panelName) {
    adminConsole.classList.remove('admin-hidden');
    databaseConsole.classList.remove('admin-hidden');

    if (panelName === 'register') {
      adminConsole.style.display = 'block';
      databaseConsole.style.display = 'none';
      navRegister.style.fontWeight = 'bold';
      navDatabase.style.fontWeight = 'normal';
    } else {
      adminConsole.style.display = 'none';
      databaseConsole.style.display = 'block';
      navRegister.style.fontWeight = 'normal';
      navDatabase.style.fontWeight = 'bold';
      loadTableData();
    }
  }

  navRegister.addEventListener('click', () => showPanel('register'));
  navDatabase.addEventListener('click', () => showPanel('database'));

  // --- Auth state gates ---
  onAuthStateChanged(auth, (user) => {
    const signedIn = !!user;
    topbar.classList.toggle('admin-hidden', !signedIn);
    loginCard.classList.toggle('admin-hidden', signedIn);

    if (signedIn) {
      userEmailEl.textContent = user.email;
      showPanel('register');
    } else {
      adminConsole.classList.add('admin-hidden');
      databaseConsole.style.display = 'none';
    }
  });

  // --- Login ---
  const loginForm = document.getElementById('adminLoginForm');
  const loginMessage = document.getElementById('loginMessage');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = loginForm.querySelector('.admin-submit');
    setSending(button, true);
    loginMessage.classList.remove('show');
    const formData = new FormData(loginForm);
    try {
      await signInWithEmailAndPassword(auth, formData.get('email').trim(), formData.get('password'));
      loginForm.reset();
    } catch (err) {
      showMessage(loginMessage, 'Incorrect email or password.', 'error');
    } finally {
      setSending(button, false);
    }
  });

  // --- Logout ---
  document.getElementById('adminLogoutBtn').addEventListener('click', () => signOut(auth));

  // --- Register Warranty ---
  const registerForm = document.getElementById('adminRegisterForm');
  const registerMessage = document.getElementById('registerMessage');
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = registerForm.querySelector('.admin-submit');
    setSending(button, true);
    registerMessage.classList.remove('show');
    const formData = new FormData(registerForm);
    const productId = formData.get('productId');
    const product = products.find((p) => p.id === productId);
    const serial = formData.get('serial').trim();

    try {
      if (await serialExists(serial)) {
        showMessage(registerMessage, 'This serial number is already registered.', 'error');
        setSending(button, false);
        return;
      }
      await registerWarranty({
        name: formData.get('name'),
        email: formData.get('email'),
        productId,
        productTitle: product ? product.title : productId,
        serial,
        purchaseDate: formData.get('purchaseDate'),
        dealer: formData.get('dealer'),
        carNumber: formData.get('carNumber'),
      });
      showMessage(registerMessage, 'Warranty registered.', 'success');
      registerForm.reset();
    } catch (err) {
      showMessage(registerMessage, "Some required details are missing. Please check the form and try again.", 'error');
    } finally {
      setSending(button, false);
    }
  });

  // --- Database Search & Display ---
  const tableBody = document.getElementById('tableBody');
  const tableMessage = document.getElementById('tableMessage');
  const searchInput = document.getElementById('searchInput');

  function renderTable(dataArray) {
    tableBody.innerHTML = '';
    if (dataArray.length === 0) {
      tableMessage.textContent = "No warranties found.";
      return;
    }
    tableMessage.textContent = "";

    dataArray.forEach(item => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = "1px solid #eee";
      // 3. ADDED the Edit and Delete buttons to the end of every row
      tr.innerHTML = `
        <td style="padding:10px;">${item.name}</td>
        <td style="padding:10px;">${item.email}</td>
        <td style="padding:10px; font-family:monospace;">${item.serial}</td>
        <td style="padding:10px;">${item.productTitle || item.productId}</td>
        <td style="padding:10px;">${item.carNumber || 'N/A'}</td> <!-- ADD THIS ROW DATA -->
        <td style="padding:10px;">${item.purchaseDate}</td>
        <td style="padding:10px;">
          <button class="edit-btn" data-id="${item.id}" data-name="${item.name}" data-date="${item.purchaseDate}" style="cursor:pointer; margin-right:8px; padding:4px 8px; font-size:12px;">Edit</button>
          <button class="delete-btn" data-id="${item.id}" style="cursor:pointer; padding:4px 8px; font-size:12px; color:white; background:red; border:none; border-radius:3px;">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // 4. ADDED the event listener to catch Edit and Delete button clicks
  tableBody.addEventListener('click', async (e) => {
    // Handle Delete
    if (e.target.classList.contains('delete-btn')) {
      const docId = e.target.getAttribute('data-id');
      if (confirm('Are you sure you want to completely delete this warranty? This cannot be undone.')) {
        try {
          tableMessage.textContent = "Deleting...";
          await deleteWarranty(docId);
          await loadTableData(); // Refresh the table
        } catch (err) {
          console.error(err);
          alert('Failed to delete warranty.');
        }
      }
    }

    // Handle Edit (Simple Prompt Implementation)
    if (e.target.classList.contains('edit-btn')) {
      const docId = e.target.getAttribute('data-id');
      const currentName = e.target.getAttribute('data-name');
      const currentDate = e.target.getAttribute('data-date');

      const newName = prompt('Update Customer Name:', currentName);
      if (newName === null) return; // User clicked Cancel

      const newDate = prompt('Update Purchase Date (YYYY-MM-DD):', currentDate);
      if (newDate === null) return;

      const updates = {};
      if (newName.trim() !== currentName) updates.name = newName;
      if (newDate.trim() !== currentDate) updates.purchaseDate = newDate;

      // Only run the database update if they actually changed something
      if (Object.keys(updates).length > 0) {
        try {
          tableMessage.textContent = "Updating...";
          await updateWarranty(docId, updates);
          await loadTableData(); // Refresh the table
        } catch (err) {
          console.error(err);
          alert('Failed to update warranty.');
        }
      }
    }
  });

  async function loadTableData() {
    tableBody.innerHTML = '';
    tableMessage.textContent = "Loading database...";
    try {
      const data = await getAllWarranties();
      renderTable(data);
    } catch (err) {
      tableMessage.textContent = "Error loading data.";
    }
  }

  document.getElementById('searchBtn').addEventListener('click', async () => {
    const carQuery = searchInput.value.trim();
    if (!carQuery) return loadTableData();

    tableBody.innerHTML = '';
    tableMessage.textContent = "Searching...";
    try {
      // Calls the new car number search function
      const data = await searchWarrantyByCarNumber(carQuery);
      renderTable(data);
    } catch (err) {
      tableMessage.textContent = "Error searching database.";
    }
  });

  document.getElementById('viewAllBtn').addEventListener('click', () => {
    searchInput.value = '';
    loadTableData();
  });
}