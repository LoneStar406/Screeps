var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleBuilderMiner = require('role.builderMiner');
var roleUpgrader = require('role.upgrader');
var roleMule = require('role.mule');
var roleRecycle = require('role.recycle');
var helperFindSource = require('helper.findSource');
var _bPauseBuilders = 0;
var _bPauseUpgraders = 0;
var _bPauseMules = 0;
var _bUpgradersAreBuilders = 1;

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 0) {
        var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    
    for(var name in Game.rooms) {
        /**console.log('Room ""'+name+'"" has '+Game.rooms[name].energyAvailable+' energy');**/
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(_bPauseBuilders == 0 && (creep.memory.role == 'builder' || (_bUpgradersAreBuilders == 1 && creep.memory.role == 'upgrader'))) {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'upgrader' && _bUpgradersAreBuilders == 0 && _bPauseUpgraders == 0) {
            roleUpgrader.run(creep);
        }
        if (_bPauseMules == 0 && creep.memory.role == 'mule') {
            roleMule.run(creep);
        }
        if (creep.memory.role == 'recycle') {
            roleRecycle.run(creep);
        }
        if (creep.memory.role == 'builderMiner') {
            roleBuilderMiner.run(creep);
        }
    }
    //console.log(helperFindSource.findSource(Game.creeps["Harvester1"]));
}
