module.exports = {

    sendResponse: function (res, status, text) {
        res.status(status);
        if (status === 500) {
            res.send({
                "status": 500,
                "message": "Server Error",
                "userData": ""
            });
            return;
        }
        res.send({
            "status": status,
            "message": text,
            "userData": ""
        });
        return true;
    }
}