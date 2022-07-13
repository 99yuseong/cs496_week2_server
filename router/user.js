const express = require("express");
const { find, findOne } = require("../schema/User");
const router = express.Router();

const User = require('../schema/User')

router.post("", async (req, res) => {
    console.log('First Access')
    let { id, nickname, profileUrl } = req.body
    let user

    user = await User.findOne({ id: id })

    if(!user) {
        console.log("New User")
        let userModel = new User()
        userModel.id = id
        userModel.name = nickname
        userModel.room = " "
        userModel.imgUrl = profileUrl
        userModel.friends = []
        userModel.running = []
        userModel.group = []
        user = await userModel.save()
    } else {
        console.log("Existing User")
    }
    
    console.log(user)
    return res.status(200).json(user)
})

router.get("/search_name", async (req, res) => {
    console.log('Search Name')
    // console.log(req.query)
    let { myId, searchName } = req.query

    let users, me

    try {
        me = await User.findById(myId)
        users = await User.find({ name: {$regex: searchName}})
        users = users.filter(user => user._id != myId && !(me.friends.includes(user._id)))
    } catch (err) {
        return res.status(500).json({
            message: err 
        })
    }

    return res.status(200).json(users)
})

router.get("/search_friend_name", async (req, res) => {
    console.log('Search Friend Name')
    let { myId, searchName } = req.query

    let users, me

    try {
        me = await User.findById(myId).populate({
            path: 'friends',
            match: {
                name: {$regex: searchName}
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: err 
        })
    }

    return res.status(200).json(me.friends)
})

router.get("/add_friend", async (req, res) => {
    const { myId, inviteId } = req.query;

    let user
    let friend
    
    try{
        user = await User.findById(myId)
        friend = await User.findById(inviteId)
    } catch(err) {
        res.status(500).json({
            message: err 
        })
    }

    user.friends.push(friend._id)
    friend.friends.push(user._id)
    await user.save()
    await friend.save()

    return res.status(200).json({
        message: friend._id
    })
})

router.get("/friends", async (req, res) => {
    const { id } = req.query
    let user = await User.findById(id).populate("friends")
    console.log(user.friends)
    res.status(200).json(user.friends)
})

module.exports = router