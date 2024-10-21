const mongoose = require('mongoose');

const placeSchma = new mongoose.Schema({
    owner:mongoose.Schema.Types.ObjectId,
    title:String,
    address : String,
    description : String,
    photos:[String],
    perks:[String],
    extraInfo:String,
    checkIn:Number,
    checkOut : Number,
    maxGuests : Number,
    price : Number
});

const placeModel = mongoose.model('Place',placeSchma);

module.exports = placeModel;