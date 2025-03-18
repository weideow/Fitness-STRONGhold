CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  hashed_password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'client'
	);
  
  DROP TABLE if exists users cascade;

UPDATE users SET role = 'admin' WHERE user_id = 1;
UPDATE users SET role = 'trainer' WHERE user_id = 2;

ALTER TABLE bookings
ADD COLUMN lesson_name VARCHAR(100),
ADD COLUMN available_date DATE,
ADD COLUMN available_time TIME;

ALTER TABLE bookings
DROP COLUMN status;

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
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE  -- trainer ID
);
  
  
  
  
  
  
  









