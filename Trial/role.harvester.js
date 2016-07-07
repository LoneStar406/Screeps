var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var helperFindSource = require('helper.findSource');
        //Determine if at carrying capacity. If yes Unload else Load
        //If Unload if has unload target then unload to target else move to target.
        //If Load if has load target then load else move to target.
        if(creep.carry.energy < creep.carryCapacity) {
            //Find current target
            if (creep.memory.targetSource == null)
            {
                //If no target find a target
                //console.log(creep.room);
                creep.memory.targetSource = helperFindSource.findSource(creep);
                //If no target log and do nothing
                if (creep.memory.targetSource == null)
                {
                    console.log("Harvester creep with no source: " + creep.name);
                    return;
                }
            }
            //Now assuming that there is a target source. Move to the target source.
            //console.log(Game.getObjectById(creep.memory.targetSource.id));
            //console.log("Harvester action to sourc: " + creep.harvest(Game.getObjectById(creep.memory.targetSource.id)));
            if(creep.harvest(Game.getObjectById(creep.memory.targetSource.id)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.targetSource.id));
                
            //var sources = creep.room.find(FIND_SOURCES);
            //if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //    creep.moveTo(sources[0]);
            }
        }
        else {
            //Remove current target
            //creep.memory.targetSource = null;
            
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
 }
};

module.exports = roleHarvester;
