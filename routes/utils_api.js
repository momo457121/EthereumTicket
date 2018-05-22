const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

const default_gasPrice = '5000000000';

module.exports = {
    deployContract: function(web3, userAddress, user_privateKey, abi, byteCode) {        
        var addWallet = web3.eth.accounts.wallet.add({
            privateKey: user_privateKey,
            address: userAddress
        });

        var mContract = new web3.eth.Contract(abi,
            {
                from: userAddress, // default from address
            });

        mContract.deploy({
                data: '0x' + byteCode,
                arguments:[9999, 'MoTokenX', 10, 'MOE']})
            .estimateGas({from: userAddress})
            .then(function(gasAmount) {
                console.log("gasAmount : " + gasAmount);
                mContract.deploy({
                    data: '0x' + byteCode,
                    arguments:[9999, 'MoTokenX', 10, 'MOE']})
                .send({
                    from: userAddress,
                    gas: gasAmount,
                    gasPrice: default_gasPrice
                })
                .on('error', function(error){
                    console.log('error : ',error);
                })
                .on('transactionHash', function(transactionHash){
                    console.log('transactionHash : ',transactionHash);
                })
                .on('receipt', function(receipt){
                    console.log('receipt : ' + receipt.contractAddress);
                })
                .on('confirmation', function(confirmationNumber, receipt){
                    console.log("confirmationNumber = ",confirmationNumber);
                })
                .then(function(newContractInstance){
                    console.log('newContractInstance : ' + newContractInstance.options.address); // instance with the new contract address
                });            
        });
    },
    transfer: function(web3, contractAddress, userAddress, user_privateKey, toAddr, amount, abi) {
        var addWallet = web3.eth.accounts.wallet.add({
            privateKey: user_privateKey,
            address: userAddress
        });
        var mContract = new web3.eth.Contract(abi, contractAddress,
            {
                from: userAddress, // default from address
            });
        mContract.methods.transfer(toAddr, amount).estimateGas({from: userAddress})
        .then(function(gasAmount) {
            console.log("gasAmount : " + gasAmount);
            mContract.methods.transfer(toAddr, amount).send({gas:gasAmount, from:userAddress, gasPrice:default_gasPrice})
            .on('error', function(error){
                console.log('error : ',error);
            })
            .on('transactionHash', function(transactionHash){
                console.log('transactionHash : ',transactionHash);
            })
            .on('receipt', function(receipt){
                console.log('receipt : ' + receipt.contractAddress);
            })
            .on('confirmation', function(confirmationNumber, receipt){
                // console.log("confirmationNumber = ",confirmationNumber);
            })
            .then(function(newContractInstance){
                console.log('newContractInstance : ' + newContractInstance.options.address); // instance with the new contract address
            });
        });
    },
    liveopen: function(web3, contractAddress, userAddress, user_privateKey, toAddr, amount, abi) {
        var addWallet = web3.eth.accounts.wallet.add({
            privateKey: user_privateKey,
            address: userAddress
        });
        var mContract = new web3.eth.Contract(abi, contractAddress,
            {
                from: userAddress, // default from address
            });
        
    }
};