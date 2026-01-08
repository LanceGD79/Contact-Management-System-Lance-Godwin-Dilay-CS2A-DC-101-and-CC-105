const apiC = "http://localhost:3000/contacts";
const apiG = "http://localhost:3000/groups";

const contactList = document.getElementById("contactList");
const contactName = document.getElementById("contactName");
const contactCompany = document.getElementById("contactCompany");
const contactPosition = document.getElementById("contactPosition");
const groupSelect = document.getElementById("groupSelect");
const addContactBtn = document.getElementById("addContactBtn");

const modal = document.getElementById("editModal");
const modalInputs = document.getElementById("modalInputs");
const editForm = document.getElementById("editForm");
const closeBtn = document.querySelector(".closeBtn");
let currentEditId = null;

async function loadGroups() {
  const res = await fetch(apiG);
  const groups = await res.json();
  groupSelect.innerHTML = groups.map(g =>
    `<option value="${g.group_id}">${g.group_name}</option>`
  ).join("");
}

async function loadContacts() {
  const res = await fetch(apiC);
  const contacts = await res.json();
  
  contactList.innerHTML = contacts.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.company || 'N/A'} - ${c.position || 'N/A'}</td>
      <td><span class="group-tag">${c.group_name || 'No group'}</span></td>
      <td>
        <div class="actions">
          <button class="edit-btn" onclick="openEditModal(${c.contact_id}, '${c.name}', '${c.company || ''}', '${c.position || ''}', '${c.group_id || ''}')">Edit</button>
          <button class="delete-btn" onclick="deleteContact(${c.contact_id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function addContact() {
  const name = contactName.value.trim();
  if (!name) return alert("Name required!");

  await fetch(apiC, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name,
      group_id: groupSelect.value,
      company: contactCompany.value.trim(),
      position: contactPosition.value.trim()
    })
  });

  contactName.value = "";
  contactCompany.value = "";
  contactPosition.value = "";
  loadContacts();
}

async function deleteContact(id) {
  if (!confirm("Delete this contact?")) return;
  await fetch(`${apiC}/${id}`, { method: "DELETE" });
  loadContacts();
}

function openEditModal(id, name, company, position, groupId) {
  currentEditId = id;
  modalInputs.innerHTML = `
    <input type="text" id="modalName" placeholder="Name" value="${name}" required>
    <input type="text" id="modalCompany" placeholder="Company" value="${company}">
    <input type="text" id="modalPosition" placeholder="Position" value="${position}">
    <select id="modalGroup">
      ${groupSelect.innerHTML}
    </select>
  `;
  document.getElementById("modalGroup").value = groupId;
  modal.style.display = "block";
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

editForm.onsubmit = async e => {
  e.preventDefault();
  const name = document.getElementById("modalName").value.trim();
  const company = document.getElementById("modalCompany").value.trim();
  const position = document.getElementById("modalPosition").value.trim();
  const group_id = document.getElementById("modalGroup").value;

  if (!name) return alert("Name required!");

  await fetch(`${apiC}/${currentEditId}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name, company, position, group_id })
  });

  modal.style.display = "none";
  loadContacts();
};

addContactBtn.addEventListener("click", addContact);
loadGroups();
loadContacts();
