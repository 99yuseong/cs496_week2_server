const express = require("express");
const router = express.Router();

const Running = require('../schema/Running')
const User = require('../schema/User')
const Group = require('../schema/Group')

router.get("", async (req, res) => {
    let userId = req.query.id

    let user = await User.findOne({id: userId}).populate('group')

    console.log(user.group)
    res.status(200).json(user.group)
})

router.post("/create_group", async (req, res) => {
    let { groupName, member } = req.body

    let groupModel = new Group()
    groupModel.groupName = groupName
    groupModel.member = member

    let group = await groupModel.save()

    member.map(async (userId) => {
        let user = await User.findById(userId)
        user.group.push(group._id)
        await user.save()
    })
    res.status(200).json(group)
})

router.get("/member", async (req, res) => {
    let groupId = req.query.groupId

    let group = await Group.findById(groupId).populate("member")
    
    console.log(group.member)
    res.status(200).json(group.member)
})

module.exports = router