/*
 * logger - Contains common logging functionality.
 */

var Logger = {

    /*
     * Properties
     */
    debugFlag:{
        NOTHING: 0,
        ERROR: 1,
        WARNING: 2,
        INFORMATION: 3,
        VERBOSE: 4
    },

    /*
     * Functions
     */
    //Logs a given message with method and class details based if the provided debug flag equal or more important than the one set for the class.
    log: function(sourceClass, sourceMethod, message, debugFlag) 
    {
        //This method will log the comment if the flag is set for the class
        if (debugFlag == null)
            debugFlag = 4;
        //Retrieve flag
        var classDebugFlag = this.retrieveDebugFlag(sourceClass);
        if (debugFlag <= classDebugFlag)
            console.log(sourceClass + "." + sourceMethod + " - " + message);
        return null;
    },

    //Retrieves the debug flag from memory for the given class.
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
            Memory.Flags.debugFlags[sourceClass] = 3;
        return Memory.Flags.debugFlags[sourceClass];
    },
    
    //Precreates all debug flags.
    createDebugFlags: function()
    {
        if (Memory.Flags == null)
            Memory.Flags = {};
        if (Memory.Flags.debugFlags == null)
            Memory.Flags.debugFlags = {};
        //if (Memory.Flags.debugFlags.sourceModel == null)
        //    Memory.Flags.debugFlags.sourceModel = 2;
        //if (Memory.Flags.debugFlags.roomModel == null)
        //    Memory.Flags.debugFlags.roomModel = 2;
        //if (Memory.Flags.debugFlags.worldModel == null)
        //    Memory.Flags.debugFlags.worldModel = 2;
        //if (Memory.Flags.debugFlags.worldController == null)
        //    Memory.Flags.debugFlags.worldController = 2;
        //if (Memory.Flags.debugFlags.roomController == null)
        //    Memory.Flags.debugFlags.roomController = 4;
        
    }
}

module.exports = Logger;