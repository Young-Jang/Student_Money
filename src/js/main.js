const startVote = document.getElementById("voteBtn");
/**/
const suggg = document.getElementById("sugg");
/**/
var voteBody = document.getElementById("vote-body");

/**/
function add(){
    $( suggg ).ready( function() {
        $( '#suggest' ).append( '간식배부' );
      } );
      document.getElementById("voteBtn").style.display = "inline";
}
/**/
function setHtml(item_id, item_html)
 {
      obj = document.getElementById(item_id);
      obj.innerHTML = item_html;
 }

function detailclick(){
    setHtml("from","0x4352A85E6FE7db5116d101f04910f0a7dc2eDFaD");
    setHtml("money","10.001337");
    setHtml("date","0xa142Cb555f01634fb94BE7d2D1d25F6B788322d3");
    $('.fromp').text('from : 0x4352A85E6FE7db5116d101f04910f0a7dc2eDFaD');
    $('.fromto').text('to : 0xa142Cb555f01634fb94BE7d2D1d25F6B788322d3');
    $('.fromtx').text('tx-hash : 0x540349e49e0374642a67936df61e383d9a2813c5f874842614f4f859c4bbe23d');
    $('.fromblock').text('block-number : 65');
}
/**/
function clickFunction(){
    var voteBody = document.getElementById("vote-body").style.display = 'inline';
    
}

function clickFunction2(){
    document.getElementById("voting_now").style.width = '100%';
    document.getElementById("float-ttt").innerHTML = '100%';
    
}