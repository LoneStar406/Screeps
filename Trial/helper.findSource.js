/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper.findSource');
 * mod.thing == 'a thing'; // true
 */
var helperFindSource = {
    
    findSource: function(sourceCreep) 
    {
        //This method is used to find a source which is currently not being mined.
        //Iterate through each source.
        //For each source iterate through all harvesters
        //If no harvesters have this as a "targetSource" memory object then return.
        //console.log("findSource - Start");
        //console.log(sourceCreep);
        var sources = sourceCreep.room.find(FIND_SOURCES);
        var i = 0;
        var isCurrentTarget = 0;
        if(sources.length > 0) {
            
            //console.log("findSource - # sources found " + sources.length);
            //console.log(sources[0]);
            for(i = 0; i< sources.length; i++) {
                //console.log(sources[i]);
                //var creep = Game.creeps[name];
                isCurrentTarget = 0;
                for (var name in Game.creeps) {
                    var creep = Game.creeps[name];
                    if(creep.memory.role == 'harvester' && creep.memory.targetSource != null && creep.memory.targetSource.id == sources[i].id) {
                        //console.log("findSource - found match");
                        isCurrentTarget = 1;
                    }
                }
                if (isCurrentTarget == 0)
                {
                    //console.log("findSource - free source found");
                    //console.log(sources[i].id);
                    return sources[i];
                }
            }
        }
        return null;
    }
}

module.exports = helperFindSource;