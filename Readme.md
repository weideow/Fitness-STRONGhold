**Fitness Tracking App (PERN Stack)**
Overview
This is a fitness tracking web application built with the PERN stack (PostgreSQL, Express.js, React, Node.js). The app allows users (trainees) to see available workout options, vote on them, and track their workout history. Trainers or admins can upload upcoming workout sessions and monitor the popularity of different workouts.

**Features**
Trainee Features
View Available Workouts: Trainees can view a list of upcoming workouts categorized into Strength, Cardio, and Circuit.
Vote on Workouts: Trainees can vote for workouts they would like to do, influencing future training sessions.
Workout History: Trainees can review the history of their past workouts to track progress and avoid overtraining or neglecting certain muscle groups.
Admin/Trainer Features
Upload Workouts: Admins can upload a list of upcoming workouts for the next training session, categorized by type (Strength, Cardio, Circuit).
Workout Categories & Calorie Info: Each workout is categorized and includes a gauge of estimated calories burned.
View Workout Popularity: Admins can see which workouts are most popular based on user votes and bookings.

**User Stories**
As a Trainee
View Workout Choices: As a user, I wish to be able to see the choice of workouts, and then vote on them.
See Upcoming Workouts: As a user, I would like to know what the upcoming workouts are.
Review Workout History: Users should also be able to review the history of workouts from previous classes. This allows them to track their focus on muscle groups and ensure a balanced fitness routine.
As a Trainer/Admin
Upload Upcoming Workouts: As an admin, I want to be able to upload a list of workouts for the following training session. These workouts will be categorized into Strength, Cardio, and Circuit.
Include Calorie Burn Info: Each workout should include a gauge of calories burned to help trainees understand their workout intensity.
View Workout Popularity: As an admin, I would like to be able to see which workouts are popular, as booked by users.

**Stretch Goals**
User Profiles: Allow users to create and maintain profiles that track their individual fitness progress, including metrics such as weight, body measurements, and workout goals.
Workout Recommendations: Implement a recommendation system that suggests workouts based on the user's preferences and history.
Social Features: Allow users to add friends and share their workouts, progress, or achievements with others.
Workout Feedback: Allow users to provide feedback or rate individual workouts after completing them, which will help improve future workout sessions.
Mobile App: Develop a mobile app version of the platform to allow users to access their workouts and vote on them easily on the go.
Learning Journey
Learning PostgreSQL & Beekeeper Studio
Working on this project was a fantastic learning experience, particularly with PostgreSQL and Beekeeper Studio. Moving from MongoDB (which I was more familiar with) to PostgreSQL presented several challenges but also provided many learning opportunities.

Database Structure: PostgreSQL’s relational nature meant I had to carefully plan and normalize the database schema. This was a shift from MongoDB’s more flexible, document-based structure.
SQL Queries: Writing SQL queries, especially JOINs, was a new challenge compared to MongoDB's aggregation framework. Understanding the relationships between tables and optimizing queries was crucial for performance.
Using Beekeeper Studio: Beekeeper Studio was a great tool for interacting with the PostgreSQL database. However, it took some time to get used to the interface and effectively manage the database. The tool made it easier to visualize data and run queries.
Handling Dates: Implementing a system to allow for appointment bookings, especially for workouts, was tricky. Managing and manipulating dates in PostgreSQL, including handling timezone conversions, was not as straightforward as I expected. Ensuring data integrity and scheduling conflicts were other challenges.


*Technologies Used*
Frontend: React, React Router
Backend: Node.js, Express.js
Database: PostgreSQL
Admin Tool: Beekeeper Studio
Authentication: JWT for user login and session management


