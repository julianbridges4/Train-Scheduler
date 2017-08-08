// Initialize Firebase
var config = {
    apiKey: "AIzaSyBENIFRkNTZKzQs8u2D5_UQFDbF8IVAFgk",
    authDomain: "train-scheduler-ed040.firebaseapp.com",
    databaseURL: "https://train-scheduler-ed040.firebaseio.com",
    projectId: "train-scheduler-ed040",
    storageBucket: "",
    messagingSenderId: "515371926367"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var trainDest = $("#destination").val().trim();
    var trainFirst = $("#first-train-time").val().trim();
    var trainFreq = $("#frequency").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        first: trainFirst,
        frequency: trainFreq
    };

    // Uploads train data to database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
});

// Creates a Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	// Store data in variables
	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().destination;
	var trainFirst = childSnapshot.val().first;
	var trainFreq = childSnapshot.val().frequency;

	// trainFirst (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(trainFirst, "hh:mm").subtract(1, "years");

	// Current Time
	var currentTime = moment();

	// Difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

	// Time apart (remainder)
	var tRemainder = diffTime % trainFreq;

	// Minutes until train
	var tMinutesTillTrain = trainFreq - tRemainder;

	// Next Train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	var nextArrival = moment(nextTrain).format("hh:mm A")

	// Add each train's data into the table
	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextArrival + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});