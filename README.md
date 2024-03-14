## Admin-api

CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
full_name VARCHAR(100),
phone_number VARCHAR(20),
role VARCHAR(20),
dob DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, full_name, phone_number, role, dob)
VALUES
('demo_user1', 'password1', 'demo1@example.com', 'Demo User 1', '+1234567890', 'superadmin', '1990-01-01'),
('demo_user2', 'password2', 'demo2@example.com', 'Demo User 2', '+1234567890', 'admin', '1990-01-01'),
('demo_user3', 'password3', 'demo3@example.com', 'Demo User 3', '+1234567890', 'user', '1990-01-01');
