USE contact_db;
SELECT * FROM contacts;
SET FOREIGN_KEY_CHECKS = 0;
SELECT * FROM contact_groups;
DROP TABLE IF EXISTS contact_groups;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS contact_details;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS contact_groups (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    group_name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS contacts (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    group_id INT,
    company VARCHAR(100),
    position VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES contact_groups(group_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS contact_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    notes TEXT,
    last_contacted DATETIME,
    FOREIGN KEY (contact_id) REFERENCES contacts(contact_id) ON DELETE CASCADE
);

