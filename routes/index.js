/* jshint esversion: 6 */


var express = require('express');
var router = express.Router();
var utils = require('./utils_api.js');
const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');


const testrpcUri = 'http://localhost:8545';
const ropstenUri = 'https://ropsten.infura.io/GPUG5XEHY2DKMY9J78GF9H3KXU3S4KGVDD';

const address = '0x5346e71ba4bc7cb01540fa77212b7aa898ef8305'; // user
const ropstenuser = '0x2276a6d68093dF72fCAF3c94F301572Fa6e9DFC7';
const ropstenuser2 = '0x5b3238D0957Fb636A50B7a25cd72daA9B8464662';
const contractAddress = "0xfc0201750bea1fe708d5f62ad06f575ce663eda5";
const ticketContractAddress ="0xa283031cc0e827f0e8d2a21436546a28f321a13e";

const privatekey = '0x52dd18e2adaa0627d0dc577dd86e8d96103d44a557b435ad215ca093b8fd7fa3';

var ticket_byteCode = "";
var ticket_abi = "";
var ticket_contractData = "";

var token_byteCode = "";
var token_abi = "";
var token_contractData = "";

var web3 = new Web3(new Web3.providers.HttpProvider(ropstenUri));

compileContract();
// deployTokenContract(web3);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('eticket');
});

router.post('/api/getContractInfo', function(req, res, next){
    console.log('getContractInfo');
    // res.send(req.body);
    var contractInfo = {
        address: ticketContractAddress,
        abi: ticket_abi,
        bytecode: ticket_byteCode,
        token_address: contractAddress,
        token_abi: token_abi,
        token_byteCode: token_byteCode
    };
    res.send(contractInfo);
});

function transfer(fromAddr, from_PrivateKey, toAddr) {
    var compileSolData = compileContract();
    //console.log(compileSolData);
    if (compileSolData != "") {
        utils.transfer(web3, contractAddress, fromAddr, from_PrivateKey, toAddr, 30, ticket_abi);
    } else {
        console.log("compile log error");
    }
}

function compileContract() {
    if (ticket_contractData != "") {
        return ticket_contractData;
    } else {
        var input = {
            'ERC20Interface.sol': fs.readFileSync("./contracts/ERC20Interface.sol", "utf8"),
            'ERC20Token.sol': fs.readFileSync("./contracts/ERC20Token.sol", "utf8"),
            'MoToken.sol': fs.readFileSync("./contracts/MoToken.sol", "utf8"),
            'TicketTrade.sol': fs.readFileSync("./contracts/TicketTrade.sol", "utf8")
        };

        var contractData = solc.compile({sources: input}, 1);
        for (var contractname in contractData.contracts) {
            // console.log("compile : " + contractname);
            if (contractname == "TicketTrade.sol:TicketTrade") {
                ticket_byteCode = contractData.contracts[contractname].bytecode;
                ticket_abi = JSON.parse(contractData.contracts[contractname].interface);
            }

            if (contractname == "MoToken.sol:MoToken") {
                token_byteCode = contractData.contracts[contractname].bytecode;
                token_abi = JSON.parse(contractData.contracts[contractname].interface);
            }
        }
        return contractData;
    }
}

function deployTokenContract(web3){
    compileContract();
    if (token_abi != "" && token_byteCode != "") {
        utils.deployContract(web3, ropstenuser, privatekey, token_abi, token_byteCode);
    } else {
        console.log("compile log error");
    }
}

function deployTicketContract(web3){
    compileContract();
    if (token_abi != "", token_byteCode != "") {
        utils.deployContract(web3, ropstenuser, privatekey, ticket_abi, ticket_byteCode);
    } else {
        console.log("compile log error");
    }
}

module.exports = router;
