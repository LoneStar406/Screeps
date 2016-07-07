/*
 * worldController - Controls world functionality.
 */
//References
var logger = require('common.Logger');
var WorldModel = require('model.WorldModel');
var roomControllerRef = require('controller.RoomController');
var RoomModel = require('model.RoomModel');


//Constructor - Loads or creates the model for the world.
var WorldController = function () {
    /*
    * Properties
    */
    this.worldModel = null;
    //this.refreshTick

    //var that = this;
    logger.log("WorldController", "WorldController", "Started", logger.debugFlag.VERBOSE);
    //Load the world model
    //Load data
    this.load();
}

/*
* Functions
*/

//Load or create the model for the world.
WorldController.prototype.load = function () {
    logger.log("WorldController", "load", "Started", logger.debugFlag.VERBOSE);
    if (Memory.worldModel == null) {
        Memory.worldModel = new WorldModel();
        logger.log("WorldController", "loadWorldModel", "worldModel not found in memory. New worldModel created", logger.debugFlag.INFORMATION);
    }
    this.worldModel = this.loadModel(Memory.worldModel);
    
}

//Runs each instance of the room controller to make decisions and tick creeps.
WorldController.prototype.run = function() 
{
    logger.log("WorldController", "run", "Started", logger.debugFlag.VERBOSE);
    logger.log("WorldController", "run", "-------------------------------------------- New Tick Started --------------------------------------------", logger.debugFlag.INFORMATION);

    //Clear memory
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    //Refresh data
    this.loadModel(this.worldModel);
    var i = 0;
    for (i = 0; i < this.worldModel.roomModels.length; i++) {
        var roomController = new roomControllerRef(this.worldModel.roomModels[i]);
        logger.log("WorldController", "run", "Running room: " + this.worldModel.roomModels[i].roomName, logger.debugFlag.VERBOSE);
        roomController.run();
    }
    return null;
}

/*
* Model Functions
*/
//Loads/reloads the model with current data.
WorldController.prototype.loadModel = function (worldModel) {
    //In the load refresh items that do change with time - roomModels
    logger.log("WorldController", "loadModel", "Started", logger.debugFlag.VERBOSE);
    //Iterate through all rooms
    for (var roomName in Game.rooms) {
        var roomModel = this.retrieveRoom(worldModel.roomModels, roomName);
        if (roomModel == null) {
            //If the room is new then add it to the array.
            roomModel = new RoomModel(roomName);
            worldModel.roomModels[worldModel.roomModels.length] = roomModel;
            //Load the model using the controller
            var roomController = new roomControllerRef(roomModel);
            roomController.load(roomModel);
            logger.log("WorldController", "loadModel", "RoomModel added: " + roomName, logger.debugFlag.INFORMATION);
        }
        else {
            //If the room is old then refresh the room using the controller
            var roomController = new roomControllerRef(roomModel);
            roomController.load(roomModel);
            logger.log("WorldController", "loadModel", "RoomModel reloaded: " + roomName, logger.debugFlag.VERBOSE);
        }
    }
    return worldModel;
}

//Returns the room if the room exists in the provided room array else null
WorldController.prototype.retrieveRoom = function (roomModels, roomName) {
    logger.log("WorldController", "retrieveRoom", "Started", logger.debugFlag.VERBOSE);
    var i = 0;
    for (i = 0; i < roomModels.length; i++) {
        if (roomModels[i].roomName == roomName) {
            logger.log("WorldController", "retrieveRoom", "RoomModel found: " + roomName, logger.debugFlag.VERBOSE);
            return roomModels[i];
        }
    }
    logger.log("WorldController", "retrieveRoom", "RoomModel not found: " + roomName, logger.debugFlag.VERBOSE);
    return null;
}

module.exports = WorldController;