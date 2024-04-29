
// script.js

$(document).ready(function () {
    $("div.controlContainer").addClass("disabledbutton");
    // Listen for click events on the "Pay" button within the container with the class "containerPayment"

    const controlButtons = document.querySelectorAll('.controlContainer .controlGroup button');

    controlButtons.forEach(button => {
        button.addEventListener('click', function () {
            const message = this.getAttribute('data-message');
            console.log(message);
            sendMessageAndCloseSocket(message);
          });
    });
    
    function sendMessageAndCloseSocket(message) {
        const webSocket = new WebSocket('wss://xcl7vxzurl.execute-api.ap-southeast-2.amazonaws.com/demo');
        
        // Handle WebSocket events
        webSocket.onopen = function () {
          console.log('WebSocket connected.');
          // Send the message once the socket is open
          var payload = JSON.stringify({ "action": "sendMessage", "message": message });
          console.log(payload);
          webSocket.send(payload);
          // Close the socket after sending the message
          webSocket.close();
        };
      
        webSocket.onclose = function () {
          console.log('WebSocket connection closed.');
        };
      
        webSocket.onerror = function (error) {
          console.error('WebSocket error:', error);
        };
      }
    
    var paybuttons = document.querySelectorAll('.containerPayment button');
    paybuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Remove the class 'payselected' from all buttons
            paybuttons.forEach(function (btn) {
                btn.classList.remove('payselected');
            });

            // Add the class 'payselected' to the clicked button
            button.classList.add('payselected');
        });
    });

    var scenebuttons = document.querySelectorAll('.containerScenes button');
    scenebuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            scenebuttons.forEach(function (btn) {
                btn.classList.remove('sceneselected');
            });

            button.classList.add('sceneselected');
        });
    });

    var speedbuttons = document.querySelectorAll('.containerSpeed button');
    speedbuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            speedbuttons.forEach(function (btn) {
                btn.classList.remove('modeselected');
            });

            button.classList.add('modeselected');
        });
    });

    var manualbuttons = document.querySelectorAll('.containerManual button');
    manualbuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            manualbuttons.forEach(function (btn) {
                btn.classList.remove('modeselected');
            });

            button.classList.add('modeselected');
        });
    });

    var intensitybuttons = document.querySelectorAll('.containerIntensity button');
    intensitybuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            intensitybuttons.forEach(function (btn) {
                btn.classList.remove('modeselected');
            });

            button.classList.add('modeselected');
        });
    });

    var posbuttons = document.querySelectorAll('.containerPos button');
    posbuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            posbuttons.forEach(function (btn) {
                btn.classList.remove('modeselected');
            });

            button.classList.add('modeselected');
        });
    });

    var airposbuttons = document.querySelectorAll('.containerAirPos button');
    airposbuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            airposbuttons.forEach(function (btn) {
                btn.classList.remove('modeselected');
            });

            button.classList.add('modeselected');
        });
    });

    var pressbuttons = document.querySelectorAll('.containerPress button');
    pressbuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            pressbuttons.forEach(function (btn) {
                btn.classList.remove('modeselected');
            });

            button.classList.add('modeselected');
        });
    });

    var othersbuttons = document.querySelectorAll('.containerOthers button');
    othersbuttons.forEach(function (button) {
        button.addEventListener('click', function () {
            othersbuttons.forEach(function (btn) {
                btn.classList.remove('modeselected');
            });

            button.classList.add('modeselected');
        });
    });

    $("#pay").click(function () {
        console.log('test')
        // Get the focused button
        var focusedButton = $(".payselected");

        console.log(focusedButton)

        // Check if a button with the class 'payselected' exists
        if (focusedButton.length > 0) {
            // Check if the focused button has the id "5m", "10m", "15m", etc.
            var duration = parseInt(focusedButton.attr("id").replace("m", ""));
            var classValue = focusedButton.attr("class"); // Get the class attribute value
            var numericPart = classValue.replace(/[^\d.]/g, ''); // Extract numeric part
            var amt = parseFloat(numericPart) / 100; // Convert to float and divide by 100
            if (!isNaN(duration)) {
                console.log(duration)
                var transactionData = {
                    mc_id: 'KL00101',
                    duration: duration,
                    amount: amt
                };
                console.log(transactionData)
                // Send POST request to Flask API endpoint
                $.ajax({
                    url: '/api/save_transaction',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(transactionData),
                    success: function (response) {
                        console.log(response.message); // Log success message
                        const StopTime = response.StopTime;
                        document.getElementById('total').innerHTML = 'Total Time: ' + duration + ' min';

                        const message1 = "59 59 06 02 01 BB".replace(/ /g, "_");
                        const message2 = "59 59 06 04 1E DA".replace(/ /g, "_");

                        console.log(message1);
                        sendMessageAndCloseSocket(message1);
                        setTimeout(() => {
                            console.log(message1);
                            sendMessageAndCloseSocket(message1);
                        }, 2000); // Wait for 2000 milliseconds (2 seconds)
                        console.log(message1);
                            sendMessageAndCloseSocket(message1);
                        setTimeout(() => {
                            console.log(message2);
                            sendMessageAndCloseSocket(message2);
                        }, 2000); // Wait for 2000 milliseconds (2 seconds)

                        startCountdown(StopTime);

                    },
                    error: function (xhr, status, error) {
                        console.error('Error:', error); // Log error message
                    }
                });
            }
        } else {
            alert("Please select a duration.");
        }
    });

    $("#stopSession").click(function () {
        const stop1 = "59 59 06 03 01 BC".replace(/ /g, "_");
        const stop2 = "59 59 06 02 02 BC".replace(/ /g, "_");
        console.log(stop1);
        sendMessageAndCloseSocket(stop1);
        setTimeout(() => {
            console.log(stop2);
            sendMessageAndCloseSocket(stop2);
        }, 3000); // Wait for 2000 milliseconds (2 seconds)
        console.log(stop2);
            sendMessageAndCloseSocket(stop2);
        updateTrans();
        setTimeout(fetchTrans, 3000);
    });

    $("#endSession").click(function () {
        location.reload();
        $(window).scrollTop(0);
    });

    // Function to make AJAX request to the Flask API endpoint
    function fetchData() {
        fetch('/api/MC/KL00101')
            .then(response => response.json())
            .then(data => {
                console.log('Data fetched:', data.Name);
                // Update the content of the div with the fetched data
                document.getElementById('locationName').innerHTML = data.Name;
                document.getElementById('mcID').innerHTML = 'SN:' + data.ID;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function fetchTrans() {
        fetch('/api/trans/KL00101')
            .then(response => response.json())
            .then(data => {
                console.log('Data fetched:', data.StopTime);
                // Get the stop time from the fetched data
                var stopTime = new Date(data.StopTime);
                $.ajax({
                    url: '/get_time',
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (response) {
                        const currentTime = new Date(response.timeNow);
                        // Check if the stop time is later than the current time
                        if (stopTime > currentTime) {
                            document.getElementById('total').innerHTML = 'Total Time: ' + data.Duration + ' min';
                            // Call startCountdown with the duration in minutes
                            startCountdown(stopTime);
                        } else {
                            console.log("Stop time is in the past.");
                        }
                    },
                    error: function (xhr, status, error) {
                        alert(error);
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateTrans() {
        fetch('/api/update_transaction/KL00101', {
            method: 'POST'
        })
            .then(response => {
                if (response.ok) {
                    console.log('Transaction updated successfully');
                    // Close the stopModal
                    $("#stopModal").modal("hide");
                    // Show the invModal
                    $("#invModal").modal("show");
                    fetch('/api/inv/KL00101')
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('invDate').innerHTML = data.StopTime;
                            document.getElementById('invMCID').innerHTML = 'Massage Chair ' + data.MC_ID;
                            document.getElementById('invNo').innerHTML = data.CustomTransactionID;
                            document.getElementById('invLoc').innerHTML = data.Name;
                            document.getElementById('invPay').innerHTML = 'RM ' + data.Amount;
                            document.getElementById('invTotal').innerHTML = 'RM ' + data.Amount;

                            const options = {
                                margin: 0.5,
                                filename: 'invoice.pdf',
                                image: {
                                    type: 'jpeg',
                                    quality: 500
                                },
                                html2canvas: {
                                    scale: 1
                                },
                                jsPDF: {
                                    unit: 'in',
                                    format: 'letter',
                                    orientation: 'portrait'
                                }
                            }

                            $('#invPDF').click(function (e) {
                                e.preventDefault();
                                const element = document.getElementById('print');
                                html2pdf().from(element).set(options).save();
                            });
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                } else {
                    console.error('Failed to update transaction');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function startCountdown(StopTime = null) {
        // Check if a duration is provided
        if (StopTime !== null) {
            // Define the function to update countdown
            function updateCountdown() {
                // Calculate the difference between the stop time and current time
                var stopTime = new Date(StopTime).getTime();
                $.ajax({
                    url: '/get_time',
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (response) {
                        const currentTime = new Date(response.timeNow)
                        console.log(currentTime)
                        var timeDifference = stopTime - currentTime;

                        // If the stop time is in the past, set timeDifference to 0
                        timeDifference = Math.max(0, timeDifference);

                        // Update the countdown display
                        $("div.Paycontainer").hide();
                        $("div.controlContainer").removeClass("disabledbutton");
                        var minutes = Math.floor(timeDifference / (1000 * 60));
                        var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                        // Format minutes and seconds to have leading zeros
                        var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
                        var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

                        // Display the countdown in "00:00" format
                        console.log(formattedMinutes + ":" + formattedSeconds);
                        // Assuming you have an element with id 'count' to display the countdown
                        document.getElementById('count').innerHTML = formattedMinutes + ":" + formattedSeconds;

                        // Check if the countdown has finished
                        if (timeDifference <= 0) {
                            clearInterval(timerInterval);
                            console.log("Countdown finished!");
                            document.getElementById('count').innerHTML = "00:00";
                            $("div.Paycontainer").show();
                            $("div.controlContainer").addClass("disabledbutton");
                            $("#invModal").modal("show");
                            fetch('/api/inv/KL00101')
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById('invDate').innerHTML = data.StopTime;
                                document.getElementById('invMCID').innerHTML = 'Massage Chair ' + data.MC_ID;
                                document.getElementById('invNo').innerHTML = data.CustomTransactionID;
                                document.getElementById('invLoc').innerHTML = data.Name;
                                document.getElementById('invPay').innerHTML = 'RM ' + data.Amount;
                                document.getElementById('invTotal').innerHTML = 'RM ' + data.Amount;

                                const options = {
                                    margin: 0.5,
                                    filename: 'invoice.pdf',
                                    image: {
                                        type: 'jpeg',
                                        quality: 500
                                    },
                                    html2canvas: {
                                        scale: 1
                                    },
                                    jsPDF: {
                                        unit: 'in',
                                        format: 'letter',
                                        orientation: 'portrait'
                                    }
                                }

                                $('#invPDF').click(function (e) {
                                    e.preventDefault();
                                    const element = document.getElementById('print');
                                    html2pdf().from(element).set(options).save();
                                });
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        alert(error);
                    }
                });
            }

            // Initial call to update countdown
            updateCountdown();

            // Update the countdown every second
            var timerInterval = setInterval(updateCountdown, 1000); // Update timer every second
        } else {
            console.error("No duration or stop time provided.");
            return;
        }
    }

    $("#invPDF").on('click', function () {
        var element = $("#print"); // Get the element you want to capture
    
        // Hide the buttons
        element.find("#invPDF, #endSession").hide();
    
        // Check if the element exists and is visible
        if (element.length > 0 && element.is(":visible")) {
            html2canvas(element[0]).then(function(canvas) {
                // Convert the canvas to data URL
                var imgageData = canvas.toDataURL("image/png");
    
                // Create a temporary anchor element to trigger the download
                var tempLink = document.createElement('a');
                tempLink.href = imgageData;
                tempLink.download = "receipt.png";
    
                // Trigger the download
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
    
                // Show the buttons again
                element.find("#invPDF, #endSession").show();
            });
        } else {
            console.error("Element is not present or visible");
        }
    });

    document.getElementById('main').style.display = "none";

    window.onload = function() {
        $(window).scrollTop(0);
    };

    setTimeout(function() {
        document.getElementById('splash').style.display = "none";
        document.getElementById('main').style.display = "block";
        fetchData();
        fetchTrans();
    }, 2500);
});
