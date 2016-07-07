/*
 * main - The code starting point.
 */
//References
var worldController = require('controller.WorldController');
//The main process run each tick
module.exports.loop = function () {
    //var controller = new worldController.WorldController();
    var controller = new worldController();
    //console.log(controller.worldModel);
    controller.load();
    controller.run();
}