
const form = document.getElementById("registration-form");

form.addEventListener("submit", (e)=>{
    
    usernameReq();
    emailReq();
    passwordReq();

    if(usernameReq() == false || passwordReq() == false){
        e.preventDefault();
       
    }
   
    
});



function usernameReq(){
    var username = document.getElementById("username-content").value;
    if(/^([a-z])[a-z0-9]{2,}/gi.test(username)){
        document.getElementById("username-input-failure").style.visibility = "hidden";
    }
    else{
        document.getElementById("username-input-failure").style.visibility = "visible";
        return false;
    }
    return true;

}

function emailReq(){
    var email = document.getElementById("email-content").value;
    if(/@/.test(email)){
        document.getElementById("email-input-failure").style.visibility = "hidden";
    }
    else{
        document.getElementById("email-input-failure").style.visibility = "visible";
        return false;
    }
    return true;

}

function passwordReq(){
    var password1 = document.getElementById("password").value;
    var password2 = document.getElementById("password-confirmation").value;

    if(password1 != password2){
        
        document.getElementById("password-input-failure").style.visibility = "visible";
        return false;
        
    }
    if(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[(\-+!@#\$\^&\*])(?=.{8,})/.test(password1)){
        document.getElementById("password-input-failure").style.visibility = "hidden";
        return true;
    }
    else{
        document.getElementById("password-input-failure").style.visibility = "visible";
        return false;
       
    }
}






