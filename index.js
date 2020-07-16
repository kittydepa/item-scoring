const chance = require("chance")
//Step 1. Generating random responses for 200 participants - need for generate participant ID as well?
    //SWEBO - for all 10 items
    chance.integer({ min: 1, max: 4 })
    //BDI - for all 21 items
    chance.integer({ min : 0, max: 3 })
    //PCL - for all 20 items
    chance.integer({ min: 0, max : 4 })
    //FAKE - for all 10 items
    chance.integer({ min : 0, max: 4})

//Step 2. Scoring each measure
    /*SWEBO - all items are REVERSED scored, where higher numbers mean higher burnout
       so this means that for ever 4, this should be scored as a 1, and for evert 3 it should be scored as a 2, etc. */
    
   /*BDI -  */