//Store the password field objects into variables ...
var pass1 = document.getElementById('pw1');
var pass2 = document.getElementById('pw2');
var btn = document.getElementById('btn');
var messageMatch = document.getElementById('outputCompare');
var messageCompliance = document.getElementById('outputCompliance');
//Set the colors we will be using ...
var goodColor = '#66cc66';
var badColor = '#ff6666';

function checkPass() {
    if(checkMatch() && checkCompliance()){
        btn.disabled = false;
    }else{
        btn.disabled = true;
    }
}
function checkMatch() {
    //Compare the values in the password field and the confirmation field
    if(pass1.value == pass2.value){
        //The passwords match. Set the color to the good color and inform the user that they have entered the correct password
        pass2.style.backgroundColor = pass1.style.backgroundColor = goodColor;
        messageMatch.style.color = goodColor;
        messageMatch.innerHTML = 'Passwords Match!';
        return true;
    }else{
        //The passwords do not match. Set the color to the bad color and notify the user.
        pass2.style.backgroundColor = pass1.style.backgroundColor = badColor;
        messageMatch.style.color = badColor;
        messageMatch.innerHTML = 'Passwords Do Not Match!';
        return false;
    }
}
function checkCompliance() {
    if (pass1.value.length <  8  || pass1.value.length >  64 ) {
        messageCompliance.innerHTML = 'Passwords have to be at least 8 characters long and not longer than 64 characters';
        messageCompliance.style.color = badColor;
        pass2.style.backgroundColor = pass1.style.backgroundColor = badColor;
        return false;
    }
    const regex = /^[(\w+\d+äüöÄÖÜ!\"\§\$\%\&\/\(\)\[\]\{\}\=\ß\?\@\+\*\'\;\:\-\<\>\|\#\^\°\~\,\.\_\€\µ)]{8,64}$/;
    let result = regex.test(pass1.value);
    if (!result) {
        messageCompliance.innerHTML = 'Only the following characters are allowed in Passwords: a-zA-Z0-9äöüÄÖÜ!"§$%&/()=?ß@+*:;-<>|^°~,.€µ';
        messageCompliance.style.color = badColor;
        pass2.style.backgroundColor = pass1.style.backgroundColor = badColor;
    } else {
        messageCompliance.innerHTML = 'The Password matches the criteria';
        messageCompliance.style.color = goodColor;
        pass2.style.backgroundColor = pass1.style.backgroundColor = goodColor;
    }
    return result;
}