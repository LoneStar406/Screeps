/*
 * roomModel - Contains data to allow the controller to make decisions.
 */
//References
var logger = require('common.Logger');
var sourceModelref = require('model.SourceModel');

//Constructor - Creates the model for a given room
var RoomModel = function (roomName) {
    /*
    * Properties
    */
    //The name of the room.
    this.roomName = null;
    //An array of all sourcesModels.
    this.sourceModels = null;
    //An array of all spawnModels.
    this.spawnModels = null;
    //Spawns on lock down.
    this.isEnergyRestricted = 0;
    //Spawns on lock down.
    this.isEmergencyMuleActActive = 0;
    //

    logger.log("roomModel", "roomModel", this.roomName + " - Started", logger.debugFlag.VERBOSE);
    //In the create load items that do not change with time - roomName, sourcesModels.
    this.roomName = roomName;
    //this.sourceModels = this.retrieveSourceModels(this.roomName);
    //Load data
    //this.load();
}

/*
* Model Functions
*/
//Loads/reloads the model with current data.
//RoomModel.prototype.load = function () {
//    //In the load refresh items that do change with time - refresh source models
//    logger.log("roomModel", "load", this.roomName + " - Started", logger.debugFlag.VERBOSE);
//    var i = 0;
//    for (i = 0; i < this.sourceModels.length; i++) {
//        this.sourceModels[i].load();
//    }
//}

////Retrieves all of the source models for the object.
//RoomModel.prototype.retrieveSourceModels = function(roomName) {
//    //Iterates through all sources in the room to load all source models.
//    logger.log("roomModel", "retrieveSourceModels", this.roomName + " - Started", logger.debugFlag.VERBOSE);
//    var sources = Game.rooms[roomName].find(FIND_SOURCES);
//    var result = [];
//    var i = 0;
//    for (i = 0; i < sources.length; i++) {
//        var sourceModel = new sourceModelref(sources[i]);
//        result[i] = sourceModel;
//    }
//    logger.log("roomModel", "retrieveSourceModels", this.roomName + " - sourceModels created: " + result.length, logger.debugFlag.INFORMATION);
//    return result;
//}

module.exports = RoomModel;