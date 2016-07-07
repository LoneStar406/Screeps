/*
 * roomController - Controls room functionality.
 */
//References
var logger = require('common.Logger');
var roomModel = require('model.RoomModel');
var creepModelRef = require('model.CreepModel');
var SourceModel = require('model.SourceModel');
var SpawnModel = require('model.SpawnModel');
var creepControllerRef = require('controller.CreepController');
var SourceController = require('controller.SourceController');

//Constructor - creates the controller for the room.
var RoomController = function (roomModel) {
    /*
    * Properties
    */
    this.roomModel = roomModel;

    logger.log("RoomController", "RoomController", this.roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    //Load the room model
}

/*
* Functions
*/
//Runs the room controller.
RoomController.prototype.run = function () {
    logger.log("RoomController", "run", this.roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    //Runs the CreepSpawn processor
    this.spawnCreeper();
    //Iterates through all creeps in the room and runs a controller for each.
    this.runCreepers();

    //var creeperBody = null;
    //creeperBody = this.returnCreepBody("builder", this.roomModel);
    //logger.log("RoomController", "run", this.roomModel.roomName + " - Debug creep requested: " + "builder" + " with body: " + creeperBody, logger.debugFlag.INFORMATION);
    //creeperBody = this.returnCreepBody("harvester", this.roomModel);
    //logger.log("RoomController", "run", this.roomModel.roomName + " - Debug creep requested: " + "harvester" + " with body: " + creeperBody, logger.debugFlag.INFORMATION);
    //creeperBody = this.returnCreepBody("mule", this.roomModel);
    //logger.log("RoomController", "run", this.roomModel.roomName + " - Debug creep requested: " + "mule" + " with body: " + creeperBody, logger.debugFlag.INFORMATION);
}

//Iterates through all creeps in the room and runs a controller for each.
RoomController.prototype.runCreepers = function () {
    logger.log("RoomController", "runCreepers", this.roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    var creeps = Game.rooms[this.roomModel.roomName].find(FIND_MY_CREEPS);
    for (i = 0; i < creeps.length; i++) {
        var creepController = new creepControllerRef(creeps[i], this.roomModel);
        creepController.run();
    }
}

//Spawns a creeper if needed.
RoomController.prototype.spawnCreeper = function () {
    logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    //Calls returnCreepTypeNeeded to get the type of creeper needed.
    var creeperTypeNeeded = this.returnCreepTypeNeeded();
    if (creeperTypeNeeded != null) {
        //logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - Creep needed: " + creeperTypeNeeded, logger.debugFlag.INFORMATION);
        //Calls returnCreepBody to get the desired body type.
        var creeperBodyTypeNeeded = this.returnCreepBody(creeperTypeNeeded, this.roomModel);
        //Finds the spawn and calls createCreep to spawn a creep.
        //var currentdate = new Date();
        //var datetime = "" + (currentdate.getMonth() + 1)
        //                + currentdate.getDate()
        //                + currentdate.getHours() 
        //                + currentdate.getMinutes()
        //                + currentdate.getSeconds();
        //Find name based on last spawned
        if (Memory.worldModel.creepCount == null)
            Memory.worldModel.creepCount = { harvester: 0, builder: 0, mule: 0 };
        var creepNumber = Memory.worldModel.creepCount[creeperTypeNeeded] + 1;
        //Memory.worldModel.creepCount = creepNumber;
        logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - Creep needed: " + creeperTypeNeeded + " with body: " + creeperBodyTypeNeeded + " with number: " + creepNumber, logger.debugFlag.INFORMATION);
        //logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - creeperTypeNeeded: " + creeperTypeNeeded + " creepNumber: " + creepNumber, logger.debugFlag.INFORMATION);
        var result = Game.spawns.Spawn1.createCreep(creeperBodyTypeNeeded, creeperTypeNeeded + "_" + creepNumber, { role: creeperTypeNeeded });
        switch(result) {
            case ERR_BUSY:
                logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - " + creeperTypeNeeded + " requested. Failed due to spawn busy.", logger.debugFlag.INFORMATION);
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - " + creeperTypeNeeded + " requested. Failed due to lack of energy.", logger.debugFlag.WARNING);
                break;
            case ERR_INVALID_ARGS:
                logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - " + creeperTypeNeeded + " requested. Failed due to invalid arguments.", logger.debugFlag.ERROR);
                break;
            case ERR_RCL_NOT_ENOUGH:
                logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - " + creeperTypeNeeded + " requested. Failed due to room Controller level is not enough to use this spawn.", logger.debugFlag.ERROR);
                break;
            default:
                Memory.worldModel.creepCount[creeperTypeNeeded] = creepNumber;
                logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - " + creeperTypeNeeded + " requested. Succeeded with result: " + result, logger.debugFlag.INFORMATION);
        }
        //logger.log("RoomController", "spawnCreeper", this.roomModel.roomName + " - Result of spawn: " + result, logger.debugFlag.INFORMATION);
    }
}
//Returns the type of creep needed otherwise null.
RoomController.prototype.returnCreepTypeNeeded = function () {
    logger.log("RoomController", "returnCreepTypeNeeded", this.roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    var result = null;
    this.roomModel.isEnergyRestricted = 0;
    //if any non ignored source is not at capacity then a harvester is needed.
    //Also Find count of active source models
    var activeSourceModels = 0;
    var activeSourceCountainerCount = 0;
    for (i = 0; i < this.roomModel.sourceModels.length; i++) {
        if (this.roomModel.sourceModels[i].isSourceIgnored == 0) {
            activeSourceModels++;
            if (this.roomModel.sourceModels[i].isSourceAtCapacity == 0) {
                //If a harvester is needed set all spawns on lockdown.
                this.roomModel.isEnergyRestricted = 1;
                return "harvester";
            }
            if (this.roomModel.sourceModels[i].containerID != null)
                activeSourceCountainerCount++
        }
    }
    
    var builderCount = 0;
    var muleCount = 0;
    //Find # of builders and mules by iterating through creeps
    var creeps = Game.rooms[this.roomModel.roomName].find(FIND_MY_CREEPS);
    for (i = 0; i < creeps.length; i++) {
        var creepModel = creeps[i].memory.creepModel;
        //logger.log("RoomController", "returnCreepBody", this.roomModel.roomName + " - Creeper found with role: " + creepModel.role, logger.debugFlag.WARNING);
        if (creepModel != null){
            if (creepModel.role == "builder") {
                builderCount++;
            }
            else if (creepModel.role == "mule") {
                muleCount++;
            }
        }
    }

    //ignore If there is one builder there should be one mule.
    //ignore If there are two builder there should be two mules.
    //ignore If there are less mules than sources with containers then a mule is needed.

    //Activate emergency mule act if there are builders and no mules.
    if (muleCount == 0 && builderCount > 0)
        this.roomModel.isEmergencyMuleActActive = 1;
    else
        this.roomModel.isEmergencyMuleActActive = 0;
    //Create one mule plus one mule per source if there is at least one active source container.
    //if (muleCount < 1 || (activeSourceCountainerCount > 1 && muleCount < 1 + activeSourceModels))
    //    return "mule";
    if (muleCount < 1 + activeSourceCountainerCount)
        return "mule";

    //If there are less than two constructors then a constructor is needed.
    //var creeps = Game.rooms[this.roomModel.roomName].find(FIND_MY_CREEPS, {
    //    filter: { role: "builder" }
    //});
    //Also two builders plus two builders per source container.
    if (builderCount < 2 + activeSourceCountainerCount * 3)
        return "builder";
    return null;    

}
//Returns the body of a creep based on the role provided.
RoomController.prototype.returnCreepBody = function (creeperType, roomModel) {
    logger.log("RoomController", "returnCreepBody", this.roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    //Determine available energy.
    var energyAvailable = Game.rooms[roomModel.roomName].energyCapacityAvailable;
    var creepBody = [];
    if (creeperType == "harvester")
    {
        //Harvester requires one CARRY and MOVE, fill the rest with WORK and any remainder with CARRY
        creepBody[creepBody.length] = CARRY;
        energyAvailable = energyAvailable - BODYPART_COST.carry;
        creepBody[creepBody.length] = MOVE;
        energyAvailable = energyAvailable - BODYPART_COST.move;
        while (energyAvailable >= BODYPART_COST.work) {
            creepBody[creepBody.length] = WORK;
            energyAvailable = energyAvailable - BODYPART_COST.work;
        }
        if (energyAvailable >= BODYPART_COST.carry) {
            creepBody[creepBody.length] = CARRY;
            energyAvailable = energyAvailable - BODYPART_COST.carry;
        }
        return creepBody;
    }
    else if (creeperType == "builder")
    {
        var movePartCount = 0;
        var workPartCount = 0;
        var carryPartCount = 0;
        //Builders require one CARRY, MOVE and WORK
        //Builders require to be mobile, requiring one move part for every two non move parts
        //Builders should take a maximum of 20 ticks to use all energy when constructing and so need one work for every two carry.

        //Builders one CARRY, MOVE and WORK
        creepBody[creepBody.length] = CARRY;
        energyAvailable = energyAvailable - BODYPART_COST.carry;
        carryPartCount++;
        creepBody[creepBody.length] = MOVE;
        energyAvailable = energyAvailable - BODYPART_COST.move;
        movePartCount++;
        creepBody[creepBody.length] = WORK;
        energyAvailable = energyAvailable - BODYPART_COST.work;
        workPartCount++;

        while (energyAvailable > 0) {
            //Builders require to be mobile, requiring one move part for every two non move parts
            if (movePartCount * 2 < carryPartCount + workPartCount) {
                creepBody[creepBody.length] = MOVE;
                energyAvailable = energyAvailable - BODYPART_COST.move;
                movePartCount++;
            }
            //Builders should take a maximum of 20 ticks to use all energy when constructing and so need one work for every two carry.
            else if (energyAvailable > BODYPART_COST.work && workPartCount * 2 < carryPartCount) {
                creepBody[creepBody.length] = WORK;
                energyAvailable = energyAvailable - BODYPART_COST.work;
                workPartCount++;
            }
            else {
                //Add carry
                creepBody[creepBody.length] = CARRY;
                energyAvailable = energyAvailable - BODYPART_COST.carry;
                carryPartCount++;
            }
        }
        return creepBody;
    }
    else if (creeperType == "mule") {
        var movePartCount = 0;
        var carryPartCount = 0;
        //Mules require one CARRY and MOVE
        //Mules require to be mobile, requiring one move part for every two non move parts

        //Mules require one CARRY and MOVE
        creepBody[creepBody.length] = CARRY;
        energyAvailable = energyAvailable - BODYPART_COST.carry;
        carryPartCount++;
        creepBody[creepBody.length] = MOVE;
        energyAvailable = energyAvailable - BODYPART_COST.move;
        movePartCount++;

        while (energyAvailable > 0) {
            //Builders require to be mobile, requiring one move part for every two non move parts
            if (movePartCount * 2 < carryPartCount) {
                creepBody[creepBody.length] = MOVE;
                energyAvailable = energyAvailable - BODYPART_COST.move;
                movePartCount++;
            }
            else {
                //Add carry
                creepBody[creepBody.length] = CARRY;
                energyAvailable = energyAvailable - BODYPART_COST.carry;
                carryPartCount++;
            }
        }
        return creepBody;
    }
    logger.log("RoomController", "returnCreepBody", this.roomModel.roomName + " - creeperType not recognised", logger.debugFlag.ERROR);
    return null;
}

/*
* Model Functions
*/
//Loads/reloads the model with current data.
RoomController.prototype.load = function (roomModel) {
    //In the load refresh items that do change with time - refresh source models
    logger.log("RoomController", "load", roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    //If the source models are null, reload
    if (roomModel.sourceModels == null)
        roomModel.sourceModels = this.retrieveSourceModels(roomModel.roomName);
    else {
        var i = 0;
        for (i = 0; i < roomModel.sourceModels.length; i++) {
            //Load source model using a controller
            var sourceController = new SourceController(roomModel.sourceModels[i]);
            sourceController.load(roomModel.sourceModels[i]);
        }
    }
    //If the source models are null, reload
    if (roomModel.spawnModels == null)
        roomModel.spawnModels = this.retrieveSpawnModels(roomModel.roomName);
    else {
        //Load the spawnModels
        for (i = 0; i < roomModel.spawnModels.length; i++) {
            //Load spawn model using a controller
            this.loadSpawnModel(roomModel.spawnModels[i]);
        }
    }
}

//Retrieves all of the source models for the object.
RoomController.prototype.retrieveSourceModels = function (roomName) {
    //Iterates through all sources in the room to load all source models.
    logger.log("RoomController", "retrieveSourceModels", roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    var sources = Game.rooms[roomName].find(FIND_SOURCES);
    var result = [];
    var i = 0;
    for (i = 0; i < sources.length; i++) {
        var sourceModel = new SourceModel(sources[i]);
        //Load source model using a controller
        var sourceController = new SourceController(sourceModel);
        sourceController.load(sourceModel);
        result[i] = sourceModel;
    }
    logger.log("RoomController", "retrieveSourceModels", roomModel.roomName + " - sourceModels created: " + result.length, logger.debugFlag.INFORMATION);
    return result;
}

//Retrieves all of the spawn models for the object.
RoomController.prototype.retrieveSpawnModels = function (roomName) {
    //Iterates through all sources in the room to load all spawn models.
    logger.log("RoomController", "retrieveSpawnModels", roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    var spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);
    var result = [];
    var i = 0;
    for (i = 0; i < spawns.length; i++) {
        var spawnModel = new SpawnModel(spawns[i]);
        //Load source model
        this.loadSpawnModel(spawnModel);
        result[i] = spawnModel;
    }
    logger.log("RoomController", "retrieveSpawnModels", roomModel.roomName + " - spawnModels created: " + result.length, logger.debugFlag.INFORMATION);
    return result;
}

RoomController.prototype.loadSpawnModel = function (spawnModel) {
    //Loads details that can change to a spawn model - containerID
    logger.log("RoomController", "retrieveSpawnModels", roomModel.roomName + " - Started", logger.debugFlag.VERBOSE);
    //Find the container - do this only while empty
    if (spawnModel.containerID == null)
        spawnModel.containerID = this.retrieveClosestContainerID(spawnModel.id, 3);
}

//Retrieves the ID of the closest container to the object within a range.
RoomController.prototype.retrieveClosestContainerID = function (roomObjectID, range) {
    //Retrieves the ID of the closest contatiner to the source within 3 squares.
    var roomObject = Game.getObjectById(roomObjectID);
    logger.log("RoomController", "retrieveClosestContainerID", roomObjectID + " - Started", logger.debugFlag.VERBOSE);
    var containers = roomObject.pos.findInRange(FIND_STRUCTURES, range, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER);
        }
    });

    if (containers.length > 0) {
        return containers[0].id;
    }
    else {
        logger.log("RoomController", "retrieveClosestContainerID", roomObjectID + " - Container not found", logger.debugFlag.VERBOSE);
        return null;
    }
}

module.exports = RoomController;