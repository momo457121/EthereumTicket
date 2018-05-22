pragma solidity ^0.4.23;
import "./ERC20Interface.sol";


contract ERC20Token is ERC20Interface {
    
    uint256 constant private MAX_UINT256 = 2**256 - 1;


    uint public mTotalSupply;
    mapping (address => uint256) public mBalance;
    mapping (address => mapping (address => uint256)) public mAlloweValue;
    
    function totalSupply() public view returns (uint) {
        return mTotalSupply;
    }
    
    function balanceOf(address _address) public view returns (uint balance) {
        return mBalance[_address];
    }
    
    function transfer(address _to, uint _value) public returns (bool success) {
        uint256 quota = MAX_UINT256 - mBalance[_to];
        
        require(mBalance[msg.sender] >= _value);
        require(quota > _value);
        
        mBalance[msg.sender] -= _value;   
        mBalance[_to] += _value;
        emit Transfer(msg.sender, _to, _value); 
        return true;
    }
    
    function approve(address _to, uint _value) public returns (bool success) {
        mAlloweValue[msg.sender][_to] = _value;
        emit Approval(msg.sender, _to, _value); 
        return true;
    }
    
    function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
        uint256 quota = MAX_UINT256 - mBalance[_to];
        
        uint256 allowance = mAlloweValue[_from][msg.sender];
        require(_to != address(0));
        require(mBalance[_from] >= _value);
        require(allowance >= _value);
        require(quota > _value);
        
        mBalance[_to] += _value;
        mBalance[_from] -= _value;
        mAlloweValue[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;        
    }
    
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return mAlloweValue[_owner][_spender];
    }
}