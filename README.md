## Admin-api

CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
name VARCHAR(100),
phone_number VARCHAR(20),
role VARCHAR(20),
dob DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
photo_url VARCHAR(255)
);

INSERT INTO users (username, password, email, name, phone_number, role, dob, photo_url)
VALUES
('demo_user4', 'password4', 'demo4@example.com', 'Demo User 4', '1234567890', 'superadmin', '1990-01-01', 'https://example.com/photo4.jpg'),
('demo_user5', 'password5', 'demo5@example.com', 'Demo User 5', '1234567890', 'admin', '1990-01-01', 'https://example.com/photo5.jpg'),
('demo_user6', 'password6', 'demo6@example.com', 'Demo User 6', '1234567890', 'user', '1990-01-01', 'https://example.com/photo6.jpg'),
('demo_user7', 'password7', 'demo7@example.com', 'Demo User 7', '1234567890', 'superadmin', '1990-01-01', 'https://example.com/photo7.jpg'),
('demo_user8', 'password8', 'demo8@example.com', 'Demo User 8', '1234567890', 'admin', '1990-01-01', 'https://example.com/photo8.jpg'),
('demo_user9', 'password9', 'demo9@example.com', 'Demo User 9', '1234567890', 'user', '1990-01-01', 'https://example.com/photo9.jpg'),
('demo_user10', 'password10', 'demo10@example.com', 'Demo User 10', '1234567890', 'superadmin', '1990-01-01', 'https://example.com/photo10.jpg'),
('demo_user11', 'password11', 'demo11@example.com', 'Demo User 11', '1234567890', 'admin', '1990-01-01', 'https://example.com/photo11.jpg'),
('demo_user12', 'password12', 'demo12@example.com', 'Demo User 12', '1234567890', 'user', '1990-01-01', 'https://example.com/photo12.jpg'),
('demo_user13', 'password13', 'demo13@example.com', 'Demo User 13', '1234567890', 'superadmin', '1990-01-01', 'https://example.com/photo13.jpg');
