// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        // Calculate a simple D-score placeholder
        let d_score = Math.random().toFixed(2); // Replace with real scoring later
        console.log("D-score:", d_score);

        // Send D-score back to Qualtrics
        if (typeof Qualtrics !== 'undefined') {
            Qualtrics.SurveyEngine.setEmbeddedData("IAT_Dscore", d_score);
        }
    }
});

// Instructions
let instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Welcome to the Weight IAT.</p>
        <p>Classify the words quickly and accurately using the keyboard:</p>
        <p><b>E</b> = left category &nbsp;&nbsp; <b>I</b> = right category</p>
        <p>Press SPACE to begin.</p>
    `,
    choices: [' ']
};

// Categories
let thinWords = ["Slim", "Skinny", "Fit", "Lean"];
let fatWords = ["Overweight", "Plump", "Heavy", "Chubby"];
let goodWords = ["Happy", "Joy", "Love", "Peace"];
let badWords = ["Sad", "Anger", "Hate", "Ugly"];

// Helper to create trials
function createTrials(words, correctKey, category) {
    return words.map(word => ({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<p style="font-size:48px;">${word}</p>`,
        choices: ['e','i'],
        data: {category: category, correct_response: correctKey},
        on_finish: function(data) {
            data.correct = (data.response === data.correct_response);
        }
    }));
}

// Timeline
let timeline = [];
timeline.push(instructions);

// Block 1: Thin vs Fat
timeline = timeline.concat(createTrials(thinWords, 'i', 'Thin'));
timeline = timeline.concat(createTrials(fatWords, 'e', 'Fat'));

// Block 2: Good vs Bad
timeline = timeline.concat(createTrials(goodWords, 'i', 'Good'));
timeline = timeline.concat(createTrials(badWords, 'e', 'Bad'));

// Block 3: Combined Thin+Good vs Fat+Bad
let combinedBlock = createTrials(thinWords.concat(goodWords), 'i', 'Thin+Good')
    .concat(createTrials(fatWords.concat(badWords), 'e', 'Fat+Bad'));
timeline = timeline.concat(jsPsych.randomization.shuffle(combinedBlock));

// Run the timeline
jsPsych.run(timeline);
