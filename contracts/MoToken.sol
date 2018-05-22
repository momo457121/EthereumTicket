pragma solidity ^0.4.23;
import "./ERC20Token.sol";


contract MoToken is ERC20Token {
    
    string public mName;               
    uint8 public mDecimals;             
    string public mSymbol;               
    string public version = "1.0.0";
    address public tokenOwner;

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    
    constructor(uint256 _initialAmount, string _tokenName, uint8 _decimalUnits, string _tokenSymbol) public {
        tokenOwner = msg.sender;
        mBalance[msg.sender] = _initialAmount; 
        mTotalSupply = _initialAmount; 
        mName = _tokenName;   
        mDecimals = _decimalUnits;  
        mSymbol = _tokenSymbol;        
    }
    
    
    function refund(address buyer, uint _value) public {
        checkBalaceOverhead(buyer, _value);
        
        require(mBalance[tokenOwner] >= _value);
        
        mBalance[buyer] += _value;   
        mBalance[tokenOwner] -= _value;
        emit Transfer(tokenOwner, buyer, _value); 
    }
    
    function payment(address buyer, uint _value) public {
        checkBalaceOverhead(tokenOwner, _value);
        
        require(mBalance[buyer] >= _value);
        
        mBalance[tokenOwner] += _value;   
        mBalance[buyer] -= _value;
        emit Transfer(buyer, tokenOwner, _value); 
    }
    
    function transferWithApprove(address _from, address _to, uint _value) public {
        checkBalaceOverhead(_to, _value);
        
        mAlloweValue[_from][_to] = _value;
        emit Approval(_from, _to, _value);
        uint256 allowance = mAlloweValue[_from][_to];
        require(_to != address(0));
        require(mBalance[_from] >= _value);
        require(allowance >= _value);
        
        mBalance[_to] += _value;
        mBalance[_from] -= _value;
        mAlloweValue[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
    }
    
    function checkBalaceOverhead(address owner, uint _value) view private returns(bool) {
        uint256 quota = MAX_UINT256 - mBalance[owner];
        require(quota > _value);
        return true;
    }
}