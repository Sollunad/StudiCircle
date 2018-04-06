module.exports = {

    sendResponse: function (res, status, text) {
        res.status(status);
        if (status === 500) {
            res.send({"result": "Server Error"});
            return;
        }
        res.send({"result": text});
        return true;
    }
}