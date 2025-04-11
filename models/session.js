const mongoose=require('mongoose');

const sessionSchema=new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    contactNumber:{type:String, required:true},
    dob:{type:String, required:true},
    tob:{type:String, required:true},
    pob:{type:String, required:true},
    gender:{type:String, required:true},
    session_date:{type:String, required:true},
    slot:{type:String, required:true},
    status:{type:String, required:true, default:'Unpaid'},
    creationDate:{type:Date, required:false, default:Date.now}
})

const Session=mongoose.model('Session',sessionSchema);
module.exports=Session;