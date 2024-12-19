-- Lösche die Fake-Todos
DELETE FROM todos WHERE user_id = 1;

-- Lösche den Fake-User
DELETE FROM users WHERE email = 'max.mustermann@example.com';

