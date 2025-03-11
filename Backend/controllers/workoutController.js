const {pool} = require('../config/database');

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

