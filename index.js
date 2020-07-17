const chance = require("chance")()
//Step 1a. Generating random responses for 200 participants - need for generate participant ID as well?
//How to get this applied to 200 ppl
    //SWEBO - for all 10 items
    //chance.integer({ min: 1, max: 4 })
    console.log(chance.integer({ min: 1, max: 4 }))
    //BDI - for all 21 items
    chance.integer({ min : 0, max: 3 })
    //PCL - for all 20 items
    chance.integer({ min: 0, max : 4 })
    //FAKE - for all 10 items
    chance.integer({ min : 0, max: 4})

//Step 1b. Storing the randomly generated data. 

//Step 2a. Scoring each measure
    /*SWEBO - all items are REVERSE scored, where higher numbers mean higher burnout
       so this means that for ever 4, this should be scored as a 1, and for every 3 it should be scored as a 2, etc. */
    
   /*BDI -  all items. 
   Here, we also want to know the severity of depression, where Mild = 0-13, Moderate = 11-19, Severe = 28. */
   
   /* PCL - all items.
    The cut-off for PTSD is 31. */

    /* FAKE - all items. 
    Note that items 3, 5, and 7 are REVERSE scored. */

//Step 2b. Caluclating an overall "mental illness" composite score, where scores of 167 or higher will qualify for services.

/*Step 3. Answering the following questions:
            How many participants have moderate-severe depression?
            How many participants have PTSD?
            How many participants qualify for services? */