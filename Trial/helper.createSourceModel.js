/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper.findSource');
 * mod.thing == 'a thing'; // true
 */

var logger = require('common.logger');

var helperCreateSourceModel = {
    
	createSourceModel: function(sourceRoom) 
    {
		//This method creates a model for the sources of a given room
		//Sources - a list of sources by priority
		//	-ID
		//	-Number of access points
		//	-IsSourceIgnored
		//	Harvesters
		//		Assigned Harvester Names
		
        //This method is used to find a source which is currently not being mined.
        //Iterate through each source.
        //For each source iterate through all harvesters
        //If no harvesters have this as a "targetSource" memory object then return.
	    //console.log("findSource - Start");
	    logger.log("helperCreateSourceModel", "createSourceModel", "Start", logger.debugFlag.VERBOSE);
        var sourceModel = { RoomName: sourceRoom.name, Sources: [] };
        var sources = sourceRoom.find(FIND_SOURCES);
        var i = 0;
        for(i = 0; i< sources.length; i++) 
		{
            //Number of access points
            logger.log("helperCreateSourceModel", "createSourceModel", "Create Source Object", logger.debugFlag.VERBOSE);
            var s = { id: null, AccessPointCount: 0, IsSourceIgnored: 0, ContainerID: 0 };
            logger.log("helperCreateSourceModel", "createSourceModel", "Load Source Object", logger.debugFlag.VERBOSE);
			s.id = sources[i].id;
			sourceModel.Sources[i] = s;
			logger.log("helperCreateSourceModel", "createSourceModel", "Added Source. New array size: " + sourceModel.Sources.length, logger.debugFlag.VERBOSE);
		}
        return sourceModel;
    },
	
	loadSourceModel: function(sourceModel)
	{
        for(i = 0; i< sourceModel.Sources.length; i++) 
		{
			var source = Game.getObjectById(sourceModel.Sources[i]);
			//Find access point count - all adjacent tyles with plains or swamp
			sourceModel.Sources[i].AccessPointCount = this.retrieveSourceAccessPointCount(source);
			//Find if a container is nearby
			sourceModel.Sources[i].ContainerID = this.retrieveSourceContainerID(source);
		}
	},
	
	retrieveSourceContainerID: function(source) 
    {
		var containers = source.pos.findInRange(FIND_MY_STRUCTURES, 3, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
                }
        });
        if (containers.length > 0)
        {
            return containers[0].id;
        }
        else
            return null;
	},
	
	retrieveSourceAccessPointCount: function(source) 
    {
		var accessPointCount = 0;
		
		var r;
		var terrain;
		console.log("retrieveSourceAccessPointCount - Load New RoomPosition");
        //console.log(source.pos);
		//r = new RoomPosition(10, 25, 'sim');
		r = new RoomPosition(source.pos.x - 1,source.pos.y + 1,source.pos.roomName);
        //console.log("createSourceModel - Look For Terrains");
		terrain = r.lookFor(LOOK_TERRAIN);
        //console.log("createSourceModel - " + s.id + " - NW terrain: " + terrain);
		if (terrain == "swamp" || terrain == "plain")
		    accessPointCount = accessPointCount + 1;
			    
		r = new RoomPosition(source.pos.x - 1,source.pos.y,source.pos.roomName);
        //console.log("createSourceModel - Look For Terrains");
		terrain = r.lookFor(LOOK_TERRAIN);
        //console.log("createSourceModel - " + s.id + " - W terrain: " + terrain);
		if (terrain == "swamp" || terrain == "plain")
		    accessPointCount = accessPointCount + 1;
			    
		r = new RoomPosition(source.pos.x - 1,source.pos.y - 1,source.pos.roomName);
        //console.log("createSourceModel - Look For Terrains");
		terrain = r.lookFor(LOOK_TERRAIN);
        //console.log("createSourceModel - " + s.id + " - SW terrain: " + terrain);
		if (terrain == "swamp" || terrain == "plain")
		    accessPointCount = accessPointCount + 1;
			    
		r = new RoomPosition(source.pos.x,source.pos.y + 1,source.pos.roomName);
        //console.log("createSourceModel - Look For Terrains");
		terrain = r.lookFor(LOOK_TERRAIN);
        //console.log("createSourceModel - " + s.id + " - N terrain: " + terrain);
		if (terrain == "swamp" || terrain == "plain")
		    accessPointCount = accessPointCount + 1;
			    
		r = new RoomPosition(source.pos.x,source.pos.y - 1,source.pos.roomName);
        //console.log("createSourceModel - Look For Terrains");
		terrain = r.lookFor(LOOK_TERRAIN);
        //console.log("createSourceModel - " + s.id + " - S terrain: " + terrain);
		if (terrain == "swamp" || terrain == "plain")
		    accessPointCount = accessPointCount + 1;
			
		r = new RoomPosition(source.pos.x + 1,source.pos.y + 1,source.pos.roomName);
        //console.log("createSourceModel - Look For Terrains");
		terrain = r.lookFor(LOOK_TERRAIN);
        //console.log("createSourceModel - " + s.id + " - NE terrain: " + terrain);
		if (terrain == "swamp" || terrain == "plain")
		    accessPointCount = accessPointCount + 1;
			    
		r = new RoomPosition(source.pos.x + 1,source.pos.y,source.pos.roomName);
        //console.log("createSourceModel - Look For Terrains");
		terrain = r.lookFor(LOOK_TERRAIN);
        //console.log("createSourceModel - " + s.id + " - E terrain: " + terrain);
		if (terrain == "swamp" || terrain == "plain")
		    accessPointCount = accessPointCount + 1;
			    
		r = new RoomPosition(source.pos.x + 1,source.pos.y - 1,source.pos.roomName);
        //console.log("createSourceModel - Look For Terrains");
		terrain = r.lookFor(LOOK_TERRAIN);
        //console.log("createSourceModel - " + s.id + " - SE terrain: " + terrain);
		if (terrain == "swamp" || terrain == "plain")
		    accessPointCount = accessPointCount + 1;
		
		return accessPointCount;
	}
	
}

module.exports = helperCreateSourceModel;