var roleRecycle = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        });
        if(targets.length > 0) 
        {
            targets[0].recycleCreep(creep);
            creep.moveTo(targets[0]);
        }
    }
};

module.exports = roleRecycle;
