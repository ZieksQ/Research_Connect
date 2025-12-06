create database itec_205;

use itec_205;

CREATE TABLE users_root (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(64) NOT NULL
);

CREATE TABLE users_local (
    id INT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    profile_pic_url VARCHAR(512) DEFAULT 'https://siqejctaztvawzceuhrw.supabase.co/storage/v1/object/public/profile_pic/GigiMurin2.png',
    role VARCHAR(64) NOT NULL,
    email VARCHAR(256),
    school VARCHAR(256),
    program VARCHAR(256),
    num_of_answered_survey INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_users_local_root
        FOREIGN KEY (id) REFERENCES users_root(id)
        ON DELETE CASCADE
);

-- Insert multiple rows into users_root with specified IDs
INSERT INTO users_root (id, type)
VALUES 
    (1, 'admin'),
    (2, 'moderator'),
    (3, 'user');

-- Insert corresponding users into users_local
INSERT INTO users_local (id, username, password, role, email, school, program)
VALUES
    (1, 'johndoe', 'hashed_password_1', 'administrator', 'johndoe@example.com', 'University A', 'Computer Science'),
    (2, 'janedoe', 'hashed_password_2', 'moderator', 'janedoe@example.com', 'University B', 'Information Technology'),
    (3, 'bobsmith', 'hashed_password_3', 'user', 'bobsmith@example.com', 'University C', 'Software Engineering');


select * from users_local;

select * from users_local 
where username = "johndoe";
inquira_sample_query_user.sql