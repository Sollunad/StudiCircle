module.exports = function(app) {
    var circle = require('./controllerCircle');

    // circle routes
    app.route('/circle/helloworld')
        .get(circle.helloworld);
};
