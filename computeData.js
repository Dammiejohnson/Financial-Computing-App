
const computeData = (request)=> {
    let requestCopy = request
    let response = {}
    response.ID = request.ID

    let money = requestCopy.Amount
    let array = []

    let idArray = []
    for(let entity in requestCopy["SplitInfo"]){
        let data = requestCopy["SplitInfo"][Number(entity)]
        if(data["SplitType"]==="FLAT"){
            let value = data["SplitValue"]
            let bot = {SplitEntityId:data["SplitEntityId"], Amount:value}
            array.push(bot)
            money -= data["SplitValue"]
            idArray.push(data["SplitEntityId"])
        }
    }

    requestCopy["SplitInfo"] = requestCopy["SplitInfo"].filter(each => !idArray.includes(each["SplitEntityId"]))
    idArray = []

    for(let entity in requestCopy["SplitInfo"]){
        let data = requestCopy["SplitInfo"][parseInt(entity)]
        if(data["SplitType"]==="PERCENTAGE"){
            let value = (parseInt(data["SplitValue"]) /100) * money
            let bot = {SplitEntityId:data["SplitEntityId"], Amount:Number(value)}
            array.push(bot)
            money -= value
            idArray.push(data["SplitEntityId"])
        }
    }

    requestCopy["SplitInfo"] = requestCopy["SplitInfo"].filter(each => !idArray.includes(each["SplitEntityId"]))
    idArray = []

    const currentBalance = money
    let total = 0
    for(let entity in requestCopy.SplitInfo){
        total += parseInt(requestCopy.SplitInfo[parseInt(entity)]["SplitValue"])
    }

    for(let entity in requestCopy.SplitInfo){
        let data = requestCopy.SplitInfo[parseInt(entity)]
        if(data["SplitType"]==="RATIO"){
            let value = (parseInt(data["SplitValue"])/total)*currentBalance
            array.push({SplitEntityID:data.SplitEntityId, Amount:Number(value)})
            money -= value
            idArray.push(data.SplitEntityId)
        }
    }

    response.Balance = money
    response.SplitBreakDown = array

    return response
}

module.exports = computeData