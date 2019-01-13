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

    // Function to get the values from the entry form
    $("#trainInfoBtn").on("click", function (event) {
        event.preventDefault();


        var trainName = $("#name").val().trim();
        var destination = $("#dest").val().trim();
        var frequency = $("#freq").val().trim();
        var initialTime = moment($("#initialTime").val().trim(), "hh:mm").subtract(1, "years").format("X");

        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        console.log(trainName);
        console.log(destination);
        console.log(initialTime);
        console.log(frequency);
        console.log(currentTime);

        var newTrain = {

            train: trainName,
            trainDest: destination,
            trainArrival: initialTime,
            everyMin: frequency
        };


        database.ref().push(newTrain);

    });

    database.ref().on("child_added", function (childSnapshot) {

        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().train;
        var destination = childSnapshot.val().trainDest;
        var initialTime = childSnapshot.val().trainArrival;
        var frequency = childSnapshot.val().everyMin;



        var trainTime = moment(initialTime).format("hh:mm");

        var difference = moment().diff(moment(trainTime), "minutes");

        var trainRemain = difference % frequency;
        console.log(trainRemain);


        var minRemain = frequency - trainRemain;
        console.log(minRemain);

        // Next Arrival
        var nextArrival = moment().add(minRemain, "minutes").format('hh:mm');
        console.log(nextArrival);

        // Addind values to train schedule table
        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
            frequency + "</td><td>" + nextArrival + "</td><td>" + minRemain + "</td></tr>");

    });
});