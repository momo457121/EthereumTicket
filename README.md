# Ethereum Ticket system # 

此練習主要介紹如何入門開發簡易的Ethereum smart contract並且透過web3.js與合約進行溝通

## Smart contract 智能合約 ##

運行於區塊鍊上的程式代碼，由各節點執行，需要執行程式的人支付手續費給節點的礦工或權益人。
 * 提供程式化控制交易的內容以進行合約中所描述的相關服務
 * 透過發佈符合ERC20規定之合約即可實現基於以太鍊下的代幣交易生態
 * 合約階透過加密儲存於區塊鍊節點上並能確保未經許可不會有更改與遺失狀況

#### 0. Dev environment 開發環境 ####

 * 目前智能合約主要透過[solidity](http://solidity.readthedocs.io/en/v0.4.21/index.html)語言編寫
 * 線上編輯測試IDE開發環境可選用[Remix](https://ethereum.github.io/browser-solidity/)
 * 虛擬錢包可使用[MetaMask](https://metamask.io/) chorme套件建立虛擬錢包
 * Local環境模擬可於Remix中切換至Javascript VM或透過TestRPC達到模擬環境  參考：[TestRPC介紹文章](https://medium.com/taipei-ethereum-meetup/%E5%88%A9%E7%94%A8%E5%B7%A5%E5%85%B7%E5%8A%A0%E9%80%9Fdapp%E5%BB%BA%E7%BD%AE%E5%92%8C%E6%B8%AC%E8%A9%A6-fb08e77f208e)
 * Web app應用主要透過Nodejs/Express的架構建制
#### 1. Compiler and Deploy 編譯與發佈合約 ####
 1. 單純透過Solidity撰寫合約可透過Remix IDE搭配MetaMask進行發佈
 2. 若需後台運算並動態依照request調整合約可透過solc進行編譯

 * 安裝 [solc](https://www.npmjs.com/package/solc) (Solidity compiler)
 * 撰寫合約內容
 * compile contract
 ``` var solc = require('solc')
     var input = 'contract x { function g() {} }'
     var output = solc.compile(input, 1)
     for (var contractName in output.contracts) {
       // code and ABI that are needed by web3
       console.log(contractName + ': ' + output.contracts[contractName].bytecode)
       console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface))
     }
```
 * 合約發佈可透過web3.js進行合約發佈
 
#### 2. Web3.js 使用方式 ####
 * 目前主流使用版本分為兩種版本
   - 1.0    : [API document](https://web3js.readthedocs.io/en/1.0/index.html)
   - 0.20.x : [API document](https://github.com/ethereum/wiki/wiki/JavaScript-API)
 * 需注意版本彼此間使用方式有所差異
   例如: 合約執行結過的callback function
   
  - 1.0 版本提供listen transactionHash, receipt, confirmation等運行結果的callback function
``` 
   myContract.deploy({
    data: '0x12345...',
    arguments: [123, 'My String']
   })
   .send({
      from: '0x1234567890123456789012345678901234567891',
      gas: 1500000,
      gasPrice: '30000000000000'
   }, function(error, transactionHash){ ... })
    .on('error', function(error){ ... })
    .on('transactionHash', function(transactionHash){ ... })
    .on('receipt', function(receipt){
        console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function(confirmationNumber, receipt){ ... })
    .then(function(newContractInstance){
        console.log(newContractInstance.options.address) // instance with the new contract address
  });
``` 
  - 0.20.x 版本僅提供listen transactionHash , 其餘需自行implement query交易完成狀態
``` 
   function waitForReceipt(hash, callback) {
      web3.eth.getTransactionReceipt(hash, function(error, receipt){
        if (error) {
            return error;
        }
        
        if (receipt != null) {
            if (callback != null) {
                callback(receipt);
            }
        } else {
            window.setTimeout(function() {
                waitForReceipt(hash, callback);
            }, 1000);
        }
    });
}
```
  * 此練習中兩種web3.js版本皆有使用
    - 後端合約Compile與Deploy使用1.0版本
    - 前端合約存取使用0.20.3版本

#### 3. Access contract 合約存取 ####
  - method deploy
  ```
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
  ```
  - method transfer
  ```
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
                console.log("confirmationNumber = ",confirmationNumber);
            })
            .then(function(newContractInstance){
                console.log('newContractInstance : ' + newContractInstance.options.address); // instance with the new contract address
            });
```
## Ethereum Ticket System ##

<img src="https://github.com/momo457121/EthereumTicket/blob/master/TicketSystem.png" width="500">

#### Ticket contract ####
1. Live Open       : 發佈一場售票表演

2. Buy ticket     : 購買票券

3. Refund ticket  : 退票

4. Release ticket : 釋出票券供其他人購買

5. TradeOwner     : 購買釋出票券


 * 此練習中利用ERC20 token來完成訂票系統所需的基本功能
 * 建議安裝MetaMask錢包
 * 發佈於Ropsten Test network，使用者需MetaMask切換至Ropsten並透過buy功能免費像Ropsten索取測試用的以太幣用以支付與以太網溝通所需的gas費用
 * 初始可點選 " $ " 按鈕向後台要求獲取Token用以存取Ticket相關內容
 * 操作Ticket contract主要皆實作於前端，用以達到較為接近真正使用者透過wallet與區塊鍊溝通的情境。







 
