function requestMoney() {
    var tokenContract = web3.eth.contract(tokenAbi);
    var tokenSystem = tokenContract.at(tokenAddr);

    tokenSystem.refund( currentAccountAddr, 200 ,function(error, result){
        waitForReceipt(result, function(receipt) {
            if (receipt.status == 1) {
                console.log("transcation success");
                balance();
            } else {
                console.log("transcation fail");
            }
        });
        // resultText = result;
    });
}

function balance() {
    var tokenContract = web3.eth.contract(tokenAbi);
    var tokenSystem = tokenContract.at(tokenAddr);

    tokenSystem.balanceOf(currentAccountAddr ,function(error, result){
        document.getElementById('balancetext').textContent = result;
    });
}