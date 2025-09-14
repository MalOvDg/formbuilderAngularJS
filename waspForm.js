var app = angular.module('myFirstApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'waspForm.html',
            controller: 'FormController'
        })
        .when('/result', {
            templateUrl: 'waspResultForm.html',
            controller: 'ResultController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.factory('FormDataService', function() {
    var finalForm = {};

    return {
        getData: function() {
            return finalForm;
        },
        setData: function(data) {
            finalForm = data;
        }
    };
})

app.controller('FormController', function($scope, $location, FormDataService) {
    // Text question 
    $scope.newTextQuestion = '';
    $scope.textQuestions = [];

    $scope.addTextQuestion = function() {
        if ($scope.newTextQuestion.trim() !== '') {
        $scope.textQuestions.push($scope.newTextQuestion.trim());
        $scope.newTextQuestion = '';
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
        const allFilled = q.choices.every(choice => choice.text && choice.text.trim() !== '');
        const questionNotEmpty = q.text.trim() !== '';
        const hasCorrect = q.correctIndex !== null;
        return allFilled && questionNotEmpty && hasCorrect;
    };

  $scope.addToList = function() {
    if ($scope.canAddQuestion()) {
      $scope.questionList.push(angular.copy($scope.newQuestion));
      $scope.newQuestion = { text: '', choices: [{ text: ''}, { text: ''}, { text: ''}, { text: ''}], correctIndex: null };
    }
  };

  // Submit form 
  $scope.submitForm = function($event) {
    if ($event) $event.preventDefault(); 

    const finalForm = {
        textQuestions: $scope.textQuestions,
        questionList: $scope.questionList
    };

    FormDataService.setData(finalForm);  //send the form  
    console.log("Submitted:", finalForm);
    alert("Form submitted!");

    $location.path('/result');
  };
});
    app.controller('ResultController', function($scope, FormDataService) {
        $scope.formData = FormDataService.getData();
        console.log('Received data:', $scope.formData);

        $scope.userTextAnswers = new Array($scope.formData.textQuestions.length).fill('');
        $scope.userAnswers = new Array($scope.formData.textQuestions.length).fill(null);

        $scope.submissionSuccess = false;

        $scope.answerStatus = [];

        $scope.userAnswers = [];

        $scope.checkAnswer = function(questionIndex) {
            const question = $scope.formData.questionList[questionIndex];
            const selectedChoiceIndex = $scope.userAnswers[questionIndex];

            //determine correct or inccorect answers 
            const isCorrect = selectedChoiceIndex === question.correctIndex;

            if (isCorrect) {
                console.log(`Question {$questionIndex + 1}: Correct!`);
            } else {
                console.log(`Question {$questionIndex + 1}: Incorrect`);
            }

            // Save whether the anser is correct or incorrect 
            $scope.answerStatus[questionIndex] = isCorrect ? 'correct' : 'incorrect';
        };

        $scope.submitAllAnswers = function() {
            const allTextAnswered = !$scope.formData.textQuestions.some((q, index) => {
                return !$scope.userTextAnswers[index] || $scope.userTextAnswers[index].trim() === ''; 
            });

            const allMCQAnswered = !$scope.formData.questionList.some((q, index) => {
                return typeof $scope.userAnswers[index] !== 'number';
            });

            if (allTextAnswered && allMCQAnswered) {
                $scope.submissionSuccess = true;

            //store user responses
            const summary = {
            textAnswers: $scope.userTextAnswers,
            mcqAnswers: $scope.userAnswers
            };

            console.log("User Responses Submitted:", summary);
            } else {
                alert("please anwser all questions before submitting the form");
            }
        };
    });