import mongoose from "mongoose";

const schema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    parentId:{
        type:String,
   
    },
    children:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread'
    }],
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    }
 
},{
    timestamps:true
});
const Thread = mongoose.models.Thread || mongoose.model("Thread", schema);

export default Thread;
