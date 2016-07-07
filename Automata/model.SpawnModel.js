/*
 * sourceModel - Contains data to allow the controller to make decisions.
 */
//References
var logger = require('common.Logger');

//Constructor - Creates the model for a given source.
var SpawnModel =  function (spawn) {
    /*
    * Properties
    */
    //The ID of the source.
    this.id = null;
    //The ID of the container.
    this.containerID = null;
    //Spawn on lock down.
    this.isEnergyRestricted = 0;

    logger.log("SpawnModel", "SpawnModel", this.id + " - Started", logger.debugFlag.VERBOSE);
    //In the create load items that do not change with time - id.
    this.id = spawn.id;
}

module.exports = SpawnModel;