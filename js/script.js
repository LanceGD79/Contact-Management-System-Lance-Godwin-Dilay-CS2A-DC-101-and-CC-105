async function loadDashboard() {
  try {
    const [resC, resG, resD] = await Promise.all([
      fetch("http://localhost:3000/contacts"),
      fetch("http://localhost:3000/groups"),
      fetch("http://localhost:3000/details")
    ]);

    const contacts = await resC.json();
    const groups = await resG.json();
    const details = await resD.json();

    document.getElementById("totalContacts").textContent = contacts.length;
    document.getElementById("totalGroups").textContent = groups.length;
    document.getElementById("totalDetails").textContent = details.length;

    const recentTableBody = document.getElementById("recentContactList");
    recentTableBody.innerHTML = contacts.slice(0, 5).map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.company || 'N/A'}</td>
        <td><span class="group-tag">${c.group_name}</span></td>
      </tr>
    `).join("");

  } catch (error) {
    console.error("Dashboard error:", error);
  }
}
loadDashboard();