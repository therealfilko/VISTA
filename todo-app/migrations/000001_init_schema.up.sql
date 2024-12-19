-- Erstelle die users-Tabelle
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
);

-- Erstelle die columns-Tabelle
CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    UNIQUE (user_id, position)
);

-- Erstelle die todos-Tabelle
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    column_id INTEGER REFERENCES columns (id) ON DELETE CASCADE,
    position INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
);

-- Füge einen Fake-User ein mit einem korrekten bcrypt-Hash für das Passwort "test123"
INSERT INTO
    users (
        first_name,
        last_name,
        email,
        date_of_birth,
        password_hash
    )
VALUES
    (
        'Max',
        'Mustermann',
        'max.mustermann@example.com',
        '1990-01-01',
        '$2a$10$fGYQlvy81KnWDrDC6OSg3OlYGHeFECLkuRE8Cx4AI0KwI5p1ogQLK' -- Hash für "test123"
    );

-- Füge Default-Spalten für den Test-User ein
INSERT INTO
    columns (title, position, user_id)
VALUES
    ('To Do', 1, 1),
    ('In Progress', 2, 1),
    ('Done', 3, 1);

-- Füge ein paar Fake-Todos für diesen User ein
INSERT INTO
    todos (
        title,
        description,
        done,
        user_id,
        column_id,
        position
    )
VALUES
    (
        'Einkaufen',
        'Milch, Eier, Brot kaufen',
        FALSE,
        1,
        1,
        1
    ),
    (
        'Workout',
        '30 Minuten laufen gehen',
        TRUE,
        1,
        2,
        1
    ),
    (
        'Code-Review',
        'Frontend-Code überprüfen',
        FALSE,
        1,
        1,
        2
    );
