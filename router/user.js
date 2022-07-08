const express = require("express");
const router = express.Router();

const User = require('../schema/User')

router.post("", async (req, res) => {
    console.log('First Access')
    let { id, nickname, profileUrl } = req.body
    let user

    try {
        user = await User.findOne({ id: id })
    } catch (err) {
        res.status(500).json({
            message: err 
        })
    }

    if(!user) {
        console.log("New User")
        let userModel = new User()
        userModel.id = id
        userModel.name = nickname
        userModel.imgUrl = profileUrl
        userModel.friend = []
        userModel.running = []
        userModel.group = []

        try {
            user = await userModel.save()
        } catch (err) {
            res.status(500).json({
                message: err 
            })
        }
    } else {
        console.log("Existing User")
    }
    
    console.log(user)
    res.status(200).json(user)

})

router.get("/search_name", async (req, res) => {
    console.log('Search Name')
    let { name: searchName } = req.query
    console.log(searchName)

    let users

    try {
        users = await User.find({ name: {$regex: searchName}})
    } catch (err) {
        res.status(500).json({
            message: err 
        })
    }

    console.log(users)
    res.status(200).json(users)
})

router.post("/search_name", async (req, res) => {
    const { name } = req.body;
})

module.exports = router