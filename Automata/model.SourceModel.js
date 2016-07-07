/*
 * sourceModel - Contains data to allow the controller to make decisions.
 */
//References
var logger = require('common.Logger');
//var creepModelRef = require('model.CreepModel');


//Constructor - Creates the model for a given source.
var SourceModel =  function (source) {
    /*
    * Properties
    */
    //The ID of the source.
    this.id = null;
    //The number of access points of a source.
    this.accessPointCount = null;
    //A flag indicating whether the source is ignored.
    this.isSourceIgnored = 0;
    //The ID of the container.
    this.containerID = null;
    //A flag indicating whether any other harvesters can be used for this source.
    this.isSourceAtCapacity = null;

    logger.log("sourceModel", "sourceModel", this.id + " - Started", logger.debugFlag.VERBOSE);
    //In the create load items that do not change with time - id, accessPointCount.
    this.id = source.id;
    //this.accessPointCount = this.retrieveSourceAccessPointCount(source);
    //Load data
    //this.load();
}

/*
* Functions
*/
//Loads/reloads the model with current data.
//SourceModel.prototype.load = function(){
//    //In the load refresh items that do change with time - containerID, isSourceAtCapacity.
//    logger.log("sourceModel", "load", this.id + " - Started", logger.debugFlag.VERBOSE);
//    //Find the source
//    this.containerID = this.retrieveSourceContainerID(Game.getObjectById(this.id));
//    //Determines if the source is at capacity
//    this.isSourceAtCapacity = this.retrieveIsSourceAtCapacity(Game.getObjectById(this.id));
//}

////Retrieves the ID of the closest container to the source.
//SourceModel.prototype.retrieveSourceContainerID = function (source) {
//    //Retrieves the ID of the closest contatiner to the source within 3 squares.
//    logger.log("sourceModel", "retrieveSourceContainerID", this.id + " - Started", logger.debugFlag.VERBOSE);
//    var containers = source.pos.findInRange(FIND_MY_STRUCTURES, 3, {
//        filter: (structure) => {
//            return (structure.structureType == STRUCTURE_CONTAINER);
//        }
//    });
//    if (containers.length > 0) {
//        logger.log("sourceModel", "retrieveSourceContainerID", this.id + " - Container found: " + containers[0].id, logger.debugFlag.INFORMATION);
//        return containers[0].id;
//    }
//    else
//    {
//        logger.log("sourceModel", "retrieveSourceContainerID", this.id + " - Container not found", logger.debugFlag.INFORMATION);
//        return null;
//    }
//}

////Retrieves the count of access points to the source.
//SourceModel.prototype.retrieveSourceAccessPointCount = function (source) {
//    //Scans each surrounding tile and counts the terrain which are plains or swamp.
//    var accessPointCount = 0;

//    var r;
//    var terrain;
//    logger.log("sourceModel", "retrieveSourceAccessPointCount", this.id + " - Started", logger.debugFlag.VERBOSE);
//    //console.log(source.pos);
//    //r = new RoomPosition(10, 25, 'sim');
//    r = new RoomPosition(source.pos.x - 1, source.pos.y + 1, source.pos.roomName);
//    //console.log("createSourceModel - Look For Terrains");
//    terrain = r.lookFor(LOOK_TERRAIN);
//    //console.log("createSourceModel - " + s.id + " - NW terrain: " + terrain);
//    if (terrain == "swamp" || terrain == "plain")
//        accessPointCount = accessPointCount + 1;

//    r = new RoomPosition(source.pos.x - 1, source.pos.y, source.pos.roomName);
//    //console.log("createSourceModel - Look For Terrains");
//    terrain = r.lookFor(LOOK_TERRAIN);
//    //console.log("createSourceModel - " + s.id + " - W terrain: " + terrain);
//    if (terrain == "swamp" || terrain == "plain")
//        accessPointCount = accessPointCount + 1;

//    r = new RoomPosition(source.pos.x - 1, source.pos.y - 1, source.pos.roomName);
//    //console.log("createSourceModel - Look For Terrains");
//    terrain = r.lookFor(LOOK_TERRAIN);
//    //console.log("createSourceModel - " + s.id + " - SW terrain: " + terrain);
//    if (terrain == "swamp" || terrain == "plain")
//        accessPointCount = accessPointCount + 1;

//    r = new RoomPosition(source.pos.x, source.pos.y + 1, source.pos.roomName);
//    //console.log("createSourceModel - Look For Terrains");
//    terrain = r.lookFor(LOOK_TERRAIN);
//    //console.log("createSourceModel - " + s.id + " - N terrain: " + terrain);
//    if (terrain == "swamp" || terrain == "plain")
//        accessPointCount = accessPointCount + 1;

//    r = new RoomPosition(source.pos.x, source.pos.y - 1, source.pos.roomName);
//    //console.log("createSourceModel - Look For Terrains");
//    terrain = r.lookFor(LOOK_TERRAIN);
//    //console.log("createSourceModel - " + s.id + " - S terrain: " + terrain);
//    if (terrain == "swamp" || terrain == "plain")
//        accessPointCount = accessPointCount + 1;

//    r = new RoomPosition(source.pos.x + 1, source.pos.y + 1, source.pos.roomName);
//    //console.log("createSourceModel - Look For Terrains");
//    terrain = r.lookFor(LOOK_TERRAIN);
//    //console.log("createSourceModel - " + s.id + " - NE terrain: " + terrain);
//    if (terrain == "swamp" || terrain == "plain")
//        accessPointCount = accessPointCount + 1;

//    r = new RoomPosition(source.pos.x + 1, source.pos.y, source.pos.roomName);
//    //console.log("createSourceModel - Look For Terrains");
//    terrain = r.lookFor(LOOK_TERRAIN);
//    //console.log("createSourceModel - " + s.id + " - E terrain: " + terrain);
//    if (terrain == "swamp" || terrain == "plain")
//        accessPointCount = accessPointCount + 1;

//    r = new RoomPosition(source.pos.x + 1, source.pos.y - 1, source.pos.roomName);
//    //console.log("createSourceModel - Look For Terrains");
//    terrain = r.lookFor(LOOK_TERRAIN);
//    //console.log("createSourceModel - " + s.id + " - SE terrain: " + terrain);
//    if (terrain == "swamp" || terrain == "plain")
//        accessPointCount = accessPointCount + 1;

//    logger.log("sourceModel", "retrieveSourceAccessPointCount", this.id + " - Access points found: " + accessPointCount, logger.debugFlag.INFORMATION);
//    return accessPointCount;
//}
    
////Determines if the source is at capacity
//SourceModel.prototype.retrieveIsSourceAtCapacity = function (source) {
//    logger.log("sourceModel", "retrieveIsSourceAtCapacity", this.id + " - Started", logger.debugFlag.VERBOSE);
//    //Iterate through all creeps to count the number of harvester creeps with this as a source. If this is equal or above the accessPointCount then return true else false.
//    var activeHarvesterCount = 0;

//    //If there are less than two constructors then a constructor is needed.
//    var creeps = Game.rooms[source.room.name].find(FIND_MY_CREEPS, {
//        filter: { job: "harvester" }
//    });
    
//    for (i = 0; i < creeps.length; i++) {
//        var creepModel = creeps[i].creepModel;
//        if (creepModel != null) {
//            if (creepModel.sourceID != null && creepModel.sourceID == source.id)
//                activeHarvesterCount++;
//        }
//    }

//    if (activeHarvesterCount < this.accessPointCount)
//        return 0;
//    else 
//        return 1;
//}

module.exports = SourceModel;