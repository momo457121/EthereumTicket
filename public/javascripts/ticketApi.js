function liveOpen(showName, seatCount, seatCost) {
    var mContract = web3.eth.contract(contractAbi);
    var ticketSystem = mContract.at(contractAddr);

    var seatArray = generateSeatArray(seatCount);
    var blockArray = generateArray(seatCount, 1);
    var costArraty = generateArray(seatCount, seatCost);

    ticketSystem.liveOpen(showName, seatArray, blockArray, costArraty, function(error, result){
        if (!error) {
            $("#loadingLayout").css("visibility", "visible");
            waitForReceipt(result, function(receipt) {
                $("#loadingLayout").css("visibility", "hidden");
                if (receipt.status == 1) {
                    console.log("transcation success");
                    $("#infoContent").empty().append(function(){return setupLives(liveJson);});
                } else {
                    console.log("transcation fail");
                }
            });
        } else {
            $("#loadingLayout").css("visibility", "hidden");
            console.log("error : " + error);
        }
    });
}

function buyTicket(showId, showName, seatId) {
    document.getElementById("myDropdown_"+seatId).classList.remove("show");
    document.getElementById("myDropdown_"+seatId).click();

    var mContract = web3.eth.contract(contractAbi);
    var ticketSystem = mContract.at(contractAddr);

    ticketSystem.buy(showName, seatId, function(error, result){
        if (!error) {
            $("#loadingLayout").css("visibility", "visible");
            waitForReceipt(result, function(receipt) {
                $("#loadingLayout").css("visibility", "hidden");
                if (receipt.status == 1) {
                    console.log("transcation success");
                    document.getElementById('seat_'+ seatId).style.backgroundColor = "#ee7744";
                    liveJson[showId].seat[seatId].state = "Buy";
                    liveJson[showId].seat[seatId].owner = currentAccountAddr;
                    window.localStorage["liveJson"] = JSON.stringify(liveJson);
                } else {
                    console.log("transcation fail");
                }
            });
        } else {
            console.log("error : " + error);
        }
    });
}

function refundTicket(showId, showName, seatId) {
    document.getElementById("myDropdown_"+seatId).classList.remove("show");
    document.getElementById("myDropdown_"+seatId).click();

    var mContract = web3.eth.contract(contractAbi);
    var ticketSystem = mContract.at(contractAddr);

    ticketSystem.refund(showName, seatId, function(error, result){
        if (!error) {
            $("#loadingLayout").css("visibility", "visible");
            waitForReceipt(result, function(receipt) {
                $("#loadingLayout").css("visibility", "hidden");
                if (receipt.status == 1) {
                    console.log("transcation success");
                    document.getElementById('seat_'+ seatId).style.backgroundColor = "#3498DB";
                    liveJson[showId].seat[seatId].state = "";
                    liveJson[showId].seat[seatId].owner = currentAccountAddr;
                    window.localStorage["liveJson"] = JSON.stringify(liveJson);
                } else {
                    console.log("transcation fail");
                }
            });
        } else {
            console.log("error : " + error);
        }
    });
}

function getSeatState(showName, seatId) {
    var mContract = web3.eth.contract(contractAbi);
    var ticketSystem = mContract.at(contractAddr);

    ticketSystem.SeatInfo(showName, seatId, function(error, result){
        if (!error) {
            console.log("seat showName : " + result[0]);
            console.log("seat cost : " + result[1]);
            console.log("seat block : " + result[2]);
            console.log("seat id : " + result[3]);
            console.log("seat owner : " + result[4]);
            console.log("seat release : " + result[5]);
        } else {
            console.log("error : " + error);
        }
    });
}

function tradeOwner(showId, showName, seatId) {
    document.getElementById("myDropdown_"+seatId).classList.remove("show");
    document.getElementById("myDropdown_"+seatId).click();

    var mContract = web3.eth.contract(contractAbi);
    var ticketSystem = mContract.at(contractAddr);

    ticketSystem.tradeOwner(showName, seatId, function(error, result){
        if (!error) {
            $("#loadingLayout").css("visibility", "visible");
            waitForReceipt(result, function(receipt) {
                $("#loadingLayout").css("visibility", "hidden");
                if (receipt.status == 1) {
                    console.log("transcation success");
                    document.getElementById('seat_'+ seatId).style.backgroundColor = "#ee7744";
                    liveJson[showId].seat[seatId].state = "Buy";
                    liveJson[showId].seat[seatId].owner = currentAccountAddr;
                    window.localStorage["liveJson"] = JSON.stringify(liveJson);
                } else {
                    console.log("transcation fail");
                }
            });
        } else {
            console.log("error : " + error);
        }
    });
}

function release(showId, showName, seatId) {
    document.getElementById("myDropdown_"+seatId).classList.remove("show");
    document.getElementById("myDropdown_"+seatId).click();

    var mContract = web3.eth.contract(contractAbi);
    var ticketSystem = mContract.at(contractAddr);

    ticketSystem.release(showName, seatId, true, function(error, result){
        if (!error) {
            $("#loadingLayout").css("visibility", "visible");
            waitForReceipt(result, function(receipt) {
                $("#loadingLayout").css("visibility", "hidden");
                if (receipt.status == 1) {
                    console.log("transcation success");
                    document.getElementById('seat_'+ seatId).style.backgroundColor = "#F781D8";
                    liveJson[showId].seat[seatId].state = "Release";
                    liveJson[showId].seat[seatId].owner = currentAccountAddr;
                    window.localStorage["liveJson"] = JSON.stringify(liveJson);
                } else {
                    console.log("transcation fail");
                }
            });
        } else {
            console.log("error : " + error);
        }
    });
}

function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function(error, receipt){
        if (error) {
            return error;
        }
        
        if (receipt != null) {
            if (cb != null) {
                cb(receipt);
            }
        } else {
            window.setTimeout(function() {
                waitForReceipt(hash, cb);
            }, 1000);
        }
    });
}

function generateSeatArray(count) {
    var array = [];
    for(var i=0; i<count; i++) {
        array.push(i);
    }
    return array;
}

function generateArray(count, value) {
    var array = [];
    for(var i=0; i<count; i++) {
      array.push(value);
    }
    return array;
}