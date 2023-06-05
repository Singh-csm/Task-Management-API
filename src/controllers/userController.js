const userModel = require("../models/userModel");

const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const secret_key = process.env.secret_key;


 const signin = async (req, res) => {
    const {email, password} = req.body;
    try {
        const userExist = await userModel.findOne({ email });
        if(!userExist) return res.status(404).send({ status:false, message:"User does not exist"});

        const isPasswordMatch = await bcrypt.compare(password, userExist.password);
        if(!isPasswordMatch) return res.status(404).send({ status:false, message:"Password does not match"});

        const token = jwt.sign({ email: userExist.email, id: userExist.id}, "secret_key", { expiresIn: "1h"})

        return res.status(200).send({ status: 'Success', result: userExist, token: token });
    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong!"})
    }
};


 const signup = async (req, res) => {
    const { userName, email, password, role } = req.body;
    try {
        const userExist = await userModel.findOne({ email });
        if(userExist) return res.status(400).send({ status: false, message:"User already exists"});

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = await userModel.create({ userName ,email, password: hashPassword, role });

        const token = jwt.sign({ email: newUser.email, id: newUser._id}, "secret_key", { expiresIn: "1h"});

        return res.status(201).send({ newUser, token })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: "Something went wrong!"})
    }
}

module.exports = { signin, signup }