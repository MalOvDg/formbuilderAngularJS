var app = angular.module("myFirstApp", []);

app.controller("myFirstController", function($scope) {

    // Text question 
    $scope.newTextQuestion = "";
    $scope.textQuestions = [];

    $scope.addTextQuestion = function() {
        if ($scope.newTextQuestion) {
            $scope.textQuestions.push($scope.newTextQuestion);
            $scope.newTextQuestion = "";
        }
    };

    // Multiple choice question logic 
    $scope.newQuestion = {
        text: '',
        choices: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
        correctIndex: null
    };

    $scope.questionList = [];

    // Validate before enabling submit
    $scope.canAddQuestion = function () {
        const q = $scope.newQuestion;
        // All 4 choices must be filled and one correct selected
        const allFilled = q.choices.every(choice => choice.text.trim() !== '');
        const questionNotEmpty = q.text.trim() !== '';
        const hasCorrect = q.correctIndex !== null;
        return allFilled && questionNotEmpty && hasCorrect;
    };

    // Add to question list
    $scope.addToList = function () {
        $scope.questionList.push(angular.copy($scope.newQuestion));

        // Reset form
        $scope.newQuestion = {
            text: '',
            choices: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
            correctIndex: null
        };
    };

    //Submit form 
    $scope.submitForm = function() {
    const finalForm = {
        textQuestions: $scope.textQuestions,
        questionList: $scope.questionList
    };

    // For now, log to console
    console.log("Form submitted:", finalForm);

    // Alert user
    alert("Form submitted! Check console for output.");
    };

});
