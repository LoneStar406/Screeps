/*
 * CreepMuleController - Controls creeps.
 */
//References
var logger = require('common.Logger');
var RoomModel = require('model.RoomModel');
var CreepModel = require('model.CreepModel');

//Constructor - Controls the given creep
var CreepMuleController = function (creep, roomModel) {
    /*
    * Properties
    */
    //Minimum energy to interest a mule to load.
    this._muleEnergyMinimumLoad = 100;
    //Minimum energy to interest a mule to transport.
    this._muleEnergyMinimumToTransport = 50;

    this.creep = creep;
    this.roomModel = roomModel;
    this.creepModel = this.retrieveCreepModel(creep);
    logger.log("CreepMuleController", "CreepMuleController", creep.name + " - Started", logger.debugFlag.VERBOSE);
}

/*
* Functions
*/
//Runs the creep controller.
CreepMuleController.prototype.run = function () {
    //The purpose of a mule is to bring energy to where it is needed.
    //The first need is to pull energy from the source containers to the central spawn.

    //The mule discovers a purpose by finding a prioritized source and destination.
    //If the mule is empty the mule retrieves energy from the source.
    //The mule drops energy to the destination, at which point the source and destination are removed.
    logger.log("CreepMuleController", "run", this.creep.name + " - Started", logger.debugFlag.VERBOSE);
    if (this.creepModel.sourceID == null || this.creepModel.destinationID == null) {
        this.creepModel = this.loadPrioritizedRoute(this.creepModel, this.roomModel);
    }
    //Check to see if a route is found.
    if (this.creepModel.sourceID == null || this.creepModel.destinationID == null) {
        logger.log("CreepMuleController", "run", this.creep.name + " - No new route found - creep stalled", logger.debugFlag.WARNING);
    }
    else {
        if (this.creep.carry.energy < this._muleEnergyMinimumToTransport) {
            //If the mule is empty the mule retrieves energy from the source.
            var sourceObject = Game.getObjectById(this.creepModel.sourceID);
            var result = null;
            var sourceEnergy = 0;
            //logger.log("CreepMuleController", "run", this.creep.name + " - Type of test: " + sourceObject.body, logger.debugFlag.INFORMATION);
            if (sourceObject.name == null) {
                //Treat as container
                result = sourceObject.transfer(this.creep, RESOURCE_ENERGY)
                sourceEnergy = sourceObject.store.energy;
            }
            else if(sourceObject.name != null && sourceObject.body != null) {
                //Treat as creep
                result = sourceObject.transfer(this.creep, RESOURCE_ENERGY)
                sourceEnergy = sourceObject.carry.energy;
            }
            else {
                //Treat as spawn
                result = sourceObject.transferEnergy(this.creep)
                sourceEnergy = sourceObject.energy;
            }
            //logger.log("CreepMuleController", "run", this.creep.name + " - DEBUG Transfer from source result: " + result, logger.debugFlag.INFORMATION);
            if (result == OK) {
                logger.log("CreepMuleController", "run", this.creep.name + " - Took energy from source: " + this.creepModel.sourceID, logger.debugFlag.VERBOSE);
                //Check if sufficient energy is loaded to transport otherwise regenerate route.
                //Note that here this.creep.carry.energy will still be low
                logger.log("CreepMuleController", "run", this.creep.name + " - targetEnergy: " + this.creep.carry.energy + sourceEnergy + " - this._muleEnergyMinimumToTransport: " + this._muleEnergyMinimumToTransport, logger.debugFlag.VERBOSE);
                if (this.creep.carry.energy + sourceEnergy < this._muleEnergyMinimumToTransport) {
                    this.creepModel.sourceID = null;
                    this.creepModel.destinationID = null;
                    logger.log("CreepMuleController", "run", this.creep.name + " - Took insufficient energy from source " + this.creepModel.sourceID + " to make route efficient. Creating new route.", logger.debugFlag.WARNING);
                }
            }
            else if (result == ERR_NOT_IN_RANGE) {
                //logger.log("CreepMuleController", "run", this.creep.name + " - DEBUG Moving to source: " + this.creepModel.sourceID, logger.debugFlag.INFORMATION);
                var moveResult = this.creep.moveTo(sourceObject);
                if (moveResult == ERR_NO_PATH) {
                    //Clear source object
                    logger.log("CreepMuleController", "run", this.creep.name + " - No path to source: " + this.creepModel.sourceID + " - Selecting new route next round", logger.debugFlag.ERROR);
                    this.creepModel.sourceID = null;
                    this.creepModel.destinationID = null;
                }
                logger.log("CreepMuleController", "run", this.creep.name + " - Moving to source: " + this.creepModel.sourceID, logger.debugFlag.VERBOSE);
            }
            else if (result == ERR_INVALID_TARGET) {
                this.creepModel.sourceID = null;
                this.creepModel.destinationID = null;
                logger.log("CreepMuleController", "run", this.creep.name + " - Invalid source: " + this.creepModel.sourceID + " - Creating new route.", logger.debugFlag.VERBOSE);
            }
            else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                this.creepModel.sourceID = null;
                this.creepModel.destinationID = null;
                logger.log("CreepMuleController", "run", this.creep.name + " - Source depleated: " + this.creepModel.sourceID + " - Creating new route.", logger.debugFlag.VERBOSE);
            }
        }
        else {
            //The mule drops energy to the destination, at which point the source and destination are removed.
            var destinationObject = Game.getObjectById(this.creepModel.destinationID);
            var result = null;
            //logger.log("CreepMuleController", "run", this.creep.name + " - Type of test: " + sourceObject.body, logger.debugFlag.INFORMATION);
            result = this.creep.transfer(destinationObject, RESOURCE_ENERGY)
            if (result == OK) {
                //  Once the energy is loaded then the route is cleared.
                this.creepModel.sourceID = null;
                this.creepModel.destinationID = null;
                logger.log("CreepMuleController", "run", this.creep.name + " - Route completed. Creating new route.", logger.debugFlag.INFORMATION);
            }
            else if (result == ERR_NOT_IN_RANGE) {
                var moveResult = this.creep.moveTo(destinationObject);
                if (moveResult == ERR_NO_PATH) {
                    //Clear source object
                    logger.log("CreepMuleController", "run", this.creep.name + " - No path to destination: " + this.creepModel.destinationID + " - Selecting new route next round", logger.debugFlag.ERROR);
                    this.creepModel.sourceID = null;
                    this.creepModel.destinationID = null;
                }
                    logger.log("CreepMuleController", "run", this.creep.name + " - Moving to destination: " + this.creepModel.destinationID, logger.debugFlag.VERBOSE);
            }
            else if (result == ERR_INVALID_TARGET) {
                this.creepModel.sourceID = null;
                this.creepModel.destinationID = null;
                logger.log("CreepMuleController", "run", this.creep.name + " - Invalid destination: " + this.creepModel.destinationID + " - Creating new route.", logger.debugFlag.VERBOSE);
            }
            else if (result == ERR_FULL) {
                this.creepModel.sourceID = null;
                this.creepModel.destinationID = null;
                logger.log("CreepMuleController", "run", this.creep.name + " - Destination full: " + this.creepModel.destinationID + " - Creating new route.", logger.debugFlag.VERBOSE);
            }
        }
    }
}

CreepMuleController.prototype.retrieveCreepModel = function (creep) {
    //If the memory is not currently populated create a creep model. Otherwise return.
    if (creep.memory.creepModel == null) {
        creep.memory.creepModel = new CreepModel(creep);
    }
    return creep.memory.creepModel;
}


CreepMuleController.prototype.loadPrioritizedRoute = function (creepModel, roomModel) {
    logger.log("CreepMuleController", "loadPrioritizedRoute", this.creep.name + " - Started", logger.debugFlag.VERBOSE);

    //Priority list
    var routeName = null;
    //1 - keep the Spawn topped up from its container.
    if (roomModel.spawnModels[0].containerID != null) {
        var spawn = Game.getObjectById(roomModel.spawnModels[0].id);
        var spawnContainer = Game.getObjectById(roomModel.spawnModels[0].containerID);
        if (spawn.energy < spawn.energyCapacity && spawnContainer.store.energy > this._muleEnergyMinimumLoad) {
            creepModel = this.loadRouteSpawnContainerSpawn(creepModel, roomModel);
            routeName = "SpawnContainerSpawn";
        }
    }
    //2 - keep the extenders topped up from the spawns container.
    if (routeName == null) {
        creepModel = this.loadRouteSpawnContainerExtension(creepModel, roomModel);
        if (creepModel.sourceID != null && creepModel.destinationID != null)
            routeName = "SpawnContainerExtension";
    }
    if (routeName == null) {
        //3 - routeSourceSpawn move energy from the source containers to the central Spawn
        creepModel = this.loadRouteSourceSpawn(creepModel, roomModel);
        routeName = "SourceSpawn";
    }
    logger.log("CreepMuleController", "loadPrioritizedRoute", this.creep.name + " - New mule route: " + routeName + ", Source: " + creepModel.sourceID + ", Target: " + creepModel.destinationID, logger.debugFlag.INFORMATION);
    return creepModel;
}

CreepMuleController.prototype.loadRouteSpawnContainerSpawn = function (creepModel, roomModel) {
    //Loads from the container of the spawn to the spawn
    logger.log("CreepMuleController", "loadRouteSpawnContainerSpawn", this.creep.name + " - Started", logger.debugFlag.VERBOSE);
    //Wipe source and destination for data consistancy.
    creepModel.sourceID = null;
    creepModel.destinationID = null;
    creepModel.destinationID = roomModel.spawnModels[0].id;
    creepModel.sourceID = roomModel.spawnModels[0].containerID;
    return creepModel;
}
CreepMuleController.prototype.loadRouteSpawnContainerExtension = function (creepModel, roomModel) {
    //Loads from the container of the spawn to the spawn
    logger.log("CreepMuleController", "loadRouteSpawnContainerSpawn", this.creep.name + " - Started", logger.debugFlag.VERBOSE);
    //Wipe source and destination for data consistancy.
    creepModel.sourceID = null;
    creepModel.destinationID = null;
    if (roomModel.spawnModels[0].containerID != null && Game.getObjectById(roomModel.spawnModels[0].containerID).store.energy > this._muleEnergyMinimumLoad) {
        //Find an extension which is not full.
        var targets = Game.rooms[roomModel.roomName].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)
            }
        });
        if (targets.length > 0) {
            creepModel.destinationID = targets[0].id;
            creepModel.sourceID = roomModel.spawnModels[0].containerID;
        }
    }
    return creepModel;
}
CreepMuleController.prototype.loadRouteSourceSpawn = function (creepModel, roomModel) {
    //Loads the mule route SourceSpawn
    logger.log("CreepMuleController", "loadRouteSourceSpawn", this.creep.name + " - Started", logger.debugFlag.VERBOSE);
    //Wipe source and destination for data consistancy.
    creepModel.sourceID = null;
    creepModel.destinationID = null;
    var creep = Game.getObjectById(creepModel.id);
    //Iterate through all containers of sources to find a container which contains a minimum load
    //Load targets from sourceModels
    var targets = [];
    for (i = 0; i < roomModel.sourceModels.length; i++) {
        if (roomModel.sourceModels[i].containerID != null) {
            var source = Game.getObjectById(roomModel.sourceModels[i].containerID);
            logger.log("CreepMuleController", "loadRouteSourceSpawn", this.creep.name + " - Energy in container: " + source.store.energy, logger.debugFlag.VERBOSE);
            if (source.store.energy > this._muleEnergyMinimumLoad)
                targets[targets.length] = source;
        }
    }
    logger.log("CreepMuleController", "loadRouteSourceSpawn", this.creep.name + " - Source containers found: " + targets.length, logger.debugFlag.VERBOSE);
    if (targets.length != 0) {
        var source = creep.pos.findClosestByRange(targets);
        if (source != null) {
            //Find target. //This should be the main spawn container or the main spawn.
            //If 
            if (roomModel.spawnModels[0].containerID != null) {
                creepModel.destinationID = roomModel.spawnModels[0].containerID;
                creepModel.sourceID = source.id;
            }
            else {
                creepModel.destinationID = roomModel.spawnModels[0].id;
                creepModel.sourceID = source.id;
            }
        }
    }
    return creepModel;
}


module.exports = CreepMuleController;