const {pool} = require('../config/database');

//all workouts
const getWorkouts = async(req, res) => {
    try {
        const result = await pool.query(
            'SELECT w.workout_id, w.workout_name, w.calories_burnt, w.description, wc.category_name, u.user_name AS trainer.name' + 
            'FROM workouts w ' +
            'JOIN workout_categories wc ON w.category_id = wc.category_id' +
            'JOIN users u ON w.user_id = u.user_id'
        );
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const createWorkout = async(req,res) => {
    const {category_id, workout_name, calories_burnt, description} = req.body;
    const trainerId = req.user_id;

    try {
        const result = await pool.query(
            `INSERT INTO workouts (category_id, workout_name, calories_burnt, description, trainer_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING workout_id, workout_name, calories_burnt, description, trainer_id, category_id`,
             [category_id, workout_name, calories_burnt, description, trainerId]
        );

        

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};
