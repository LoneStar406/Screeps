var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
     //if(creep.carry.energy < creep.carryCapacity) {
     if(creep.carry.energy == 0) {
         
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
            });
            if(targets.length > 0) {
                if(targets[0].transferEnergy(creep, creep.carryCapacity - creep.carry.energy)== ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTROLLER);// && structure.energy < structure.energyCapacity;
                    }
            });
            
            if(targets.length > 0) {
                
                if(creep.upgradeController(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
 }
};

module.exports = roleUpgrader;
