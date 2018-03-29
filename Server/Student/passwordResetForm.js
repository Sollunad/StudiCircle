const constants = require('./constants');

module.exports = {
    getForm : function (validationKey) {
        var html = "<html>\n" +
            "<head>\n" +
            "<title>Reset your Password at Studicircle</title>\n" +
            "</head>\n" +
            "<body>\n" +
            "<script>\n"+
            "function checkPass()\n" +
            "{\n" +
            "    //Store the password field objects into variables ...\n" +
            "    var pass1 = document.getElementById('pw1');\n" +
            "    var pass2 = document.getElementById('pw2');\n" +
            "    var btn = document.getElementById('btn');\n" +
            "    //Store the Confimation Message Object ...\n" +
            "    var message = document.getElementById('output');\n" +
            "    //Set the colors we will be using ...\n" +
            "    var goodColor = \"#66cc66\";\n" +
            "    var badColor = \"#ff6666\";\n" +
            "    //Compare the values in the password field \n" +
            "    //and the confirmation field\n" +
            "    if(pass1.value == pass2.value){\n" +
            "        //The passwords match. \n" +
            "        //Set the color to the good color and inform\n" +
            "        //the user that they have entered the correct password \n" +
            "        pass2.style.backgroundColor = goodColor;\n" +
            "        message.style.color = goodColor;\n" +
            "        btn.disabled = false;\n" +
            "        message.innerHTML = \"Passwords Match!\"\n" +
            "    }else{\n" +
            "        //The passwords do not match.\n" +
            "        //Set the color to the bad color and\n" +
            "        //notify the user.\n" +
            "        pass2.style.backgroundColor = badColor;\n" +
            "        message.style.color = badColor;\n" +
            "        btn.disabled = true;\n" +
            "        message.innerHTML = \"Passwords Do Not Match!\";\n" +
            "    }\n" +
            "} \n" +
            "</script>\n"+
            "<h1>Reset your password at StudiCircle</h1>\n" +
            "<p>\n" +
            "To reset your password please fill in the form below:" +
            "</p>\n"+
            "<form method='POST' action='" + constants.getPasswordChangeURL(validationKey) + "'>" +
            "<label for='pw1'>Password:</label>\n" +
            "<input type='password' name='pwd' id='pw1'/><br>\n" +
            "<label for='pw2'>Repeat Password:</label>\n" +
            "<input type='password' name='rpwd' id='pw2' onkeyup='checkPass()'/><br>\n" +
            "<input type='submit' value='submit' id='btn' disabled/>\n" +
            "</form>\n" +
            "<p id='output'></p>\n" +
            "</body>\n" +
            "</html>\n";
        return html;
    },
};