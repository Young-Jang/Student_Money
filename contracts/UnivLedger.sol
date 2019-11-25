pragma solidity ^0.5.0;

import './newUniv.sol';

contract UnivLedger{

    address payable owner;
    uint entryFee = 1 ether;
    uint representativeNum; // (학생회 + 총학 대표들) 수

    address[] private studentAddresses;

    // 자격 가진 사람 아니면 못하는 modifier
    mapping(address => newUniv) UnivAddToInfo;
    mapping(string => address) UnivNameToAdd;

    modifier onlyRegisterUniv(address _univAdd) {
        require(address(UnivAddToInfo[_univAdd])!=address(0));
        _;
    }

    // 웹에서 보내는 정보를 토대로 스마트 컨트랙트를 배포할 것이기 때문에 인자를 받아와야 한다
    constructor() public {
        owner=msg.sender;
    }

    function registerUniv(string memory _UnivName, uint _representativeNum) public payable {
        require(msg.value>=entryFee);
        newUniv univ = new newUniv(_UnivName, _representativeNum, msg.sender);
        UnivAddToInfo[address(univ)] = univ;
        UnivNameToAdd[_UnivName] = address(univ);
    }
    
    
    
    function getUnivAddress(string memory _UnivName) public view returns(address) {
        return UnivNameToAdd[_UnivName];
    }
    
    function child_deposit(address _univAdd) public onlyRegisterUniv(_univAdd) {
        UnivAddToInfo[_univAdd].deposit(msg.sender);
    }

    //학생회 + 단과대 대표들 계좌 주소 받는 함수!
    function child_addAddress(address _univAdd, address _studentAddress) public onlyRegisterUniv(_univAdd){
        UnivAddToInfo[_univAdd].addAddress(_studentAddress);
    }

    // function getUnivBalance() public view returns (uint) {
    //     return address(this).balance;
    // }

    function child_createVote(address _univAdd, string memory _votingAgenda, uint _amount) public onlyRegisterUniv(_univAdd) {
        UnivAddToInfo[_univAdd].createVote(_votingAgenda, msg.sender, _amount);
    }

    function child_doVote(address _univAdd, bool _agree) public onlyRegisterUniv(_univAdd) {
        UnivAddToInfo[_univAdd].doVote(_agree, msg.sender);
    }

    function child_updateVote(address _univAdd) public onlyRegisterUniv(_univAdd) {
        UnivAddToInfo[_univAdd].updateVote();
    }

    function child_transfer(address _univAdd) public onlyRegisterUniv(_univAdd){
        UnivAddToInfo[_univAdd].transfer(msg.sender);
    }
    
    function child_voteRes(address _univAdd) public view onlyRegisterUniv(_univAdd) returns(uint,uint,uint){
       return UnivAddToInfo[_univAdd].getVoteRes();
    }
    
    function getadd(address _univAdd) public view returns(address){
        return UnivAddToInfo[_univAdd].getsender();
    }
    
    function child_registerImage(address _univAdd, string memory _hash) public onlyRegisterUniv(_univAdd) {
        UnivAddToInfo[_univAdd].registerImage(_hash);
    }
    
    function child_getImage(address _univAdd, uint _i) public view onlyRegisterUniv(_univAdd) returns (string memory) {
        return UnivAddToInfo[_univAdd].getImage(_i);
    }
    
}