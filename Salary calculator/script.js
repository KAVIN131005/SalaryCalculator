let workData = []; // To store all work entries
let individualSummary = {}; // To store individual work summary (name -> { worktype: { pieces, totalPayment } })
let contractorSummary = {}; // To store contractor work summary (worktype -> { totalPieces, totalPayment })
let contractorSalary = 0; // To store total contractor salary

// Event listener for "Add Bundle" button (to add a work entry for a person)
document.getElementById("addBundleButton").addEventListener("click", function () {
    let name = document.getElementById("name").value;
    let worktype = document.getElementById("worktype").value;
    let rate = parseFloat(document.getElementById("rate").value);
    let bundleNumber = parseInt(document.getElementById("bundleNumber").value);
    let pieces = parseInt(document.getElementById("pieces").value);

    // Validation: Check if all required fields are filled
    if (!name || !worktype || !rate || !bundleNumber || !pieces) {
        alert("Please enter all fields.");
        return;
    }

    // Calculate total payment for the current entry
    let totalPayment = rate * pieces;

    // Store the work data in an array for later use
    workData.push({ name, worktype, bundleNumber, pieces, rate, totalPayment });

    // Add/update individual summary
    if (!individualSummary[name]) {
        individualSummary[name] = {};
    }
    if (!individualSummary[name][worktype]) {
        individualSummary[name][worktype] = { pieces: 0, totalPayment: 0 };
    }
    individualSummary[name][worktype].pieces += pieces;
    individualSummary[name][worktype].totalPayment += totalPayment;

    // Add/update contractor summary
    if (!contractorSummary[worktype]) {
        contractorSummary[worktype] = { totalPieces: 0, totalPayment: 0 };
    }
    contractorSummary[worktype].totalPieces += pieces;
    contractorSummary[worktype].totalPayment += totalPayment;

    // Update the contractor salary
    contractorSalary = 0;
    for (let work in contractorSummary) {
        contractorSalary += contractorSummary[work].totalPayment;
    }

    // Update the tables and contractor salary
    updateWorkDataTable();
    updateIndividualSummaryTable();
    updateContractorSummaryTable();
    updateContractorSalary();

    // Reset the bundle number and pieces fields
    resetBundleAndPieces();

    // Enable the "Add Another Person" button after one work entry is added
    document.getElementById("addPersonButton").disabled = false;

    // Enable the "Next Work Type" button after a work type entry is completed
    document.getElementById("nextWorkTypeButton").disabled = false;

    // Disable the "Add New Work Type" button after the current work type is added
    document.getElementById("addNewWorkTypeButton").disabled = true;
});

// Event listener for "Add Person" button (to reset the form and add another person)
document.getElementById("addPersonButton").addEventListener("click", function () {
    // Reset form inputs when adding a new person
    resetForm();

    // Enable the "Add New Work Type" button when a new person is added
    document.getElementById("addNewWorkTypeButton").disabled = false;

    // Disable the "Add Person" button until one work entry is added
    document.getElementById("addPersonButton").disabled = true;

    // Disable the "Next Work Type" button after adding a person
    document.getElementById("nextWorkTypeButton").disabled = true;
});

// Event listener for "Next Work Type" button (to reset the form for the next work type for the same person)
document.getElementById("nextWorkTypeButton").addEventListener("click", function () {
    let name = document.getElementById("name").value;

    // Check if the name field is filled (only reset if the name is entered)
    if (name) {
        // Reset the form for entering the next work type
        resetForm();

        // Enable "Add New Work Type" button to allow entering new work types
        document.getElementById("addNewWorkTypeButton").disabled = false;

        // Disable the "Next Work Type" button after moving to next work type
        document.getElementById("nextWorkTypeButton").disabled = true;
    } else {
        alert("Please enter a name first.");
    }
});

// Event listener for "Add New Work Type" button (to clear the form and enter a new work type)
document.getElementById("addNewWorkTypeButton").addEventListener("click", function () {
    // Reset the form fields to allow entering a new work type
    resetForm();

    // Enable "Add New Work Type" button again after it has been clicked
    document.getElementById("addNewWorkTypeButton").disabled = false;

    // Ensure "Add Person" and "Next Work Type" are disabled until proper work data is entered
    document.getElementById("addPersonButton").disabled = true;
    document.getElementById("nextWorkTypeButton").disabled = true;
});

// Helper function to reset the bundle number and pieces fields
function resetBundleAndPieces() {
    document.getElementById("bundleNumber").value = "";
    document.getElementById("pieces").value = "";
}

// Helper function to reset the entire form for a new work type
function resetForm() {
    document.getElementById("worktype").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("bundleNumber").value = "";
    document.getElementById("pieces").value = "";
}

// Update the work data table
function updateWorkDataTable() {
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    workData.forEach((entry) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.worktype}</td>
            <td>${entry.bundleNumber}</td>
            <td>${entry.pieces}</td>
            <td>${entry.rate}</td>
            <td>${entry.totalPayment.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update the individual work summary table
function updateIndividualSummaryTable() {
    let tableBody = document.getElementById("individualSummaryBody");
    tableBody.innerHTML = ""; // Clear existing rows

    for (let name in individualSummary) {
        let totalSalary = 0; // Variable to store the total salary of the individual
        for (let worktype in individualSummary[name]) {
            let summary = individualSummary[name][worktype];
            totalSalary += summary.totalPayment; // Sum up the total payments for the individual

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${name}</td>
                <td>${worktype}</td>
                <td>${summary.pieces}</td>
                <td>${summary.totalPayment.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        }

        // Add a row for individual total salary
        let totalSalaryRow = document.createElement("tr");
        totalSalaryRow.innerHTML = `
            <td>${name}</td>
            <td><strong>Total Salary</strong></td>
            <td></td>
            <td><strong>${totalSalary.toFixed(2)}</strong></td>
        `;
        tableBody.appendChild(totalSalaryRow);
    }
}

// Update the contractor work summary table
function updateContractorSummaryTable() {
    let tableBody = document.getElementById("contractorSummaryBody");
    tableBody.innerHTML = ""; // Clear existing rows

    for (let worktype in contractorSummary) {
        let summary = contractorSummary[worktype];
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${worktype}</td>
            <td>${summary.totalPieces}</td>
            <td>${summary.totalPayment.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    }
}

// Update the contractor salary
function updateContractorSalary() {
    document.getElementById("contractorSalary").textContent = contractorSalary.toFixed(2);
}
