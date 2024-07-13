// TODO:
// Create a way to edit employees
// Create a way to remove Employees
// Implement the filter for employees
// Finalize UI Design

// Imports the object constructors from the objects.js file.
import * as objectsModule from "./objects.js";

// Imports the storage classes from the storage.js file.
import * as storageModule from "./storage.js";

// Imports miscellaneous functions from the misc.js file.
import * as miscModule from "./misc.js";

class AppUI {
    constructor() {
        // Initialize necessary variables for the selected business and employees.
        this._currentBusiness;
        this._currentEmployees;
        this._selectedBusiness;
        this._selectedBusinessIndex;

        // Initializes a boolean variable for employeeButtons visibility.
        this._employeeButtonHidden = true;

        // Calls the function to load the necessary HTML elements.
        this._loadHTMLElements();

        // Calls the function to load all of the businesses from localStorage.
        this._loadAllBusinesses();

        // Calls the function to load the default event listeners for the page.
        this._loadEventListeners();
    }

    // Loads all of the necessary HTML elements.
    _loadHTMLElements() {
        // Elements relating to the info-container
        this._businessNameDisplay = document.getElementById('business-name');
        this._employeeAmountDisplay = document.getElementById('employee-amount');
        this._ownerNameDisplay = document.getElementById('owner-name');
        this._changeBusinessButton = document.getElementById('change-business');

        // Elements relating to the team-selection container
        this._teamSelectionContainer = document.getElementById('team-selection');
        this._businessListElement = document.getElementById('business-list');
        this._newBusinessFormButton = document.getElementById('toggle-new-business-form');

        // Elements relating to the filter-container 
        this._employeePositionSelector = document.getElementById('employee-position-selector');
        this._employeeNameFilterInput = document.getElementById('employee-name-filter');

        // Elements relating to the employee-form-container
        this._employeeFormContainer = document.getElementById('employee-form-container');
        this._newEmployeeFormElement = document.getElementById('new-employee-form');
        this._newEmployeeNameInput = document.getElementById('employee-name-input');
        this._newEmployeePositionInput = document.getElementById('employee-position-input');
        this._newEmployeeButton = document.getElementById('create-new-employee');

        // Elements relating to the display-container
        this._newEmployeeFormButton = document.getElementById('toggle-new-employee-form');
        this._employeeButtons = document.getElementById('toggle-employee-buttons');
        this._employeeCardsElement = document.getElementById('employee-cards');
    };

    // Toggles the hidden class on the team selection form.
    _toggleTeamSelection() {
        this._teamSelectionContainer.classList.toggle('hidden');
    };

    // Redirects the current page to the business form page.
    _redirectTeamFormPage() {
        window.location.href = "./business-form.html"
    }

    // Toggles the hidden class on the team employee form.
    _toggleEmployeeForm() {
        this._employeeFormContainer.classList.toggle('hidden');
    }

    // Toggles the hidden class for all of the edit and delete buttons on the various employee cards.
    _toggleEmployeeButtons() {
        // Iterates through all employeeCards button divs and toggles their hidden class.
        for (const button of this._employeeCardsElement.getElementsByClassName('employee-buttons')) {
            button.classList.toggle('hidden')
        }
    }

    // Loads the selected business' employee count into the appropriate display.
    // // Parameter is the amount of employees that the business has, number is calculated based on the length of the business's
    // // associated business array.
    _loadBusinessEmployeeCount(num) {
        // Sets the employee count for the selected business and saves the value to localStorage.
        this._selectedBusiness.employeeAmount = +num;

        // Calls the storageModule method to edit the currently selected business to update its employeeAmount variable.
        storageModule.businessStorage.editBusiness(this._selectedBusinessIndex, this._selectedBusiness);

        // Loads the employeeAmount variable in to its associated display element.
        this._employeeAmountDisplay.innerHTML = this._selectedBusiness.employeeAmount;
    }

    // Loads the selected business' info into their respective displays.
    _loadSelectedBusiness() {
        this._businessNameDisplay.innerHTML = this._selectedBusiness.businessName;
        this._ownerNameDisplay.innerHTML = this._selectedBusiness.businessOwner;

        this._loadEmployees();
    }

    _loadEmployeeButtons() {
        let buttonList = this._employeeCardsElement.querySelectorAll('.employee-buttons');

        // Left off by creating a node list of the employee buttons and just need to assign an event listener to the edit and delete buttons of each employee.
    }

    // Loads all employees associated with the currently selected business.
    _loadEmployees() {
        // Gets the employeeArray from localStorage.
        let employeeArray = storageModule.employeeStorage.getEmployeeArray(this._selectedBusiness.businessID);

        // Clears the employeeCardsElement.
        this._employeeCardsElement.innerHTML = ``;

        // Iterates through the employeeArray.
        for (const item in employeeArray) {
            // Creates a new div containing the current employee's information.
            this._employeeCardsElement.innerHTML += `<div id="employee-${item}" class="business-employee">
                <h1 class="employee-name">${employeeArray[item].employeeName}</h1>
                <p>Position: <span class="employee-position">${employeeArray[item].employeePosition}</span></p>
                <div class="employee-buttons">
                    <h6 class="header-button">Edit</h6>
                    <h6 class="header-button">Delete</h6>
                </div>
            </div>`
        }

        // Checks if the employeeButtonHidden variable is true.
        if (this._employeeButtonHidden) {
            // If so, then all buttons are meant to be hidden and the function is called to do so.
            this._toggleEmployeeButtons();
        }

        this._loadEmployeeButtons();

        // Calls the function to set the businessEmployeeAmount and passes in the length of the employeeArray.
        this._loadBusinessEmployeeCount(employeeArray.length);
    }

    // Loads all of the businesses from localStorage into the businessListElement.
    _loadAllBusinesses() {
        // Gets the businessArray from localStorage.
        let businessArray = storageModule.businessStorage.getBusinessArray();

        // Checks if the businessArray is empty.
        if (businessArray.length > 0) {
            // If at least one business is within the array,
            // Clears the businessListElement.
            this._businessListElement.innerHTML = ''
    
            // Iterates through all elements in the businessArray.
            for (const index in businessArray) {
                // Appends a new div containing a input and label for the business at the current index. 
                this._businessListElement.innerHTML += 
                    `<div>
                        <input type="radio" id="${index}" name="business">
                        <label for="${index}">${businessArray[index].businessName}</label>
                    </div>`;
            }
    
            // Calls the function to load the eventListeners for the inputs in the businessListElement.
            this._loadAllBusinessEventListeners();
        } else {
            // If no businesses are present within the array.
            this._toggleTeamSelection()
        }

    }

    // Loads all the eventListeners for the inputs currently in the businessListElement.
    _loadAllBusinessEventListeners() {
        // Gets the businessArray from localStorage.
        let businessArray = storageModule.businessStorage.getBusinessArray();

        // Initializes a variable and creates a node list with all of the inputs in the businessListElement.
        let radios = this._businessListElement.querySelectorAll('input')

        // Iterates through the node list.
        for (let i = 0; i < radios.length; i++) {
            // Creates an eventListener for the input at the current index.
            radios[i].addEventListener('change', () => {
                // Stores the associated business's index value in the selectedBusinessIndex variable.
                this._selectedBusinessIndex = i;
                // Sets the selectedBusiness variable to the business at the current index.
                this._selectedBusiness = businessArray[i];

                // Calls the function to load the selectedBusiness.
                this._loadSelectedBusiness();
            })
        }
    }

    // Creates a newEmployeeObj based on the user's inputs
    _newEmployeeObj() {
        // Takes the users inputs and calls the miscModule's capitalizeName method and sets the results equal to variables.
        let employeeName = miscModule.capitalizeName(this._newEmployeeNameInput.value);
        let employeePosition = miscModule.capitalizeName(this._newEmployeePositionInput.value);

        // Creates a newEmployeeObj from the variables based on the employee constructor from the objectModule. 
        let newEmployee = new objectsModule.employeeObject(employeeName, employeePosition);

        // Returns the newEmployeeObj.
        return newEmployee;
    }

    // Initializes a newEmployeeObj and stores the newEmployeeObj in the localStorage array associated with the business.
    _createNewEmployee() {
        // Calls the method to create a newEmployeeObj and stores its results in a variable.
        let newEmployee = this._newEmployeeObj();

        // Calls the storageModule's method to add an employee to the associated business' employeeArray in localStorage.
        storageModule.employeeStorage.addEmployee(this._selectedBusiness.businessID, newEmployee);

        // Calls the function to load all of the employees in the associated business' employeeArray to the employeeCardElement.
        this._loadEmployees();
    }

    // Loads all of the default eventListeners for the necessary HTML elements 
    _loadEventListeners() {
        // Event listeners associated with toggling hidden containers.
        this._changeBusinessButton.addEventListener('click', this._toggleTeamSelection.bind(this));
        this._newEmployeeFormButton.addEventListener('click', this._toggleEmployeeForm.bind(this));
        this._employeeButtons.addEventListener('click', () => {
            // Checks the value of the visibility variable.
            if (this._employeeButtonHidden) {
                // If true, calls the function to toggle the hidden class on the employee buttons.
                this._toggleEmployeeButtons()
                // Sets the employeeHidden variable to false, indicating that the user wants them to be visible.
                this._employeeButtonHidden = false;
            } else {
                // If false, calls the function to toggle the hidden class on the employee buttons.
                this._toggleEmployeeButtons()
                // Sets the employeeHidden variable to true, indicating that the user wants them to be hidden.
                this._employeeButtonHidden = true;
            }
        });

        // Event listeners associated with redirecting the webpage.
        this._newBusinessFormButton.addEventListener('click', this._redirectTeamFormPage.bind(this));

        // Event listener associated with creating a new employee
        this._newEmployeeFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this._selectedBusiness !== undefined) {
                this._createNewEmployee();
            } else {
                alert('Please select a business before creating new employees.')
            }
        })
    }
}

// Loads the AppUI class.
let loadUI = new AppUI();