-- Füge einen Fake-User ein
INSERT INTO users (first_name, last_name, email, date_of_birth, password_hash)
VALUES ('Max', 'Mustermann', 'max.mustermann@example.com', '1990-01-01', 'fakehash123');

-- Füge ein paar Fake-Todos für diesen User ein (nutze die ID des eingefügten Users)
INSERT INTO todos (title, description, done, user_id)
VALUES 
('Einkaufen', 'Milch, Eier, Brot kaufen', FALSE, 1),
('Workout', '30 Minuten laufen gehen', TRUE, 1),
('Code-Review', 'Frontend-Code überprüfen', FALSE, 1);
