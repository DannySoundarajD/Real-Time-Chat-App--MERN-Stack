const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoute = require("./Routes/userRoute")
const chatRoute = require("./Routes/chatRoute")
const messageRoute = require("./Routes/messageRoute")

const app = express()
require("dotenv").config()

app.use(express.json())
app.use(cors())
app.use("/api/users", userRoute)
app.use("/api/chats", chatRoute)
app.use("/api/messages", messageRoute)

app.get("/", (req,res) =>{
    res.send("Welcome to our chatapp APIs...")
})

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI ;

app.listen(port, (req,res) => {
    console.log(`Server running on prt : ${port}npm i nodemon`)
})


app.use(cors({
    origin: "http://localhost:5173", // Allow requests from your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If your requests include cookies
}));

mongoose.connect(uri,   {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connection established")).catch((error) => console.log("MongoDB connection failed: ",error.message))