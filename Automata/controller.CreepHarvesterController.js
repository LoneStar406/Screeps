/*
 * CreepHarvesterController - Controls creeps.
 */
//References
var logger = require('common.Logger');
var roomModelref = require('model.RoomModel');
var creepModelref = require('model.CreepModel');

//Constructor - Controls the given creep
var CreepHarvesterController = function (creep, roomModel) {
    /*
    * Properties
    */
    this.creep = creep;
    this.roomModel = roomModel;
    this.creepModel = this.retrieveCreepModel(creep);
    logger.log("CreepHarvesterController", "CreepHarvesterController", creep.name + " - Started", logger.debugFlag.VERBOSE);
}

/*
* Functions
*/
//Runs the creep controller.
CreepHarvesterController.prototype.run = function () {
    //Harvester creeps have a very simple life.
    //If Source or Target are empty populate both.
    //If not full move to the source and mine.
    //If full move to the target and drop energy.
    
    //If Source or Target are empty populate both.

    //We want the creep to follow a long term path of mining to the source container.
    //We do not want to ever wipe the source and destination IDs.
    //However if the creep is dropping to the spawn and a container is built at the spawn or the source the destination should be updated.
    //Original
    //The creep may have no destination while mining source.
    //Never set the source to null
    
    //var sourceModel = this.findSourceModel(this.creep);
    if (this.creepModel.sourceID == null || this.creepModel.destinationID == null) {
        if (this.creepModel.sourceID == null) {
            var sourceModel = this.findSourceModel(this.creep);
        }
        else
            var sourceModel = this.findCurrentSourceModel(this.creepModel.sourceID);
        //Wipe path to ensure data sanity
        //this.creepModel.sourceID = null;
        this.creepModel.destinationID = null;
        if (sourceModel == null) {
            logger.log("CreepHarvesterController", "run", this.creep.name + " - No source found - creep stalled", logger.debugFlag.WARNING);
            this.creepModel.destinationID = null;
        }
        else {
            this.creepModel.sourceID = sourceModel.id;
            this.creepModel.destinationID = this.findDestinationID(sourceModel, this.roomModel);
            if (this.creepModel.destinationID == null) {
                logger.log("CreepHarvesterController", "run", this.creep.name + " - No destination found - creep stalled", logger.debugFlag.WARNING);
                //Wipe path to ensure data sanity
                this.creepModel.sourceID = null;
            }
        }
    }
    
    if (this.creepModel.sourceID != null && this.creepModel.destinationID != null) {
        //If not full move to the source and mine.
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            if (this.creep.harvest(Game.getObjectById(this.creepModel.sourceID)) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(Game.getObjectById(this.creepModel.sourceID));
            }
        }
        else {
            //Check the destination is accurate if the destination is not the source container ensure that it is either the spawn container or the spawn
            //find matching room model in source model
            sourceModel = this.findCurrentSourceModel(this.creepModel.sourceID);
            if (sourceModel != null && sourceModel.containerID != null && sourceModel.containerID != this.creepModel.destinationID) {
                this.creepModel.destinationID = this.findDestinationID(sourceModel, this.roomModel);
            }
            var result = null;
            //logger.log("CreepMuleController", "run", this.creep.name + " - Type of test: " + sourceObject.body, logger.debugFlag.INFORMATION);
            result = this.creep.transfer(Game.getObjectById(this.creepModel.destinationID), RESOURCE_ENERGY)
            if (result == OK) {
                //  Once the energy is loaded then the route is repeated.
                logger.log("CreepHarvesterController", "run", this.creep.name + " - Route completed. Creating new route.", logger.debugFlag.INFORMATION);
            }
            else if (result == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(Game.getObjectById(this.creepModel.destinationID));
                logger.log("CreepHarvesterController", "run", this.creep.name + " - Moving to destination: " + this.creepModel.destinationID, logger.debugFlag.VERBOSE);
            }
            else if (result == ERR_INVALID_TARGET) {
                this.creepModel.destinationID = null;
                logger.log("CreepHarvesterController", "run", this.creep.name + " - Invalid destination: " + this.creepModel.destinationID + " - Creating new route.", logger.debugFlag.VERBOSE);
            }
            else if (result == ERR_FULL) {
                this.creepModel.destinationID = null;
                logger.log("CreepHarvesterController", "run", this.creep.name + " - Invalid destination: " + this.creepModel.destinationID + " - Destination full. Creep stalled.", logger.debugFlag.WARNING);
            }
        }


    }
}

CreepHarvesterController.prototype.retrieveCreepModel = function (creep)
{
    //If the memory is not currently populated create a creep model. Otherwise return.
    if (this.creep.memory.creepModel == null)
    {
        this.creep.memory.creepModel = new creepModelref(creep);
    }
    return this.creep.memory.creepModel;
}

CreepHarvesterController.prototype.findSourceModel = function (creep)
{
    //This method is used to find a source which is currently not at capacity.

    for (i = 0; i < this.roomModel.sourceModels.length; i++) {
        if (this.roomModel.sourceModels[i].isSourceIgnored == 0 && this.roomModel.sourceModels[i].isSourceAtCapacity == 0) {
            return this.roomModel.sourceModels[i];
        }
    }
    return null;
}

CreepHarvesterController.prototype.findCurrentSourceModel = function (sourceID) {
    //This method is used to find a source which is currently not at capacity.

    for (i = 0; i < this.roomModel.sourceModels.length; i++) {
        if (this.roomModel.sourceModels[i].id == sourceID) {
            return this.roomModel.sourceModels[i];
        }
    }
    return null;
}

CreepHarvesterController.prototype.findDestinationID = function (sourceModel, roomModel) {
    //If the source does not have a container assigned drop all energy at the spawn conatiner else the spawn.
    if (sourceModel.containerID == null) {

        if (roomModel.spawnModels[0].containerID != null) {
            return roomModel.spawnModels[0].containerID;
        }
        else {
            return roomModel.spawnModels[0].id;
        }
        return Game.spawns.Spawn1.id;
    }
    else
        return sourceModel.containerID;
}

module.exports = CreepHarvesterController;