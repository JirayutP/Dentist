const mongoose = require('mongoose');

const DentistsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        uniqe: true,
        trim: true,
        maxlenght: [50, 'Name can not be more than 50 characters']
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Please add years of experience']
    },
    areaOfExpertise: {
      type: String,
      required: [true, 'Please add specify area of expertise']
    }
});

//Cascade delete booking when a dentist is deleted
DentistsSchema.pre('deleteOne', {document:true, query:false}, async function(next){
    console.log(`Bookings being removed from dentist ${this._id}`);
    await this.model('Booking').deleteMany({dentist: this._id});
    next();
});

module.exports = mongoose.model('Dentist', DentistsSchema);