const chance = require("chance")()
const fs = require("fs")

// //Step 1a. Generating random responses for 200 participants - need for generate participant ID as well?
// //How to get this applied to 200 ppl
//     //SWEBO - for all 10 items
//     //chance.integer({ min: 1, max: 4 })
//     console.log(chance.integer({ min: 1, max: 4 }))
//     //BDI - for all 21 items
//     chance.integer({ min : 0, max: 3 })
//     //PCL - for all 20 items
//     chance.integer({ min: 0, max : 4 })
//     //FAKE - for all 10 items
//     chance.integer({ min : 0, max: 4})

//Step 1b. Storing the randomly generated data. 

//Step 2. Scoring each measure
    /*SWEBO - all items are REVERSE scored, where higher numbers mean higher burnout
       so this means that for ever 4, this should be scored as a 1, and for every 3 it should be scored as a 2, etc. */
    
   /*BDI -  all items. 
   Here, we also want to know the severity of depression, where Mild = 0-13, Moderate = 11-19, Severe = 28. */
   
   /* PCL - all items.
    The cut-off for PTSD is 31. */

    /* FAKE - all items. 
    Note that items 3, 5, and 7 are REVERSE scored. */

//Step 3. Caluclating an overall "mental illness" composite score, where scores of 167 or higher will qualify for services.


// ID, A, B, C, D, E, F
// Person A, aosdij, oiasjd, oijasd, oijasd, oijasd

class Response {
    constructor(participant, studyResults) {
        this.participant = participant
        this.studyResults = studyResults
    }

    print() {
        // Print the participant ID
        console.log(`Participant: ${this.participant.id}`)

        // Loop through the study results and print them
        this.studyResults.print()
    }
}

class Participant {
    constructor(id) {
        this.id = id
    }
}

class Question {
    constructor(id, response) {
        // A number
        this.id = id

        // This is a number with special meaning
        this.response = response
    }

    print(questionnaire) {
        console.log(`Question: ${questionnaire.name}-${this.id}`)
        console.log(`Response: ${this.response}`)
    }
}

class Questionnaire {
    constructor(name, questions = []) {
        // A string
        this.name = name

        // an array of Questions
        this.questions = questions
    }

    print() {
        console.log(`# Questionnaire: ${this.name}`)
        for (const question of this.questions) {
            console.log(`-------`)
            question.print(this)
        } 
    }
}

class StudyResults {
    constructor(questionnaires) {
        this.questionnaires = questionnaires
    }

    print() {
        for (const questionnaire of this.questionnaires) {
            questionnaire.print()
            console.log()
        }
    } 
}

// ====================================

// This function generates a mocked Questionnaire for SWEBO data
function mockSweboData() {
    return mockSomeData("SWEBO", 10, 1, 4)
}

//This function generates a mocked Questionnaire for BDI data
function mockBdiData() {
    return mockSomeData("BDI", 21, 0, 3)
}


//This function generates a mocked Questionnaire for PCL data
function mockPclData() {
    return mockSomeData("PCL", 20, 0, 4)
}

//Mock FAKE data
function mockFakeData() {
    return mockSomeData("FAKE", 10, 0, 4)
}

function mockSomeData(name, count, min, max) {
    const questions = []
    for (let i = 1; i <= count; i += 1) {
        const question = new Question(i, chance.integer({ min, max }))
        questions.push(question)
    }

    return new Questionnaire(name, questions)
}

// mockSweboData().print()
// mockBdiData().print()
// mockPclData().print()
// mockFakeData().print()

function mockResponse(participantId) {
    const participant = new Participant(participantId)
    const studyResults = new StudyResults([
        mockSweboData(), mockBdiData(), mockPclData(), mockFakeData()
    
    ])
    return new Response(participant, studyResults)
}

function mockResponses(count) {
    const responses = []
    for (let i = 1; i <= count; i += 1) {
        const response = mockResponse(i)
        responses.push(response)
    }
    return responses
}

const responses = mockResponses(200)
fs.writeFileSync("./mockdata.json", JSON.stringify(responses, null, 2), "utf8")


// const questionnaire = new Questionnaire("SWEBO", [
//     new Question(1, 3),
//     new Question(2, "aoijdasoijdasio"),
//     new Question(3, false)
// ])

// const questionnaire2 = new Questionnaire ("BDI", [
//     new Question(1, 2),
//     new Question(2, true),
//     new Question(3, 4)
// ])

// const studyResults = new StudyResults([
//     questionnaire,
//     questionnaire2
// ])

// // studyResults.print()
// console.log(JSON.stringify(studyResults))

// module.exports = { Row, Question, Questionnaire }
