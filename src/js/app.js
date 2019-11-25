App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          await ethereum.enable()
          console.log('1Non-Ethereum browser detected.')
        } catch (error) {
          console.log(error)
        }
      }
      else if (window.web3) {
        console.log('Non-Ethereum browser detected.')
        window.web3 = new Web3(web3.currentProvider)
      }
      else {
        console.log('Non-Ethereum browser detected.')
      }
    })

    return App.initContract();
  },

  initContract: function() {
     $.getJSON('UnivLedger.json', function(data) {
        var testArtifact = data;
        App.contracts.UnivLedger = TruffleContract(testArtifact);
        App.contracts.UnivLedger.setProvider(web3.currentProvider);
        App.bindEvents();
      })
    },

  bindEvents: function() {
    var contractInstance;

    App.contracts.UnivLedger.deployed().then(async function(instance) {
      contractInstance = instance;
      var UnivAdd = await contractInstance.getUnivAddress.call("고려대학교");
      // alert(UnivAdd);
      const ipfs = new Ipfs({ repo: 'ipfs-' + Math.random() })
      $('#uploadButton').on('click', () => {
        let reader = new FileReader()

        reader.onload = async () => {
          var buffer = window.Ipfs.Buffer.from(btoa(reader.result),'base64');
          const files = await ipfs.add(buffer)
          await contractInstance.child_registerImage(UnivAdd,files[0].hash)
          const img = buffer.toString("base64")
          $('#loadImage').attr('src', 'data:image/png;base64,' + img)
        }
        const fileUpload = document.getElementById('fileUpload')
        reader.readAsBinaryString(fileUpload.files[0])
      })
      $('#loadButton').on('click', async () => {
        let ipfsImage = await contractInstance.child_getImage(UnivAdd,$('#loadText').val())
        const file = await ipfs.cat(ipfsImage)
        const img = file.toString("base64")
        $('#loadImage').attr('src', 'data:image/png;base64,' + img)
      })
    })
  },

  registerUniv: async function(){
    var contractInstance;
    App.contracts.UnivLedger.deployed().then(function(instance) {
      contractInstance=instance;
      var name = document.getElementById("exampleFirstName").value;
      var preNum = document.getElementById("exampleLastName").value;
      contractInstance.registerUniv(name,preNum, { value: web3.toWei("10","ether")})
      .then(function(receipt){
        alert("sss");
      });
    })
  },

  //안건추가
  child_createVote: async function(){
    var contractInstance;
    App.contracts.UnivLedger.deployed().then(function(instance) {
      contractInstance=instance;
      var uniAccount;
      contractInstance.getStudentUniv().then(function(response){
        console.log(response);
        uniAccount = response; //리턴값을 어떻게 받아오더라
        
      }).then(function(){
        var votingAgenda = Document.getElementById('recipient-name').value;
        var willUseMoney = Document.getElementById('will-use-money').value;
        contractInstance.child_createVote(uniAccount, votingAgenda, willUseMoney).then(
          function(){
            //안건 요청 함수 실행
            console.log("실행???")
          }
        ).then(
          function(){
            
          }
        )
      })
      
    })
  },

  //안건을 눌렀을때 상세내역 보여주기
  child_voteRes: async function(){
    
    var contractInstance;
    App.contracts.UnivLedger.deployed().then(function(instance) {
      contractInstance=instance;

      var uniAccount;
      contractInstance.getStudentUniv().then(function(response){
        console.log(response);
        uniAccount = response; //리턴값을 어떻게 받아오더라
        contractInstance.child_voteRes(uniAccount).then(
          function(res){
            console.log(res);
            //세가지 값을 가져온다. 찬성표수, 전체투표수, 금액

          }
        )
      })
      
      .then(function(receipt){
        alert("sss");
      });
    })
  },

  //투표하기 버튼 눌렀을때 실행되는 함수
  child_doVote: async function(){    
    var contractInstance;
    App.contracts.UnivLedger.deployed().then(function(instance) {
      contractInstance=instance;

      var uniAccount;
      contractInstance.getStudentUniv().then(function(response){
        console.log(response);
        uniAccount = response; //리턴값을 어떻게 받아오더라
        var agreeOrOpt = true; //DocumentGet.... 를 통해서 ture / false 값 받아오기. 
        contractInstance.child_doVote(uniAccount, agreeOrOpt);  //여기서 찬성이나 전체개수를 올린다
        //새로고침을 누르면 투표현황 갱신
      })
      
      .then(function(receipt){
        alert("sss");
      });
    })
  },

  child_getUnivBalance: async function(){    
    var contractInstance;
    App.contracts.UnivLedger.deployed().then(function(instance) {
      contractInstance=instance;

      var uniAccount;
      contractInstance.getStudentUniv().then(function(response){
        console.log(response);
        uniAccount = response; //리턴값을 어떻게 받아오더라
        var agreeOrOpt = true; //DocumentGet.... 를 통해서 ture / false 값 받아오기. 
        contractInstance.child_getUnivBalance(uniAccount).then(
          function(res){
            console.log(res);
            //해당 대학교 잔고액을 받아냄 => 화면에 출력
          }
        )  //여기서 찬성이나 전체개수를 올린다
        //새로고침을 누르면 투표현황 갱신
      })
      
      .then(function(receipt){
        alert("sss");
      });
    })
  },
  registerPres: async function(){
    var contractInstance;
    App.contracts.UnivLedger.deployed().then(async function(instance) {
      contractInstance=instance;
      var add = document.getElementById("recipient-name").value;
      var UnivAdd = await contractInstance.getUnivAddress.call("고려대학교");
      contractInstance.child_addAddress(UnivAdd,add, {});
    })
  },
  // deposit: async function(){
  //   var contractInstance;
  //   App.contracts.UnivLedger.deployed().then(async function(instance) {
  //     contractInstance=instance;
  //     var UnivAdd = await contractInstance.getUnivAddress.call("고려대학교");
  //     contractInstance.child_deposit(UnivAdd, { value: web3.toWei("50","ether")})
  //   })
  // },

};


$(window).on('load', function(){ App.init()});
