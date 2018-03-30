const constants = require('./constants');

module.exports = {
    getForm : function (validationKey) {
        var html = "<html>\n" +
            "    <head>\n" +
            "        <meta charset=\"UTF-8\">\n" +
            "        <title>Reset your Password at Studicircle</title>\n" +
            "    </head>\n" +
            "    <body>\n" +
            "        <h1>Reset your password at StudiCircle</h1>\n" +
            "        <p>\n" +
            "            To reset your password please fill in the form below:\n" +
            "        </p>\n" +
            "        <form method='POST' action='localhost:9080/user/resetPassword'>\n" +
            "            <label for='pw1'>Password:</label>\n" +
            "            <input type='password' name='pwd' id='pw1' onkeyup='checkPass()'/><br>\n" +
            "            <label for='pw2'>Repeat Password:</label>\n" +
            "            <input type='password' name='rpwd' id='pw2' onkeyup='checkPass()'/><br>\n" +
            "            <input type='submit' value='submit' id='btn' disabled/>\n" +
            "        </form>\n" +
            "        <p id='outputCompare'></p>\n" +
            "        <p id='outputCompliance'></p>\n" +
                    "<script>\n" +
                    "\t//Store the password field objects into variables ...\n" +
                    "\tvar pass1 = document.getElementById('pw1');\n" +
                    "\tvar pass2 = document.getElementById('pw2');\n" +
                    "\tvar btn = document.getElementById('btn');\n" +
                    "\tvar messageMatch = document.getElementById('outputCompare');\n" +
                    "\tvar messageCompliance = document.getElementById('outputCompliance');\n" +
                    "\t//Set the colors we will be using ...\n" +
                    "\tvar goodColor = '#66cc66';\n" +
                    "\tvar badColor = '#ff6666';\n" +
                    "\n" +
                    "\tfunction checkPass() {\n" +
                    "\t\tif(checkMatch() && checkCompliance()){\n" +
                    "\t\t\tbtn.disabled = false;\n" +
                    "\t\t}else{\n" +
                    "\t\t\tbtn.disabled = true;\n" +
                    "\t\t}\n" +
                    "\t}\n" +
                    "\tfunction checkMatch() {\n" +
                    "\t\t//Compare the values in the password field and the confirmation field\n" +
                    "\t\tif(pass1.value == pass2.value){\n" +
                    "\t\t\t//The passwords match. Set the color to the good color and inform the user that they have entered the correct password\n" +
                    "\t\t\tpass2.style.backgroundColor = pass1.style.backgroundColor = goodColor;\n" +
                    "\t\t\tmessageMatch.style.color = goodColor;\n" +
                    "\t\t\tmessageMatch.innerHTML = 'Passwords Match!';\n" +
                    "\t\t\treturn true;\n" +
                    "\t\t}else{\n" +
                    "\t\t\t//The passwords do not match. Set the color to the bad color and notify the user.\n" +
                    "\t\t\tpass2.style.backgroundColor = pass1.style.backgroundColor = badColor;\n" +
                    "\t\t\tmessageMatch.style.color = badColor;\n" +
                    "\t\t\tmessageMatch.innerHTML = 'Passwords Do Not Match!';\n" +
                    "\t\t\treturn false;\n" +
                    "\t\t}\n" +
                    "\t}\n" +
                    "\tfunction checkCompliance() {\n" +
                    "\t\tif (pass1.value.length <  8  || pass1.value.length >  64 ) {\n" +
                    "\t\t\tmessageCompliance.innerHTML = 'Passwords have to be at least 8 characters long and not longer than 64 characters';\n" +
                    "\t\t\tmessageCompliance.style.color = badColor;\n" +
                    "\t\t\tpass2.style.backgroundColor = pass1.style.backgroundColor = badColor;\n" +
                    "\t\t\treturn false;\n" +
                    "\t\t}\n" +
                    "\t\tconst regex = /^[(\\w+\\d+äüöÄÖÜ!\\\"\\§\\$\\%\\&\\/\\(\\)\\[\\]\\{\\}\\=\\ß\\?\\@\\+\\*\\'\\;\\:\\-\\<\\>\\|\\#\\^\\°\\~\\,\\.\\_\\€\\µ)]{8,64}$/;\n" +
                    "\t\tlet result = regex.test(pass1.value);\n" +
                    "\t\tif (!result) {\n" +
                    "\t\t\tmessageCompliance.innerHTML = 'Only the following characters are allowed in Passwords: a-zA-Z0-9äöüÄÖÜ!\"§$%&/()=?ß@+*:;-<>|^°~,.€µ';\n" +
                    "\t\t\tmessageCompliance.style.color = badColor;\n" +
                    "\t\t\tpass2.style.backgroundColor = pass1.style.backgroundColor = badColor;\n" +
                    "\t\t} else {\n" +
                    "\t\t\tmessageCompliance.innerHTML = 'The Password matches the criteria';\n" +
                    "\t\t\tmessageCompliance.style.color = goodColor;\n" +
                    "\t\t\tpass2.style.backgroundColor = pass1.style.backgroundColor = goodColor;\n" +
                    "\t\t}\n" +
                    "\t\treturn result;\n" +
                    "\t}\n" +
                    "</script>" +
            "    </body>\n" +
            "</html>";
        return html;
    },
};