const express = require("express");
const router = express.Router();
const multer  = require('multer')
const Running = require('../schema/Running')
const User = require('../schema/User')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, req.body.runningId + ".jpg")
    }
  })

const upload = multer({ storage: storage })

router.post("/create_running", async (req, res) => {
    let runningData = req.body
    console.log(runningData)

    let runningModel = new Running()
    runningModel.user = runningData.user
    runningModel.startDate = runningData.startDate
    runningModel.endDate = runningData.endDate
    runningModel.path = runningData.path
    runningModel.time = runningData.time
    runningModel.dist = runningData.dist
    runningModel.avgPace = runningData.avgPace
    runningModel.subDist = runningData.subDist


    console.log(runningModel.startDate)
    console.log(runningData.startDate)
    let newRunning = await runningModel.save()
    let user = await User.findOne({_id : runningData.user})

    user.running.push(newRunning._id)
    await user.save()

    // console.log(runningData)
    res.status(200).json({
        message: newRunning._id
    })
})

router.get("/get_data", async (req, res) => {
    let userid = req.query.id

    let user = await User.findById(userid).populate("running")
    let newRunningList = user.running

    // console.log(newRunningList)
    res.status(200).json(newRunningList)

})

router.get("/get_each_data", async (req, res) => {
    let {id, position} = req.query
    console.log(id, position)
    let user = await User.findById(id).populate("running")
    let running = user.running[position]
    console.log(running)
    res.status(200).json(running)
})

router.get("/filter_data", async (req, res) => {
    let { id } = req.query

    let curDate = new Date()

    let user = await User.findById(id).populate({
        path: 'running',
        match: {
            startDate : { $gte: curDate.setDate(curDate.getDate()-7)}
        }
    })
    console.log(user.running)
    res.status(200).json(user.running)
})

const cpUpload = upload.fields([{ name: 'runningId'}, { name: 'imageFile'}])
router.post("/running_image_upload", cpUpload, async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    // console.log(req.files['runningId'][0])
})

module.exports = router