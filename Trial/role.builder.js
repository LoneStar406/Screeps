var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

     if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
     }
     if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
         creep.memory.building = true;
     }

     if(creep.memory.building) {
         var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
     }
     else {
        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_CONTAINER);
                }
        });
        if(targets.length > 0) {
            if(targets[0].transferEnergy(creep, creep.carryCapacity - creep.carry.energy)== ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
     }
 }
};

module.exports = roleBuilder;
