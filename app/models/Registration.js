import mongoose from 'mongoose';

const ITDregistrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    barcode: {
        type: String,
        required: [true, 'Barcode is required'],
        validate: {
            validator: function (v) {
                return v.length === 8;
            },
            message: props => 'Barcode must be exactly 8 characters!'
        }
    },
    gender: {
        type: String,
        required: false,
    },
    class: {
        type: String,
        enum: ['SSS', 'JSS', 'Teacher', 'Principal'],
        default: 'JSS',
        required: false,
    },
    member: {
        type: String,
        enum: ['YES', 'NO'],
        default: 'YES',
        required: false,
    },
}, {
    timestamps: true,
});

const ITDRegistration = mongoose.models.ITDRegistration || mongoose.model('ITDRegistration', ITDregistrationSchema);

export default ITDRegistration; 