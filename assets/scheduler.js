$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBrQVuZTFGvZSnp_dsQdtnE821wjed5oZs",
        authDomain: "train-scheduler-f4aff.firebaseapp.com",
        databaseURL: "https://train-scheduler-f4aff.firebaseio.com",
        projectId: "train-scheduler-f4aff",
        storageBucket: "train-scheduler-f4aff.appspot.com",
        messagingSenderId: "393099580670"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Initial Values
    var trainName;
    var destination;
    var frequency;
    var firstTime;

    // var currentTime = moment();


    // Function to get the values from the entry form storage them in variables
    $("#trainInfoBtn").on("click", function (event) {
        event.preventDefault();

        // Assigning the entry values to variables
        trainName = $("#name").val().trim();
        destination = $("#dest").val().trim();
        frequency = $("#freq").val().trim();
        firstTime = $("#firstTime").val();

        if (trainName === "" || destination === "" || frequency === ""  || firstTime === "") {
            alert("Please fill out all the information and make sure frequency is a number")
        } else {
            // Creating fields in the database
            database.ref().push({
                trainName: trainName,
                destination: destination,
                firstTime: firstTime,
                frequency: frequency
            });
        };
        });
    

    // Firebase watcher and Initial loader

    database.ref().on("child_added", function (childSnapshot) {


        // Getting the information from the database
        trainName = childSnapshot.val().trainName;
        destination = childSnapshot.val().destination;
        firstTime = childSnapshot.val().firstTime;
        frequency = childSnapshot.val().frequency;

        var firstTimeMoment = moment(firstTime, "hh:mm");

        // Now moment

        var currentTime = moment();

        var minuteArrival = currentTime.diff(firstTimeMoment, "minutes");
        var minuteLast = minuteArrival % frequency;
        var awayTrain = frequency - minuteLast;

        // Next Arrival
        var nextArrival = currentTime.add(awayTrain, "minutes");
        var arrivalTime = nextArrival.format("HH:mm")

        // Addind values to train schedule table
        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
            frequency + "</td><td>" + arrivalTime + "</td><td>" + awayTrain + "</td></tr>");

    });

});