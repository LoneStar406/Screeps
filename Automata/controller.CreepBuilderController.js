/*
 * CreepBuilderController - Controls creeps.
 */
//References
var logger = require('common.Logger');
var RoomModel = require('model.RoomModel');
var CreepModel = require('model.CreepModel');

//Constructor - Controls the given creep
var CreepBuilderController = function (creep, roomModel) {
    /*
    * Properties
    */
    //Minimum energy to interest a builder to load.
    this._builderEnergyMinimumLoad = 50;
    //Minimum energy for a builder to build with.
    this._builderEnergyMinimumToBuild = 10;
    this.creep = creep;
    this.roomModel = roomModel;
    this.creepModel = this.retrieveCreepModel(creep);
    logger.log("CreepBuilderController", "CreepBuilderController", creep.name + " - Started", logger.debugFlag.VERBOSE);
}

/*
* Functions
*/
//Runs the creep controller.
CreepBuilderController.prototype.run = function () {
    //If a builder has no destination then a the closest structure will be selected and loaded into the destination.
    //If a builder has a destination and non-0 energy then they work to complete the job until done or out of energy.
    //  Once the building is completed then the destination is cleared.
    //If the builder has a destination and is out of energy and a source does not exist the nearest container, spawn or harvester to the destination will be selected as the source.
    //If the builder has a destination and is out of energy and a source exists the builder will move towards the source and attempt to load energy.
    //  Once the energy is loaded thent the source is cleared.

    logger.log("CreepBuilderController", "run", this.creep.name + " - Started", logger.debugFlag.VERBOSE);

    //this.findNearestEnergyID(this.creepModel.destinationID);


    //If a builder has no destination then a the closest structure will be selected and loaded into the destination otherwise the rooms controller will be loaded as a target.
    //If the destination is the rooms controller - try to recalculate.
    if (this.creepModel.destinationID == null || (Game.getObjectById(this.creepModel.destinationID) != null && Game.getObjectById(this.creepModel.destinationID).structureType == STRUCTURE_CONTROLLER)) {
        this.creepModel.destinationID = this.findBuildingTargetID(this.creep, this.roomModel);
        if (this.creepModel.destinationID == null)
            logger.log("CreepBuilderController", "run", this.creep.name + " - No new build target found - creep stalled", logger.debugFlag.WARNING);
        else
            logger.log("CreepBuilderController", "run", this.creep.name + " - New target found: " + this.creepModel.destinationID, logger.debugFlag.INFORMATION);
    }
    //If no destination stop
    if (this.creepModel.destinationID != null) {
        var destinationObject = Game.getObjectById(this.creepModel.destinationID);
        //If the destination has vanished then repair object
        if (destinationObject == null)
        {
            this.creepModel.destinationID = null;
            this.creepModel.sourceID = null;
            logger.log("CreepBuilderController", "run", this.creep.name + " - Invalid destination: " + this.creepModel.destinationID + " - Selecting new target next round", logger.debugFlag.ERROR);
            return;
        }
        //If a builder has a destination and non-0 energy then they work to complete the job until done or out of energy.
        if (this.creep.carry.energy >= this._builderEnergyMinimumToBuild) {
            var result = null;
            if (destinationObject.level != null)
            {
                //Treat as controller
                result = this.creep.upgradeController(destinationObject);
            }
            else
            {
                //Treat as construction location
                result = this.creep.build(destinationObject);
            }
            if (result == OK) {
                logger.log("CreepBuilderController", "run", this.creep.name + " - Building target: " + this.creepModel.destinationID, logger.debugFlag.VERBOSE);
            }
            else if (result == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(destinationObject);
                logger.log("CreepBuilderController", "run", this.creep.name + " - Moving to target: " + this.creepModel.destinationID, logger.debugFlag.VERBOSE);
            }
            else if (result == ERR_INVALID_TARGET) {
                this.creepModel.destinationID = null;
                logger.log("CreepBuilderController", "run", this.creep.name + " - Invalid target: " + this.creepModel.destinationID + " - Selecting new target next round", logger.debugFlag.VERBOSE);
            }
        }
        else
        {
            //If the builder has a destination and is out of energy and a source does not exist the nearest container, spawn or harvester to the destination will be selected as the source.
            //If the destination id is a controller - reset destination and source.
            //if (Game.getObjectById(this.creepModel.destinationID).structureType == STRUCTURE_CONTROLLER)
            //{
            //    this.creepModel.sourceID = null;
            //    this.creepModel.destinationID = null;
            //    return;
            //}
            if (this.creepModel.sourceID == null)
            {
                this.creepModel.sourceID = this.findNearestEnergyID(this.creepModel.destinationID, this.roomModel);
                if (this.creepModel.sourceID == null)
                    logger.log("CreepBuilderController", "run", this.creep.name + " - No New energy source found - creep stalled", logger.debugFlag.INFORMATION);
                else
                    logger.log("CreepBuilderController", "run", this.creep.name + " - New energy source found: " + this.creepModel.sourceID, logger.debugFlag.INFORMATION);
            }
            //If no source stop
            if (this.creepModel.sourceID != null) {
                var sourceObject = Game.getObjectById(this.creepModel.sourceID);
                if (sourceObject == null)
                {
                    //If source has disappeared - remove current path.
                    logger.log("CreepBuilderController", "run", this.creep.name + " - Invalid source: " + this.creepModel.sourceID + " - Selecting new target next round", logger.debugFlag.ERROR);
                    this.creepModel.sourceID = null;
                    return;
                }
                //If the builder has a destination and is out of energy and a source exists the builder will move towards the source and attempt to load energy.
                //var energyToTransfer
                var result = null;
                //logger.log("CreepBuilderController", "run", this.creep.name + " - Type of test: " + sourceObject.body, logger.debugFlag.INFORMATION);
                if (sourceObject.name == null || (sourceObject.name != null && sourceObject.body != null)) {
                    //Treat as creep or container
                    result = sourceObject.transfer(this.creep, RESOURCE_ENERGY)
                }
                else {
                    //Treat as source
                    result = sourceObject.transferEnergy(this.creep)
                }
                if (result == OK) {
                    //  Once the energy is loaded thent the source is cleared.
                    this.creepModel.sourceID = null;
                    logger.log("CreepBuilderController", "run", this.creep.name + " - Took energy from source: " + this.creepModel.sourceID, logger.debugFlag.VERBOSE);
                }
                else if (result == ERR_NOT_IN_RANGE) {
                    var moveResult = this.creep.moveTo(sourceObject);
                    if (moveResult == ERR_NO_PATH) {
                        //Clear source object
                        logger.log("CreepBuilderController", "run", this.creep.name + " - No path to source: " + this.creepModel.sourceID + " - Selecting new source next round", logger.debugFlag.ERROR);
                        this.creepModel.sourceID = null;
                    }
                    logger.log("CreepBuilderController", "run", this.creep.name + " - Moving to source: " + this.creepModel.sourceID, logger.debugFlag.VERBOSE);
                }
                else if (result == ERR_INVALID_TARGET) {
                    this.creepModel.sourceID = null;
                    logger.log("CreepBuilderController", "run", this.creep.name + " - Invalid source: " + this.creepModel.sourceID + " - Selecting new source next round", logger.debugFlag.ERROR);
                }
                else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                    this.creepModel.sourceID = null;
                    logger.log("CreepBuilderController", "run", this.creep.name + " - Invalid source: " + this.creepModel.sourceID + " - Selecting new source next round", logger.debugFlag.ERROR);
                }
            }
        }
    }
}

CreepBuilderController.prototype.retrieveCreepModel = function (creep) {
    //If the memory is not currently populated create a creep model. Otherwise return.
    if (this.creep.memory.creepModel == null) {
        this.creep.memory.creepModel = new CreepModel(creep);
    }
    return this.creep.memory.creepModel;
}

CreepBuilderController.prototype.findBuildingTargetID = function (creep, roomModel) {
    //This method is used to find the closest incomplete structure to the creep otherwise the rooms controller.
    logger.log("CreepBuilderController", "findBuildingTargetID", this.creep.name + " - Search Result:" + creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES), logger.debugFlag.VERBOSE);
    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target == null) {
        //If no building target select the room's controller.
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTROLLER);// && structure.energy < structure.energyCapacity;
            }
        });
        logger.log("CreepBuilderController", "findBuildingTargetID", this.creep.name + " - Controller found:" + targets, logger.debugFlag.VERBOSE);
        return targets[0].id;
    }
    else return target.id;
    //return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
}
CreepBuilderController.prototype.findNearestEnergyID = function (destinationID, roomModel) {
    logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - Started", logger.debugFlag.VERBOSE);
    //Returns the nearest container, spawn or harvester to the destination
    //Only use spawns and harvesters if there is no assigned container
    //Build an array with all objects and harvester creeps
    //Find all containers with non 0 energy
    var containerCount = 0;
    var spawnCount = 0;
    var harvesterCount = 0;
    
    var targets = Game.rooms[roomModel.roomName].find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > this._builderEnergyMinimumLoad);
        }
    });
    //logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - DEBUG - targets: " + targets.length, logger.debugFlag.INFORMATION);
    containerCount = targets.length;
    //Add spawn if roomis not on energy lock down, spawn has no container and has energy
    if (roomModel.isEnergyRestricted == 0) {
        for (i = 0; i < roomModel.spawnModels.length; i++) {
            if (roomModel.spawnModels[i].containerID == null && Game.getObjectById(roomModel.spawnModels[i].id).energy > this._builderEnergyMinimumLoad) {
                targets[targets.length] = Game.getObjectById(roomModel.spawnModels[i].id);
                spawnCount++;
            }
        }
    }
    //var targetsDebug = Game.rooms[Game.getObjectById(destinationID).pos.roomName].find(FIND_STRUCTURES, {
    //    filter: (structure) => {
    //        return ((structure.structureType == STRUCTURE_SPAWN) ||
    //            (structure.structureType == STRUCTURE_CONTAINER))
    //        //((structure.energy != null && structure.energy > this._builderEnergyMinimumLoad) ||
    //        //(structure.store != null && structure.store.energy > this._builderEnergyMinimumLoad)));
    //    }
    //});
    ////Iterate through debug result
    //for (i = 0; i < targetsDebug.length; i++) {
    //    logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - Target: " + targetsDebug[i].id + " - Type: " + targetsDebug[i].structureType, logger.debugFlag.VERBOSE);
    //}
    //Find all harvesters with non 0 energy and a source with no container.
    //Create an array of sources with no containers
    var sourceTargetIDs = [];
    var j = 0;
    for (i = 0; i < roomModel.sourceModels.length; i++) {
        if (roomModel.sourceModels[i].isSourceIgnored == 0 && roomModel.sourceModels[i].containerID == null)
            sourceTargetIDs[sourceTargetIDs.length] = roomModel.sourceModels[i].id;
    }
    logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - sourceTargetIDs found: " + sourceTargetIDs.length, logger.debugFlag.VERBOSE);
    if (sourceTargetIDs.length > 0) {
        logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - sourceTargetIDs found: " + sourceTargetIDs.length, logger.debugFlag.VERBOSE);
        //logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - Creep entergy test - Jake energy: " + Game.creeps["Jake"].carry.energy, logger.debugFlag.VERBOSE);
        var creeps = Game.rooms[Game.getObjectById(destinationID).room.name].find(FIND_MY_CREEPS, { "filter": this.selectHarvestersWithEnergy });
        //Iterate thorugh harvesters 
        logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - creeps found: " + creeps.length, logger.debugFlag.VERBOSE);
        var isFound = 0;
        for (i = 0; i < creeps.length; i++) {
            isFound = 0;
            for (j = 0; j < sourceTargetIDs.length; j++) {
                //If harvester matches source is found
                if (creeps[i].memory.creepModel.sourceID == sourceTargetIDs[j])
                    isFound = 1;
            }
            if (isFound = 1) {
                //Add creeps to target array
                targets[targets.length] = creeps[i];
                harvesterCount++;
            }
        }
    }
    logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - Number containers with energy found: " + containerCount + " - Number spawns with energy found: " + spawnCount + " - Number harvesters with energy found: " + harvesterCount, logger.debugFlag.VERBOSE);

    // logger.log("CreepBuilderController", "findNearestEnergyID", this.creep.name + " - Final number of targets: " + targets.length, logger.debugFlag.VERBOSE);

    var target = Game.getObjectById(destinationID).pos.findClosestByPath(targets);
    if (target == null)
        return null;
    else return target.id;
}

//CreepBuilderController.prototype.findDestinationID = function (sourceModel) {
//    //If the source does not have a container assigned drop all energy at the spawn.
//    if (sourceModel.containerID == null)
//        return Game.spawns.Spawn1.id;
//    else
//        return sourceModel.containerID;
//}
CreepBuilderController.prototype.selectHarvestersWithEnergy = function (creep) {

    return creep.memory.role == "harvester" && creep.carry.energy >= 10;
}


module.exports = CreepBuilderController;