use itec_205;

CREATE TABLE IF NOT EXISTS users_posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(512) NOT NULL,
    content TEXT NOT NULL,

    category JSON NOT NULL DEFAULT (JSON_ARRAY()),
    target_audience JSON NOT NULL,

    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    archived BOOLEAN DEFAULT FALSE,
    approved BOOLEAN DEFAULT FALSE,
    status VARCHAR(16) NOT NULL DEFAULT 'open',

    num_of_responses INT NOT NULL DEFAULT 0,

    user_id INT NOT NULL,

    CONSTRAINT fk_posts_user
        FOREIGN KEY (user_id) REFERENCES users_root(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS svy_surveys (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    posts_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(256) NOT NULL,
    content TEXT NULL,

    tags JSON NOT NULL DEFAULT (JSON_ARRAY()),
    approx_time VARCHAR(128) NOT NULL,
    target_audience JSON NOT NULL,

    num_of_responses INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_svy_surveys_posts
        FOREIGN KEY (posts_id) REFERENCES users_posts(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS svy_section (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    another_id VARCHAR(256) NOT NULL,
    title VARCHAR(256) NOT NULL,
    `desc` VARCHAR(512),

    survey_id BIGINT UNSIGNED NOT NULL,
    
    CONSTRAINT fk_svy_section_survey
        FOREIGN KEY (survey_id) REFERENCES svy_surveys(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS svy_questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    another_id VARCHAR(128) NOT NULL,
    question_number INT NOT NULL,
    question_text VARCHAR(512) NOT NULL,

    q_type VARCHAR(64) NOT NULL,
    answer_required BOOLEAN NOT NULL DEFAULT FALSE,
    url VARCHAR(512),

    min_choice INT NOT NULL DEFAULT 1,
    max_choice INT NOT NULL DEFAULT 1,
    max_rating INT NOT NULL DEFAULT 1,

    section_id BIGINT UNSIGNED NOT NULL,

    CONSTRAINT fk_svy_questions_section
        FOREIGN KEY (section_id) REFERENCES svy_section(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS svy_question_choices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    choice_text TEXT NOT NULL,

    question_id BIGINT UNSIGNED NOT NULL,

    CONSTRAINT fk_svy_choices_question
        FOREIGN KEY (question_id) REFERENCES svy_questions(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

