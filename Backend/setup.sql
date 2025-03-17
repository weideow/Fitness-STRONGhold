CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  hashed_password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'client'
	);
  
  DROP TABLE if exists users cascade;

UPDATE users SET role = 'admin' WHERE user_id = 1;
UPDATE users SET role = 'trainer' WHERE user_id = <user_id>;

CREATE TABLE schedules (
  schedule_id SERIAL PRIMARY KEY,
  trainer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  lesson_name VARCHAR (100),
  available_date DATE,
  available_time TIME
  );

CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  client_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  schedule_id INT REFERENCES schedules(schedule_id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK(status IN ('pending', 'confirmed', 'canceled'))
  );
  
  
CREATE TABLE workouts (
  workout_id SERIAL PRIMARY KEY,
  workout_name VARCHAR(255) NOT NULL,
  calories_burnt INT,
  description TEXT,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE  
);

INSERT INTO schedules (trainer_id, lesson_name, available_date, available_time)
VALUES 
(1, 'HIIT Training', '2025-04-01', '09:00:00'),
(1, 'Yoga Class', '2025-04-02', '14:00:00'),
(1, 'Weight Training', '2025-04-03', '17:00:00');

INSERT INTO bookings (client_id, schedule_id, status)
VALUES 
(2, 1, 'confirmed'),
(3, 2, 'pending'),
(2, 3, 'confirmed');

INSERT INTO workouts (workout_name, calories_burnt, description, user_id)
VALUES 
('Morning Run', 450, 'A 5km run at moderate pace', 2),
('Core Workout', 300, '30 minutes of core-focused exercises', 3),
('Full Body Circuit', 550, '45 minutes circuit training with weights', 2);