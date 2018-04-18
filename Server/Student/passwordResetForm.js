const constants = require('./constants');

module.exports = {
    getForm : function (validationKey) {
        var html = `<html>
        <head>
            <meta charset=\"UTF-8\">
            <title>Reset your Password at Studicircle</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
            <style>
                .form-control{
                    outline: none;
                    border: none;
                    border-bottom: 1px solid lightgrey;
                    border-radius: 0;
                }
                .form-control:focus{
                    outline: none;
                    border: none;
                    border-bottom: 2px solid #488aff;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 offset-lg-2">
                        <h1>Reset your password at StudiCircle</h1>
                        <p class="infotext lead">
                            To reset your password please fill in the form below:
                        </p>
                        <form method='POST' action='${constants.getPasswordChangeURL()}'>
                            <input class="form-control" type='password' name='pwd' id='pw1' placeholder="Password" onkeyup='checkPass()'/><br>
                            <input class="form-control" type='password' name='rpwd' id='pw2'placeholder="Repeat Password"  onkeyup='checkPass()'/><br>
                            <input class="btn btn-block btn-primary" type='submit' value='submit' id='btn' disabled/>
                            <input class="hiddenfield" type='hidden' name='validationKey' id='validationKey' value='${validationKey}'/><br>
                        </form>
                        <p id='outputCompare' class="col-lg-8 offset-lg-2"></p>
                        <p id='outputCompliance' class="col-lg-8 offset-lg-2"></p>
                    </div>
                </div>
            </div>\n` +
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
                    "\t\tif (pass1.value.length <  " + constants.PASS_MIN_LENGTH + " || pass1.value.length >  " + constants.PASS_MAX_LENGTH + " ) {\n" +
                    "\t\t\tmessageCompliance.innerHTML = 'Passwords have to be at least " + constants.PASS_MIN_LENGTH + " characters long and not longer than " + constants.PASS_MAX_LENGTH + " characters';\n" +
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