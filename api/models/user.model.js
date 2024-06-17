import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
      username : {
         type: String,
         required: true,
         unique: true
      },
      email : {
        type: String,
        required: true,
        unique: true
      },
      role : {
        type: String,
        required: true
      },
      name : {
        type: String,
        required : true
      },
      phone: {
        type: Number,
        required: true,
        unique: true
      },
      address : {
        type: String,
        required: true
      },
      password : {
        type: String,
        required: true 
      }
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);

/*
user_id: Unique identifier for the user (Primary Key)
username: Username of the user
password_hash: Hashed password of the user
email: Email address of the user
role: Role of the user (e.g., 'customer', 'merchant', 'admin')
name: Full name of the user
phone: Phone number of the user
address: Address of the user
created_at: Timestamp of when the user account was created
updated_at: Timestamp of when the user updated account.
*/

export default User;