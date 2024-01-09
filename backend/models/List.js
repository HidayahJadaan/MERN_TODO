const mongoose =  require('mongoose');

const listSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    body:{
        type: String,
        require: true,
    },

    user: [{
        type: mongoose.Types.ObjectId,
        ref:'User'
    }]
});

module.exports = mongoose.model("List", listSchema);
