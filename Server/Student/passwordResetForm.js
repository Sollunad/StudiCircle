const constants = require('./constants');

module.exports = {
    getForm : function (validationKey) {
        var html = "<html>\n" +
                        "<head>\n" +
                            "<title>Reset your Password at Studicircle</title>\n" +
                        "</head>\n" +
                        "<body>\n" +
                            "<script>\n"+
                                "function checkPass() {\n" +
                                "    if(checkMatch() && checkCompliance()){\n" +
                                "        btn.disabled = false;\n" +
                                "    }else{\n" +
                                "        btn.disabled = true;\n" +
                                "    }\n" +
                                "} \n" +
                                "function checkMatch() {\n" +
                                "    //Store the password field objects into variables ...\n" +
                                "    var pass1 = document.getElementById('pw1');\n" +
                                "    var pass2 = document.getElementById('pw2');\n" +
                                "    var btn = document.getElementById('btn');\n" +
                                "    var messageMatch = document.getElementById('outputCompare');\n" +
                                "    var messageCompliance = document.getElementById('outputCompliance');\n" +
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
                                "        messageMatch.style.color = goodColor;\n" +
                                "        messageMatch.innerHTML = \"Passwords Match!\";\n" +
                                "        return true;\n" +
                                "    }else{\n" +
                                "        //The passwords do not match.\n" +
                                "        //Set the color to the bad color and\n" +
                                "        //notify the user.\n" +
                                "        pass2.style.backgroundColor = badColor;\n" +
                                "        messageMatch.style.color = badColor;\n" +
                                "        messageMatch.innerHTML = \"Passwords Do Not Match!\";\n" +
                                "        return false;\n" +
                                "    }\n" +
                                "} \n" +
                                "function checkCompliance() {\n" +
                                "    //Store the password field objects into variables ...\n" +
                                "    var pass1 = document.getElementById('pw1');\n" +
                                "    var pass2 = document.getElementById('pw2');\n" +
                                "    var btn = document.getElementById('btn');\n" +
                                "    var messageMatch = document.getElementById('outputCompare');\n" +
                                "    var messageCompliance = document.getElementById('outputCompliance');\n" +
                                "    //Set the colors we will be using ...\n" +
                                "    var goodColor = \"#66cc66\";\n" +
                                "    var badColor = \"#ff6666\";\n" +
                                "    if (pass1.length < " + constants.PASS_MIN_LENGTH + " || pass1.length > " + constants.PASS_MAX_LENGTH + ") {\n" +
                                "        messageCompliance.innerHTML = 'Passwords have to be at least " + constants.PASS_MIN_LENGTH + " characters long and not longer than " + constants.PASS_MAX_LENGTH + " characters';\n" +
                                "        messageCompliance.style.color = badColor;\n" +
                                "        return false;\n" +
                                "    }\n" +
                                "    //const regex = /^[(\w+\d+äüöÄÖÜ!\"\§\$\%\&\/\(\)\[\]\{\}\=\ß\?\@\+\*\'\;\:\-\<\>\|\#\^\°\~\,\.\_\€\µ)]{8,64}$/; \n" +
                                "    //et result = regex.test(password);\n" +
                                "    let result = false;\n" +
                                "    if (!result) {\n" +
                                "        messageCompliance.innerHTML = 'Only the following characters are allowed in Passwords';\n" +
                                "        messageCompliance.style.color = badColor;\n" +
                                "    }\n" +
                                "    return result;\n" +
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
                            "<p id='outputCompare'></p>\n" +
                            "<p id='outputCompliance'></p>\n" +
                        "</body>\n" +
                    "</html>\n";
        return html;
    },
};