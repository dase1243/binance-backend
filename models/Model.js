const mongoose = require('mongoose');

const modelSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    }
    
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Models', modelSchema);