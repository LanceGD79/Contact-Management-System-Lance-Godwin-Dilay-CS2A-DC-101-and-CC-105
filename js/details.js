const apiD = "http://localhost:3000/details";
const apiC = "http://localhost:3000/contacts";

const contactSelect = document.getElementById("contactSelect");
const detailPhone = document.getElementById("detailPhone");
const detailEmail = document.getElementById("detailEmail");
const detailNotes = document.getElementById("detailNotes");
const addDetailBtn = document.getElementById("addDetailBtn");
const detailList = document.getElementById("detailList");

const modal = document.getElementById("editModal");
const modalInputs = document.getElementById("modalInputs");
const editForm = document.getElementById("editForm");
const closeBtn = document.querySelector(".closeBtn");
let currentEditId = null;

async function loadContacts() {
  const res = await fetch(apiC);
  const contacts = await res.json();
  contactSelect.innerHTML = contacts.map(c =>
    `<option value="${c.contact_id}">${c.name}</option>`
  ).join("");
  loadDetails();
}

async function loadDetails() {
  const contactId = contactSelect.value;
  if (!contactId) return;

  const res = await fetch(`${apiD}/${contactId}`);
  const details = await res.json();
  detailList.innerHTML = details.map(d => `
    <tr>
      <td>${d.phone || '-'}</td>
      <td>${d.email || '-'}</td>
      <td>${d.notes || '-'}</td>
      <td>
        <div class="actions">
          <button class="edit-btn" onclick="openEditModal(${d.detail_id}, '${d.phone || ''}', '${d.email || ''}', '${d.notes || ''}')">Edit</button>
          <button class="delete-btn" onclick="deleteDetails(${d.detail_id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function addDetails() {
  const contact_id = contactSelect.value;
  const phone = detailPhone.value.trim();
  const email = detailEmail.value.trim();
  const notes = detailNotes.value.trim();

  if (!phone && !email) return alert("Phone or email required!");

  await fetch(apiD, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ contact_id, phone, email, notes })
  });

  detailPhone.value = "";
  detailEmail.value = "";
  detailNotes.value = "";
  loadDetails();
}

async function deleteDetails(id) {
  if (!confirm("Delete this detail?")) return;
  await fetch(`${apiD}/${id}`, { method: "DELETE" });
  loadDetails();
}

function openEditModal(id, phone, email, notes) {
  currentEditId = id;
  modalInputs.innerHTML = `
    <input type="text" id="modalPhone" placeholder="Phone" value="${phone}">
    <input type="text" id="modalEmail" placeholder="Email" value="${email}">
    <input type="text" id="modalNotes" placeholder="Notes" value="${notes}">
  `;
  modal.style.display = "block";
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

editForm.onsubmit = async e => {
  e.preventDefault();
  const phone = document.getElementById("modalPhone").value.trim();
  const email = document.getElementById("modalEmail").value.trim();
  const notes = document.getElementById("modalNotes").value.trim();

  await fetch(`${apiD}/${currentEditId}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ phone, email, notes })
  });

  modal.style.display = "none";
  loadDetails();
};

addDetailBtn.addEventListener("click", addDetails);
contactSelect.addEventListener("change", loadDetails);

loadContacts();