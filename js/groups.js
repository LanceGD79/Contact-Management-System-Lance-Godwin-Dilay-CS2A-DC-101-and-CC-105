const api = "http://localhost:3000/groups";

const groupList = document.getElementById("groupList");
const groupName = document.getElementById("groupName");
const groupDesc = document.getElementById("groupDesc");
const addGroupBtn = document.getElementById("addGroupBtn");

const modal = document.getElementById("editModal");
const modalInputs = document.getElementById("modalInputs");
const editForm = document.getElementById("editForm");
const closeBtn = document.querySelector(".closeBtn");
let currentEditId = null;

async function loadGroups() {
  const res = await fetch(api);
  const groups = await res.json();
  groupList.innerHTML = groups.map(g => `
    <tr>
      <td><strong>${g.group_name}</strong></td>
      <td>${g.description || ''}</td>
      <td>
        <div class="actions">
          <button class="edit-btn" onclick="openEditModal(${g.group_id}, '${g.group_name}', '${g.description || ''}')">Edit</button>
          <button class="delete-btn" onclick="deleteGroup(${g.group_id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function addGroup() {
  const name = groupName.value.trim();
  const desc = groupDesc.value.trim();
  if (!name) return alert("Group name required!");

  await fetch(api, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ group_name: name, description: desc })
  });

  groupName.value = "";
  groupDesc.value = "";
  loadGroups();
}

async function deleteGroup(id) {
  if (!confirm("Delete this group?")) return;
  await fetch(`${api}/${id}`, { method: "DELETE" });
  loadGroups();
}

function openEditModal(id, name, desc) {
  currentEditId = id;
  modalInputs.innerHTML = `
    <input type="text" id="modalName" placeholder="Group Name" value="${name}" required>
    <input type="text" id="modalDesc" placeholder="Description" value="${desc}">
  `;
  modal.style.display = "block";
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

editForm.onsubmit = async e => {
  e.preventDefault();
  const newName = document.getElementById("modalName").value.trim();
  const newDesc = document.getElementById("modalDesc").value.trim();
  if (!newName) return alert("Group name required!");

  await fetch(`${api}/${currentEditId}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ group_name: newName, description: newDesc })
  });

  modal.style.display = "none";
  loadGroups();
};

addGroupBtn.addEventListener("click", addGroup);
loadGroups();
