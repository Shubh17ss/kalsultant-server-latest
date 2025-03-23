const pool = require('../Database/connect');


const getSlots = (req, res) => {
    const { date } = req.body;
    pool.query('SELECT count(id) from sessions where session_date=$1 AND (session_slot is NOT NULL OR proposed_slot is NOT NULL) ', [date], (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Internal server error' });
            return;
        }
        else {
            // reached maximum handling capacity for the day
            let count = result.rows[0].count;
            if (Number(count) === 6) {
                res.status(300).json({ message: 'Maximum capacity of 6 slots reached for the day' });
                return;
            }
            else {
                pool.query('SELECT slot from slots where date=$1 AND booked is not true order by slot', [date], (error, results) => {
                    if (error) {
                        res.status(400).send('Internal Server Error');
                    }
                    else {
                        res.status(200).json({ results: results.rows });
                    }
                })
            }

        }
    })
}

const addSlot = (req, res) => {
    const { date, slot } = req.body;
    pool.query('INSERT INTO SLOTS(DATE, SLOT) VALUES($1,$2)', [date, slot], (error, results) => {
        if (error) {
            res.status(400).send('Internal Server Error');
        }
        else {
            res.status(200).json({ message: 'Slot created Successfully' });
        }
    })
}
module.exports = {
    getSlots,
    addSlot,
}