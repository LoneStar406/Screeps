/*
 * worldModel - Contains data to allow the controller to make decisions.
 */
//References
var logger = require('common.Logger');
var roomModelRef = require('model.RoomModel');

//Constructor - Creates the model for the world.
var WorldModel = function () {
    /*
    * Properties
    */
    //An array of all roomModels.
    this.roomModels = [];
    this.creepCount = { harvester: 0, builder: 0, mule: 0};

    logger.log("worldModel", "worldModel", "Started", logger.debugFlag.VERBOSE);
    //In the create load items that do not change with time - logger flags
    logger.createDebugFlags();
    //Load data
    //this.load();
}

/*
* Functions
*/
//Loads/reloads the model with current data.
//WorldModel.prototype.load = function () {
//    //In the load refresh items that do change with time - roomModels
//    logger.log("worldModel", "load", "Started", logger.debugFlag.VERBOSE);
//    //Iterate through all rooms
//    for(var roomName in Game.rooms) 
//    {
//        var roomModel = this.retrieveRoom(this.roomModels, roomName);
//        if (roomModel == null)
//        {
//            //If the room is new then add it to the array.
//            this.roomModels[this.roomModels.length] = new roomModelRef(roomName);
//            logger.log("worldModel", "load", "RoomModel added: " + roomName, logger.debugFlag.INFORMATION);
//        }
//        else
//        {
//            //If the room is old then refresh the room.
//            roomModel.load();
//            logger.log("worldModel", "load", "RoomModel reloaded: " + roomName, logger.debugFlag.INFORMATION);
//        }
//    }
//}

////Returns the room if the room exists in the provided room array else null
//WorldModel.prototype.retrieveRoom = function(roomModels, roomName)
//{
//    logger.log("worldModel", "retrieveRoom", "Started", logger.debugFlag.VERBOSE);
//    var i = 0;
//    for (i = 0; i < roomModels.length; i++) {
//        if (roomModels[i].roomName == roomName) {
//            logger.log("worldModel", "retrieveRoom", "RoomModel found: " + roomName, logger.debugFlag.INFORMATION);
//            return roomModels[i];
//        }
//    }
//    logger.log("worldModel", "retrieveRoom", "RoomModel not found: " + roomName, logger.debugFlag.INFORMATION);
//    return null;
//}

module.exports = WorldModel;