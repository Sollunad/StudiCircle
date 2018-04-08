module.exports = {

    sendResponse: function (res, status, text) {
        res.status(status);
        if (status === 500) {
            res.send({
                "httpStatus": 500,
                "message": "Server Error",
                "data": ""
            });
            return;
        }
        res.send({
            "httpStatus": status,
            "message": text,
            "data": ""
        });
        return true;
    }
}