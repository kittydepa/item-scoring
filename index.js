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

class Submission {
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

    printTotals() {
        // Print the participant ID
        console.log(`## Participant: ${this.participant.id}`)
        this.studyResults.printTotals()
    }
}

class Participant {
    constructor(id) {
        this.id = id
    }
}

class Question {
    // private response: number

    constructor(id, response) {
        // A number
        this.id = id

        // This is a number with special meaning
        this.responseValue = response
    }

    print(questionnaire) {
        console.log(`Question: ${questionnaire.name}-${this.id}`)
        console.log(`Submission: ${this.responseValue}`)
    }
}

class Questionnaire {
    constructor(name, formula, min, max, questions = []) {
        // A string
        this.name = name

        // the formula we're going to calculate our totals with as a function
        this.formula = formula

        // an array of Questions
        this.questions = questions

        // Min and max values for the responses in this questionnaire
        this.min = min
        this.max = max
    }

    print() {
        console.log(`# Questionnaire: ${this.name}`)
        for (const question of this.questions) {
            console.log(`-------`)
            question.print(this)
        }
        this.printTotals()
    }

    printTotals() {
        console.log(`${this.name}: ${this.formula.calculate(this)}`)
    }
}

/*abstract*/ class Formula {
    calculate(questionnaire) {
        throw new Error("not implemented")
    }   
}

class SumTotalsFormula extends Formula {
    calculate(questionnaire) {
        let total = 0
        for (const question of questionnaire.questions) {
            total += question.responseValue
        }
        return total
    }
}

class PartialInverseSumTotalsFormula extends Formula {
    constructor(inverseIds) {
        super()
        this.inverseIds = inverseIds
    }

    calculate(questionnaire) {
        const inverseIds = this.inverseIds
        const { questions, min, max } = questionnaire
        let total = 0

        for (const question of questions) {
            if (inverseIds.includes(question.id)) {
                const offsetValue = question.responseValue - min
                const inverseValue = ((max - min) - offsetValue) + min
                total += inverseValue
            } else {
                total += question.responseValue
            }
        }

        return total
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

    printTotals() {
        for (const questionnaire of this.questionnaires) {
            questionnaire.printTotals()
        }
    }
}

// ====================================

// This function generates a mocked Questionnaire for SWEBO data
function mockSweboData() {
    return mockSomeData("SWEBO", new SumTotalsFormula(), 10, 1, 4)
}

//This function generates a mocked Questionnaire for BDI data
function mockBdiData() {
    return mockSomeData("BDI", new SumTotalsFormula(), 21, 0, 3)
}


//This function generates a mocked Questionnaire for PCL data
function mockPclData() {
    return mockSomeData("PCL", new SumTotalsFormula(), 20, 0, 4)
}

//Mock FAKE data
function mockFakeData() {
    return mockSomeData("FAKE", new PartialInverseSumTotalsFormula([1, 3, 5]), 10, 0, 4)
}

//Mock FAKE2 data
function mockFake2Data() {
    return mockSomeData("FAKE2", new PartialInverseSumTotalsFormula([11, 13, 17, 3]), 20, 1, 10)
}

function mockSomeData(name, formula, count, min, max) {
    const questions = []
    for (let i = 1; i <= count; i += 1) {
        const question = new Question(i, chance.integer({ min, max }))
        questions.push(question)
    }

    return new Questionnaire(name, formula, min, max, questions)
}

function mockSubmission(participantId) {
    const participant = new Participant(participantId)
    const studyResults = new StudyResults([
        // mockSweboData(),
        // mockBdiData(),
        // mockPclData(),
        // mockFakeData(),
        mockFake2Data()
    ])
    return new Submission(participant, studyResults)
}

function mockSubmissions(count) {
    const responses = []
    for (let i = 1; i <= count; i += 1) {
        const response = mockSubmission(i)
        responses.push(response)
    }
    return responses
}

const responses = mockSubmissions(200)
console.log("# Totals")
for (const response of responses) {
    response.printTotals()
}

fs.writeFileSync("./mockdata.json", JSON.stringify(responses, null, 2), "utf8")
