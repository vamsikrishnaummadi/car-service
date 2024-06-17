import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    merchant_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service_name : {
        type: String,
        required: true,
        trim : true
    },
    description :{
        type: String,
        required: true,
        trim: true
    },
    price :{
         type: Number,
         required: true
    },
    duration: {
        type: String,
        required: true
    },
    created_at : {
        type: Date,
        default : Date.now
    },
    updated_at : {
        type: Date,
        default: Date.now
    }
});

const Service = mongoose.model('Service', ServiceSchema);

export default Service;