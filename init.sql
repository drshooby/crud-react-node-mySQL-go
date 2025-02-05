-- based on Norbert's schema

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cover VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL
);