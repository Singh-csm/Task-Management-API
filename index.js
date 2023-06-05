const express = require("express");
const mongoose = require("mongoose");
const route = require("./src/routes/userRoute")
const dotenv = require("dotenv")
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI, {useNewUrlParser: true})
.then(()=>console.log("MongoDB is Connected..."))
.catch(err=>console.log(err))
app.use("/", route)

app.get("/*", (req, res)=>{
    res.status(404).send({status:false, message:"Not Found"});
})

app.listen(PORT, ()=>{
    console.log(`Listening on PORT: ${PORT}...`);
})