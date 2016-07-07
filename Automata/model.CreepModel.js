/*
 * creepModel - Contains data to allow the controller to make decisions.
 */
//References
var logger = require('common.Logger');
var sourceModelref = require('model.SourceModel');

//Constructor - Creates the model for a given creep
var CreepModel = function (creep) {
    /*
    * Properties
    */
    //The ID of the creep
    this.id = creep.id;
    //The job of the creep
    this.role = creep.memory.role;
    //A flag indicating if the creep is busy.
    this.isBusy = 0;
    //The destination of the creep
    this.destinationID = null;
    //The source ID of the creep if applicable.
    this.sourceID = null;
    logger.log("CreepModel", "CreepModel", creep.id + " - Started", logger.debugFlag.VERBOSE);
}

CreepModel.prototype.setJob = function (role) {
    Game.getObjectById(this.id).memory.role = role;
    this.role = role;
}

module.exports = CreepModel;