const express = require('express')
const app = express()
const router = express.Router()
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())
app.use('/', router)

const computeData = require('./computeData')

router.get('/', (req, res)=>{
    res.send("Stuff")
})

router.post("/splits-payment/compute", (req, res)=>{

    const {ID, Amount, SplitInfo} = req.body
    const result = computeData({ID, Amount, SplitInfo})
    res.status(200).send(result)
})


app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server listening in on port 3000...')
})