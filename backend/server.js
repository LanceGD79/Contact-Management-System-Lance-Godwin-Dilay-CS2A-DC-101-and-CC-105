import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "contact_db"
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database ✅");
});

app.get("/groups", (req, res) => {
  db.query("SELECT * FROM contact_groups", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/groups", (req, res) => {
  const { group_name, description } = req.body;
  db.query(
    "INSERT INTO contact_groups (group_name, description) VALUES (?, ?)",
    [group_name, description || ""],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Group added ✅", id: result.insertId });
    }
  );
});

app.put("/groups/:id", (req, res) => {
  const { group_name, description } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE contact_groups SET group_name = ?, description = ? WHERE group_id = ?",
    [group_name, description || "", id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Group updated ✏" });
    }
  );
});

app.delete("/groups/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM contact_groups WHERE group_id = ?", [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Group deleted 🗑" });
  });
});

app.get("/contacts", (req, res) => {
  const sql = `
    SELECT c.contact_id, c.name, c.company, c.position, c.created_at, cg.group_name
    FROM contacts c
    LEFT JOIN contact_groups cg ON c.group_id = cg.group_id
    ORDER BY c.name
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/contacts", (req, res) => {
  const { name, group_id, company, position } = req.body;
  db.query(
    "INSERT INTO contacts (name, group_id, company, position) VALUES (?, ?, ?, ?)",
    [name, group_id || null, company || "", position || ""],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Contact added ✅", id: result.insertId });
    }
  );
});

app.put("/contacts/:id", (req, res) => {
  const { name, group_id, company, position } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE contacts SET name = ?, group_id = ?, company = ?, position = ? WHERE contact_id = ?",
    [name, group_id || null, company || "", position || "", id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Contact updated ✏" });
    }
  );
});

app.delete("/contacts/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM contacts WHERE contact_id = ?", [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Contact deleted 🗑" });
  });
});

app.get("/details", (req, res) => {
  db.query("SELECT * FROM contact_details", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/details/:contact_id", (req, res) => {
  const { contact_id } = req.params;
  db.query(
    "SELECT * FROM contact_details WHERE contact_id = ?",
    [contact_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

app.post("/details", (req, res) => {
  const { contact_id, phone, email, notes, last_contacted } = req.body;
  db.query(
    "INSERT INTO contact_details (contact_id, phone, email, notes, last_contacted) VALUES (?, ?, ?, ?, ?)",
    [contact_id, phone || "", email || "", notes || "", last_contacted || null],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Details added ✅", id: result.insertId });
    }
  );
});

app.put("/details/:id", (req, res) => {
  const { phone, email, notes, last_contacted } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE contact_details SET phone = ?, email = ?, notes = ?, last_contacted = ? WHERE detail_id = ?",
    [phone || "", email || "", notes || "", last_contacted || null, id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Details updated ✏" });
    }
  );
});

app.delete("/details/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM contact_details WHERE detail_id = ?", [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Details deleted 🗑" });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});
