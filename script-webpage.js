// Updated generateInputs() to create 10 inputs per test case
function generateInputs() {
    var numTestCases = parseInt(document.getElementById("numTestCases").value);
    var inputContainer = document.getElementById("inputContainer");

    // We expect between 1 and 10 test cases
    if (!isNaN(numTestCases) && numTestCases >= 1 && numTestCases <= 10) {
        inputContainer.innerHTML = "";
        
        for (var i = 1; i <= numTestCases; i++) {
            // 10 input fields per test case:
            // 1: Voltmeter reading, 2: Ammeter reading,
            // 3-6: Inner surface temperatures (T1-T4),
            // 7-10: Outer surface temperatures (T5-T8)
            var inputLabels = [
                "Voltmeter Reading (V) for case " + i,
                "Ammeter Reading (I) for case " + i,
                "Inner Surface Temperature T1 for case " + i,
                "Inner Surface Temperature T2 for case " + i,
                "Inner Surface Temperature T3 for case " + i,
                "Inner Surface Temperature T4 for case " + i,
                "Outer Surface Temperature T5 for case " + i,
                "Outer Surface Temperature T6 for case " + i,
                "Outer Surface Temperature T7 for case " + i,
                "Outer Surface Temperature T8 for case " + i
            ];

            for (var j = 0; j < inputLabels.length; j++) {
                var inputLabel = document.createElement("label");
                inputLabel.textContent = inputLabels[j];

                var inputField = document.createElement("input");
                inputField.type = "text";
                // Name inputs sequentially: input1, input2, …, input10 per test case.
                inputField.name = "input" + ((i - 1) * 10 + j + 1);

                inputField.addEventListener("keydown", handleEnterKey);

                inputContainer.appendChild(inputLabel);
                inputContainer.appendChild(inputField);
                inputContainer.appendChild(document.createElement("br"));
            }
            // Add extra break between test cases
            inputContainer.appendChild(document.createElement("br"));
        }
        inputContainer.style.display = "block";
    } else {
        alert("Please enter a valid number of test cases (1-10).");
    }
}

function calculateResults() {
    var numTestCases = parseInt(document.getElementById("numTestCases").value);

    // Fixed specifications for the composite wall
    const slabLength = 0.2;  // 200 mm in meters
    const slabWidth = 0.2;   // 200 mm in meters
    const slabArea = slabLength * slabWidth;  // 0.04 m²
    const slabThickness = 0.037;  // 37 mm in meters
    const systemEfficiency = 0.57;  // 57%

    // Create results table with appropriate headers
    var resultsTable = document.createElement("table");
    resultsTable.id = "resultsTable";
    resultsTable.innerHTML = `
        <thead>
            <tr>
                <th>Case</th>
                <th>Heat Input Q (W)</th>
                <th>Average Inner Temp Ti (°C)</th>
                <th>Average Outer Temp To (°C)</th>
                <th>ΔT (°C)</th>
                <th>Thermal Resistance R (°C/W)</th>
                <th>Thermal Conductivity k (W/m.K)</th>
                <th>Heat Flux q (W/m²)</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    var resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(resultsTable);

    // Check that all input fields are filled for each test case
    var allInputsFilled = true;
    for (var i = 1; i <= numTestCases; i++) {
        for (var j = 1; j <= 10; j++) {
            var inputField = document.getElementsByName("input" + ((i - 1) * 10 + j))[0];
            if (!inputField || inputField.value === "") {
                allInputsFilled = false;
                break;
            }
        }
        if (!allInputsFilled) break;
    }
    
    if (!allInputsFilled) {
        alert("Please fill in all input fields before calculating.");
        return;
    }

    // Loop through test cases and perform calculations
    for (var i = 0; i < numTestCases; i++) {
        // Retrieve inputs for each case
        var V = parseFloat(document.getElementsByName("input" + ((i) * 10 + 1))[0].value);
        var I = parseFloat(document.getElementsByName("input" + ((i) * 10 + 2))[0].value);
        var T1 = parseFloat(document.getElementsByName("input" + ((i) * 10 + 3))[0].value);
        var T2 = parseFloat(document.getElementsByName("input" + ((i) * 10 + 4))[0].value);
        var T3 = parseFloat(document.getElementsByName("input" + ((i) * 10 + 5))[0].value);
        var T4 = parseFloat(document.getElementsByName("input" + ((i) * 10 + 6))[0].value);
        var T5 = parseFloat(document.getElementsByName("input" + ((i) * 10 + 7))[0].value);
        var T6 = parseFloat(document.getElementsByName("input" + ((i) * 10 + 8))[0].value);
        var T7 = parseFloat(document.getElementsByName("input" + ((i) * 10 + 9))[0].value);
        var T8 = parseFloat(document.getElementsByName("input" + ((i) * 10 + 10))[0].value);

        // Calculate heat input using Q = V * I * efficiency
        var Q = V * I * systemEfficiency;

        // Calculate average inner and outer temperatures
        var Ti = (T1 + T2 + T3 + T4) / 4;
        var To = (T5 + T6 + T7 + T8) / 4;
        var deltaT = Ti - To;

        // Thermal Resistance R = ΔT / Q (avoid division by zero)
        var R = Q !== 0 ? deltaT / Q : 0;

        // Thermal Conductivity k = L / (R * A)
        var k_val = (R !== 0) ? slabThickness / (R * slabArea) : 0;

        // Heat Flux q = Q / A
        var q = Q / slabArea;

        // Append the results row to the table
        var resultRow = document.createElement("tr");
        resultRow.innerHTML = `
            <td>${i + 1}</td>
            <td>${Q.toFixed(2)}</td>
            <td>${Ti.toFixed(2)}</td>
            <td>${To.toFixed(2)}</td>
            <td>${deltaT.toFixed(2)}</td>
            <td>${R.toFixed(2)}</td>
            <td>${k_val.toFixed(2)}</td>
            <td>${q.toFixed(2)}</td>
        `;
        resultsTable.getElementsByTagName('tbody')[0].appendChild(resultRow);
    }
    resultsContainer.style.display = "block";
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (document.activeElement.id === 'numTestCases') {
            generateInputs();
        } else if (document.activeElement.id === 'calculateButton') {
            calculateResults();
        } else {
            var inputs = document.getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                if (document.activeElement === inputs[i]) {
                    if (i === inputs.length - 1) {
                        calculateResults();
                    } else {
                        inputs[i + 1].focus();
                        break;
                    }
                }
            }
        }
    }
}
