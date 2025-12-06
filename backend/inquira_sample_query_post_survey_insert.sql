INSERT INTO users_posts (
    title,
    content,
    category,
    target_audience,
    user_id
) VALUES (
    'This is the test survey',
    'This is the description for the test survey',
    JSON_ARRAY('survey'),
    JSON_ARRAY('business-students', 'engineering-students'),
    1
);

SET @post_id = LAST_INSERT_ID();

INSERT INTO svy_surveys (
    posts_id,
    title,
    content,
    tags,
    approx_time,
    target_audience
) VALUES (
    @post_id,
    'This is the test survey',
    'This is the description for the test survey',
    JSON_ARRAY('Entertainment'),
    '10-15 min',
    JSON_ARRAY('business-students', 'engineering-students')
);

SET @survey_id = LAST_INSERT_ID();

INSERT INTO svy_section (
    another_id,
    title,
    `desc`,
    survey_id
) VALUES (
    'section-1764121512646',
    'Preferences',
    '',
    @survey_id
);

SET @section1 = LAST_INSERT_ID();
INSERT INTO svy_section (
    another_id,
    title,
    `desc`,
    survey_id
) VALUES (
    'section-1764121545471',
    'Trivia Question',
    '',
    @survey_id
);

SET @section2 = LAST_INSERT_ID();

INSERT INTO svy_section (
    another_id,
    title,
    `desc`,
    survey_id
) VALUES (
    'section-1764121723638',
    'Miscellaneous',
    '',
    @survey_id
);

SET @section3 = LAST_INSERT_ID();

INSERT INTO svy_questions (
    another_id, question_number, question_text,
    q_type, answer_required, url,
    min_choice, max_choice, max_rating,
    section_id
) VALUES (
    'question-1764121519607', 1, 'How old are you',
    'shortText', FALSE, NULL,
    1, 1, 5,
    @section1
);

INSERT INTO svy_questions (
    another_id, question_number, question_text,
    q_type, answer_required, url,
    min_choice, max_choice, max_rating,
    section_id
) VALUES (
    'question-1764121527441', 2, 'What is your goal in life',
    'longText', FALSE, NULL,
    1, 1, 5,
    @section1
);

INSERT INTO svy_questions (
    another_id, question_number, question_text,
    q_type, answer_required, url,
    min_choice, max_choice, max_rating,
    section_id
) VALUES (
    'question-1764121556331', 1, 'How many continents are there',
    'radioButton', TRUE, NULL,
    1, 1, 5,
    @section2
);

SET @q3 = LAST_INSERT_ID();

INSERT INTO svy_question_choices (choice_text, question_id) VALUES
('7', @q3),
('6', @q3),
('8', @q3);

INSERT INTO svy_questions (
    another_id, question_number, question_text,
    q_type, answer_required, url,
    min_choice, max_choice, max_rating,
    section_id
) VALUES (
    'question-1764121571841', 2, 'Who is rich between these people',
    'checkBox', TRUE, NULL,
    2, 3, 5,
    @section2
);

SET @q4 = LAST_INSERT_ID();

INSERT INTO svy_question_choices (choice_text, question_id) VALUES
('Acob Laren Jay', @q4),
('Andy Sarne', @q4),
('Cabigan Red', @q4),
('Goco patrick', @q4),
('Zamulle Timothy', @q4);

INSERT INTO svy_questions (
    another_id, question_number, question_text,
    q_type, answer_required, url,
    min_choice, max_choice, max_rating,
    section_id
) VALUES (
    'question-1764121639315', 3, 'This is the dropdown option cuz i cannot think anymore',
    'dropdown', TRUE, NULL,
    1, 1, 5,
    @section2
);

SET @q5 = LAST_INSERT_ID();

INSERT INTO svy_question_choices (choice_text, question_id) VALUES
('1', @q5),
('5', @q5),
('8', @q5),
('15', @q5);

INSERT INTO svy_questions (
    another_id, question_number, question_text,
    q_type, answer_required, url,
    min_choice, max_choice, max_rating,
    section_id
) VALUES (
    'question-1764121743755', 1, 'What is your rating for this survey',
    'rating', TRUE, NULL,
    1, 1, 5,
    @section3
);

INSERT INTO svy_questions (
    another_id, question_number, question_text,
    q_type, answer_required, url,
    min_choice, max_choice, max_rating,
    section_id
) VALUES (
    'question-1764121767233', 2, 'What is your birthday',
    'date', FALSE, NULL,
    1, 1, 5,
    @section3
);

INSERT INTO svy_questions (
    another_id, question_number, question_text,
    q_type, answer_required, url,
    min_choice, max_choice, max_rating,
    section_id
) VALUES (
    'question-1764121786189', 3, 'Enter your email',
    'email', TRUE, NULL,
    1, 1, 5,
    @section3
);


SELECT * FROM users_root;

-- 1. View All Posts With User Info
SELECT * FROM users_local;
SELECT 
    p.id,
    p.title,
    p.content,
    p.category,
    p.target_audience,
    p.date_created,
    p.date_updated,
    p.archived,
    p.approved,
    p.status,
    p.num_of_responses,
    u.type AS user_type
FROM users_posts p
INNER JOIN users_root u ON p.user_id = u.id;

-- SELECT * FROM surveys;
SELECT * FROM svy_surveys as sv;

-- View All Survey Sections
SELECT 
    s.id AS section_id,
    s.section_title,
    s.survey_id,
    sv.title AS survey_title
FROM svy_section s
INNER JOIN svy_surveys sv ON s.survey_id = sv.id;

-- View All Survey Questions
SELECT 
    q.id AS question_id,
    q.question_text,
    q.q_type,
    q.section_id,
    s.title AS section,
    sv.title AS survey_title
FROM svy_questions q
INNER JOIN svy_section s ON q.section_id = s.id
INNER JOIN svy_surveys sv ON s.survey_id = sv.id;

-- View Survey → Sections → Questions (FULL JOIN TREE)
SELECT 
    sv.id AS survey_id,
    sv.title AS survey_title,
    sc.id AS section_id,
    sc.title,
    q.id AS question_id,
    q.question_text,
    q.q_type
FROM svy_surveys sv
LEFT JOIN svy_section sc ON sc.survey_id = sv.id
LEFT JOIN svy_questions q ON q.section_id = sc.id
ORDER BY sv.id, sc.id, q.id;

