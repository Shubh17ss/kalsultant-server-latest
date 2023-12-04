const pool = require('../Database/connect');


const getSlots=(req,res)=>{
    const {date}=req.body;
    console.log(date);
    pool.query('SELECT slot from slots where date=$1',[date],(error,results)=>{
        if(error){
            res.status(400).send('Internal Server Error');
        }
        else
        {
            res.status(200).json({results:results.rows});
        }
    })
}

const addSlot=(req,res)=>{
    const {date,slot}=req.body;
    pool.query('INSERT INTO SLOTS(DATE, SLOT) VALUES($1,$2)',[date,slot],(error,results)=>{
        if(error){
            res.status(400).send('Internal Server Error');
        }
        else
        {
            res.status(200).json({message:'Slot created Successfully'});
        }
    })
}

module.exports={
    getSlots,
    addSlot,
    
}