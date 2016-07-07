/*
 * creepController - Controls creeps.
 */
//References
var logger = require('common.Logger');
var roomModelref = require('model.RoomModel');
var CreepHarvesterController = require('controller.CreepHarvesterController');
var CreepBuilderController = require('controller.CreepBuilderController');
var CreepMuleController = require('controller.CreepMuleController');

//Constructor - Controls the given creep
var CreepController = function (creep, roomModel) {
    /*
    * Properties
    */
    this.creep = creep;
    this.roomModel = roomModel;
    logger.log("CreepController", "CreepController", creep.id + " - Started", logger.debugFlag.VERBOSE);
}

/*
* Functions
*/
//Runs the creep controller.
CreepController.prototype.run = function () {
    if (this.creep.memory.role == 'harvester') {
        var creepController = new CreepHarvesterController(this.creep, this.roomModel);
        creepController.run();
    }
    else if (this.creep.memory.role == 'builder' && this.roomModel.isEmergencyMuleActActive == 0) {
        var creepController = new CreepBuilderController(this.creep, this.roomModel);
        creepController.run();
    }
    //if (creep.memory.role == 'upgrader' && _bUpgradersAreBuilders == 0 && _bPauseUpgraders == 0) {
    //    roleUpgrader.run(creep);
    //}
    else if (this.creep.memory.role == 'mule' || (this.creep.memory.role == 'builder' && this.roomModel.isEmergencyMuleActActive == 1)) {
        var creepController = new CreepMuleController(this.creep, this.roomModel);
        creepController.run();
    }
    //if (creep.memory.role == 'recycle') {
    //    roleRecycle.run(creep);
    //}
    //if (creep.memory.role == 'builderMiner') {
    //    roleBuilderMiner.run(creep);
    //}
}



module.exports = CreepController;