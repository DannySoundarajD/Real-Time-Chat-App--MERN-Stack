const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {type: String,required: true, minlength: 3, maxlength: 30},
    email: {type: String, require: true, minlength: 3, malength: 200, unique: true},
    password: {type: String, require: true, minlength: 3, malength: 1024},
},
{
     timestamps: true,
}
);

const userModel = mongoose.model("User", userSchema)

module.exports = userModel;