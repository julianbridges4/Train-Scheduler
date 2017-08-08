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

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var trainDest = $("#destination").val().trim();
    var trainFirst = $("#first-train-time").val().trim();
    var trainFreq = $("#frequency").val().trim();

    var newTrain = {
        name: trainName,
        destination: trainDest,
        first: trainFirst,
        frequency: trainFreq
    };

    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);

    alert("Train successfully added!");

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	console.log(childSnapshot.val());

	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().destination;
	var trainFirst = childSnapshot.val().first;
	var trainFreq = childSnapshot.val().frequency;

	console.log(trainName);
	console.log(trainDest);
	console.log(trainFirst);
	console.log(trainFreq);

	var firstTimeConverted = moment(trainFirst, "hh:mm").subtract(1, "years");
	console.log(firstTimeConverted);

	var currentTime = moment();
	console.log("Current Time: " + moment(currentTime).format("hh:mm"));

	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("Difference in time: " + diffTime);

	var tRemainder = diffTime % trainFreq;
	console.log(tRemainder);

	var tMinutesTillTrain = trainFreq - tRemainder;
	console.log("Minutes till train: " + tMinutesTillTrain);

	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	var nextArrival = moment(nextTrain).format("hh:mm A")
	console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextArrival + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});