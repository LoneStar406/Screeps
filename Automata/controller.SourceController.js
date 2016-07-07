/*
 * sourceController - Controls creeps.
 */
//References
var logger = require('common.Logger');
var SourceModel = require('model.SourceModel');

//Constructor - Controls the given creep
var SourceController = function (sourceModel) {
    /*
    * Properties
    */
    this.sourceModel = sourceModel;
    logger.log("SourceController", "SourceController", sourceModel.id + " - Started", logger.debugFlag.VERBOSE);
}

/*
* Functions
*/
//Runs the source controller.
SourceController.prototype.run = function () {
    logger.log("SourceController", "run", this.sourceModel.id + " - Started", logger.debugFlag.VERBOSE);
}


/*
* Model Functions
*/
//Loads/reloads the model with current data.
SourceController.prototype.load = function (sourceModel) {
    //In the load refresh items that do change with time - containerID, isSourceAtCapacity.
    logger.log("SourceController", "load", sourceModel.id + " - Started", logger.debugFlag.VERBOSE);
    //Load accessPointCount if neeeded
    if (sourceModel.accessPointCount == null) {
        sourceModel.accessPointCount = this.retrieveSourceAccessPointCount(Game.getObjectById(sourceModel.id));
    }
    //Find the container - do this only while empty
    if (sourceModel.containerID == null)
        sourceModel.containerID = this.retrieveSourceContainerID(sourceModel);
    //Determines if the source is at capacity
    sourceModel.isSourceAtCapacity = this.retrieveIsSourceAtCapacity(sourceModel);
}

//Retrieves the ID of the closest container to the source.
SourceController.prototype.retrieveSourceContainerID = function (sourceModel) {
    //Retrieves the ID of the closest contatiner to the source within 3 squares.
    var source = Game.getObjectById(sourceModel.id);
    logger.log("SourceController", "retrieveSourceContainerID", source.id + " - Started", logger.debugFlag.VERBOSE);
    var containers = source.pos.findInRange(FIND_STRUCTURES, 3, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER);
        }
    });
    //logger.log("SourceController", "retrieveSourceContainerID", source.id + " - containers: " + containers.length, logger.debugFlag.WARNING);
    //var allContainers = Game.rooms[source.pos.roomName].find(FIND_STRUCTURES, {
    //    filter: (structure) => {
    //        return (structure.structureType == STRUCTURE_CONTAINER);
    //    }
    //});
    //logger.log("SourceController", "retrieveSourceContainerID", source.id + " - allContainers: " + allContainers.length, logger.debugFlag.WARNING);

    if (containers.length > 0) {
        logger.log("SourceController", "retrieveSourceContainerID", source.id + " - Container found: " + containers[0].id, logger.debugFlag.VERBOSE);
        //If found reset all current harvesters directions.
        //Find # of harvesters by iterating through creeps
        var creeps = Game.rooms[Game.getObjectById(sourceModel.id).room.name].find(FIND_MY_CREEPS, { "filter": this.selectHarvesters });
        for (i = 0; i < creeps.length; i++) {
            var creepModel = creeps[i].memory.creepModel;
            if (creepModel != null && creepModel.sourceID != null && creepModel.sourceID == sourceModel.id) {
                creepModel.destinationID = null;
            }
        }
        return containers[0].id;
    }
    else {
        logger.log("SourceController", "retrieveSourceContainerID", source.id + " - Container not found", logger.debugFlag.VERBOSE);
        return null;
    }
}

//Retrieves the count of access points to the source.
SourceController.prototype.retrieveSourceAccessPointCount = function (source) {
    //Scans each surrounding tile and counts the terrain which are plains or swamp.
    var accessPointCount = 0;

    var r;
    var terrain;
    logger.log("sourceController", "retrieveSourceAccessPointCount", source.id + " - Started", logger.debugFlag.VERBOSE);
    //console.log(source.pos);
    //r = new RoomPosition(10, 25, 'sim');
    r = new RoomPosition(source.pos.x - 1, source.pos.y + 1, source.pos.roomName);
    //console.log("createSourceModel - Look For Terrains");
    terrain = r.lookFor(LOOK_TERRAIN);
    //console.log("createSourceModel - " + s.id + " - NW terrain: " + terrain);
    if (terrain == "swamp" || terrain == "plain")
        accessPointCount = accessPointCount + 1;

    r = new RoomPosition(source.pos.x - 1, source.pos.y, source.pos.roomName);
    //console.log("createSourceModel - Look For Terrains");
    terrain = r.lookFor(LOOK_TERRAIN);
    //console.log("createSourceModel - " + s.id + " - W terrain: " + terrain);
    if (terrain == "swamp" || terrain == "plain")
        accessPointCount = accessPointCount + 1;

    r = new RoomPosition(source.pos.x - 1, source.pos.y - 1, source.pos.roomName);
    //console.log("createSourceModel - Look For Terrains");
    terrain = r.lookFor(LOOK_TERRAIN);
    //console.log("createSourceModel - " + s.id + " - SW terrain: " + terrain);
    if (terrain == "swamp" || terrain == "plain")
        accessPointCount = accessPointCount + 1;

    r = new RoomPosition(source.pos.x, source.pos.y + 1, source.pos.roomName);
    //console.log("createSourceModel - Look For Terrains");
    terrain = r.lookFor(LOOK_TERRAIN);
    //console.log("createSourceModel - " + s.id + " - N terrain: " + terrain);
    if (terrain == "swamp" || terrain == "plain")
        accessPointCount = accessPointCount + 1;

    r = new RoomPosition(source.pos.x, source.pos.y - 1, source.pos.roomName);
    //console.log("createSourceModel - Look For Terrains");
    terrain = r.lookFor(LOOK_TERRAIN);
    //console.log("createSourceModel - " + s.id + " - S terrain: " + terrain);
    if (terrain == "swamp" || terrain == "plain")
        accessPointCount = accessPointCount + 1;

    r = new RoomPosition(source.pos.x + 1, source.pos.y + 1, source.pos.roomName);
    //console.log("createSourceModel - Look For Terrains");
    terrain = r.lookFor(LOOK_TERRAIN);
    //console.log("createSourceModel - " + s.id + " - NE terrain: " + terrain);
    if (terrain == "swamp" || terrain == "plain")
        accessPointCount = accessPointCount + 1;

    r = new RoomPosition(source.pos.x + 1, source.pos.y, source.pos.roomName);
    //console.log("createSourceModel - Look For Terrains");
    terrain = r.lookFor(LOOK_TERRAIN);
    //console.log("createSourceModel - " + s.id + " - E terrain: " + terrain);
    if (terrain == "swamp" || terrain == "plain")
        accessPointCount = accessPointCount + 1;

    r = new RoomPosition(source.pos.x + 1, source.pos.y - 1, source.pos.roomName);
    //console.log("createSourceModel - Look For Terrains");
    terrain = r.lookFor(LOOK_TERRAIN);
    //console.log("createSourceModel - " + s.id + " - SE terrain: " + terrain);
    if (terrain == "swamp" || terrain == "plain")
        accessPointCount = accessPointCount + 1;

    logger.log("sourceController", "retrieveSourceAccessPointCount", source.id + " - Access points found: " + accessPointCount, logger.debugFlag.INFORMATION);
    return accessPointCount;
}

//Determines if the source is at capacity
SourceController.prototype.retrieveIsSourceAtCapacity = function (sourceModel) {
    logger.log("SourceController", "retrieveIsSourceAtCapacity", sourceModel.id + " - Started", logger.debugFlag.VERBOSE);
    //Iterate through all creeps to count the number of harvester creeps with this as a source. If this is equal or above the accessPointCount then return true else false.
    var activeHarvesterCount = 0;

    //var mycreeps = Game.rooms[Game.getObjectById(sourceModel.id).room.name].find(FIND_MY_CREEPS, { "filter": this.selectHarvesters });
    //logger.log("SourceController", "retrieveIsSourceAtCapacity", sourceModel.id + " - Number of harvester creeps found: " + mycreeps.length, logger.debugFlag.VERBOSE);

    //Find # of harvesters by iterating through creeps
    var creeps = Game.rooms[Game.getObjectById(sourceModel.id).room.name].find(FIND_MY_CREEPS, { "filter": this.selectHarvesters });
    //logger.log("SourceController", "retrieveIsSourceAtCapacity", sourceModel.id + " - Number of creeps found: " + creeps.length, logger.debugFlag.VERBOSE);
    for (i = 0; i < creeps.length; i++) {
        var creepModel = creeps[i].memory.creepModel;
        //logger.log("SourceController", "retrieveIsSourceAtCapacity", sourceModel.id + " - creepModel " + creeps[i].name + " sourceID: " + creepModel.sourceID, logger.debugFlag.VERBOSE);
        if (creepModel != null) {
            if (creepModel.sourceID != null && creepModel.sourceID == sourceModel.id)
                activeHarvesterCount++;
        }
    }
    logger.log("SourceController", "retrieveIsSourceAtCapacity", sourceModel.id + " - Active Harvester Count: " + activeHarvesterCount + ", Access Point Count: " + sourceModel.accessPointCount, logger.debugFlag.VERBOSE);

    if (activeHarvesterCount < sourceModel.accessPointCount)
        return 0;
    else
        return 1;
}

SourceController.prototype.selectHarvesters = function(creep) {
    return creep.memory.role == "harvester";
}

module.exports = SourceController;