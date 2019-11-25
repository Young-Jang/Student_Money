function on(){
    const getEmail = document.getElementById("exampleInputEmail");
    const getPassword = document.getElementById("exampleInputPassword");
    const resetHref = document.getElementById("loginCheck");
    var checkSchool = new Array("kuniv","juniv");
    
    console.log(getEmail.value);
    if(getEmail.value.indexOf(checkSchool[0]) != -1){
        console.log("고려대있음");
    }else if(getEmail.value.indexOf(checkSchool[1]) != -1){
        console.log("중앙대있음")
    }else{
        alert('등록된 학교가 아닙니다.');
        resetHref.href="";
    }
    
}