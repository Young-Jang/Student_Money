pragma solidity ^0.5.0;

contract newUniv{

    string univName;
    uint representativeNum;
    address payable admin;
    uint32 addressCount = 0;

    // 웹에서 보내는 정보를 토대로 스마트 컨트랙트를 배포할 것이기 때문에 인자를 받아와야 한다
    constructor(string memory _UnivName, uint _representativeNum, address payable _sender) public {
        univName = _UnivName;
        representativeNum = _representativeNum;
        admin = _sender;
    }

    struct Vote {
        string agenda;
        bool ing;
        uint votingCnt;
        uint agreeCnt;
        uint timeStamp;
        bool pass;
        uint amount;
    }
    
    Vote vote;

    struct Executive {
        address studentAddress;
        mapping(string => bool) checkVote;
    }
    
    mapping(address => Executive) inExecutives;
    mapping(address => bool) isExecutives;

    modifier onlyExecutives(address sender) {
        require(isExecutives[sender] == true);
        _;
    }
    
    function addAddress(address _studentAddress) public {
        require(representativeNum > addressCount);
        addressCount++;
        Executive memory newExecutive;
        newExecutive.studentAddress = _studentAddress;
        inExecutives[_studentAddress] = newExecutive;
        isExecutives[_studentAddress] = true;
    }
    
    function createVote(string memory _votingAgenda, address _sender, uint _amount) public onlyExecutives(_sender) {
        vote.agenda = _votingAgenda;
        vote.ing = true;
        vote.timeStamp = now;
        require(getUnivBalance() > _amount);
        vote.amount=_amount;
    }
    
    function getsender() public view returns(address){
        return msg.sender;
    }
        
    function doVote(bool _agree, address _sender) public onlyExecutives(_sender){
        require(!inExecutives[_sender].checkVote[vote.agenda] && vote.ing);
        vote.votingCnt++;
        inExecutives[_sender].checkVote[vote.agenda]=true;
        if(_agree) {
            vote.agreeCnt++;
        }
    }
    
    function updateVote() public { //새로고침 => 투표 종료
        if(now > vote.timeStamp) {
            vote.ing = false;
        }
        if(vote.agreeCnt * 3 > vote.votingCnt * 2) {
            vote.pass = true;
        }
        
    }
    
    function getVoteRes() public view returns(uint, uint, uint) {
        return (vote.agreeCnt, vote.votingCnt, vote.amount);
    }
    
    function deposit(address _sender) public payable{
        require(_sender == admin);
    }
        
    function getUnivBalance() public view returns (uint) {
        return address(this).balance;
    }

    function transfer(address _sender) public {
        require(vote.pass);
        require(_sender == admin);
        require(getUnivBalance() > vote.amount);
        require(admin != address(0));
        admin.transfer(vote.amount);
    }

    string[] ipfsImages;
    uint ipfsImgCnt=0;
    
    function registerImage(string memory _hash) public { 
        ipfsImages.push(_hash);
        ipfsImgCnt++;
    }

    function getImage(uint _i) public view returns(string memory) { 
        return ipfsImages[_i];
    }

    function getIpfsCnt() public view returns(uint) { 
        return (ipfsImgCnt);
    }
}