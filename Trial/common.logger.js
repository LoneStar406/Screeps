/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper.findSource');
 * mod.thing == 'a thing'; // true
 */


var logger = {
    
    debugFlag:{
        NOTHING: 0,
        ERROR: 1,
        WARNING: 2,
        INFORMATION: 3,
        VERBOSE: 4
    },

    log: function(sourceClass, sourceMethod, message, debugFlag) 
    {
        //This method will log the comment if the flag is set for the class
        if (debugFlag == null)
            debugFlag = 2;
        //Retrieve flag
        var classDebugFlag = this.retrieveDebugFlag(sourceClass);
        if (debugFlag <= classDebugFlag)
            console.log(sourceClass + "." + sourceMethod + " - " + message);
        return null;
    },

    retrieveDebugFlag: function(sourceClass)
    {
        //Retrieve logger from memory flag                
        if (Memory.Flags == null)
            Memory.Flags = {};
        if (Memory.Flags.debugFlags == null)
            Memory.Flags.debugFlags = {};
        if (sourceClass == "WorldController" && Memory.Flags.debugFlags[sourceClass] == null)
            Memory.Flags.debugFlags[sourceClass] = 3;
        else if (Memory.Flags.debugFlags[sourceClass] == null)
            Memory.Flags.debugFlags[sourceClass] = 2;
        return Memory.Flags.debugFlags[sourceClass];
    },

    createDebugFlags: function()
    {
        if (Memory.Flags == null)
            Memory.Flags = {};
        if (Memory.Flags.debugFlags == null)
            Memory.Flags.debugFlags = {};
    }
}

module.exports = logger;