const mongoose = require('mongoose');

const HospitalsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        uniqe: true,
        trim: true,
        maxlenght: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add an postalcode'],
        maxlenght: [5, 'Postal Code can not be more than 5 digits']
    },
    tel: {
        type: String
    },
    region: {
        type: String,
        required: [true, 'Please add a region']
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Reverse populate with virtuals
HospitalsSchema.virtual('appointments',{
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'hospital',
    justOne: false
});

//Cascade delete poopintments when a hospital is deleted
HospitalsSchema.pre('deleteOne', {document:true, query:false}, async function(next){
    console.log(`Appointments being removed from hospital ${this._id}`);
    await this.model('Appointment').deleteMany({hospital: this._id});
    next();
});

module.exports = mongoose.model('Hospital', HospitalsSchema);