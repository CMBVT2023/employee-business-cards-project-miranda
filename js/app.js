// TODO: 
// Create function to display employees
// Have the business selection/creation menu open if no businesses already exist
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

    // Loads the selected business' employee count into the appropriate display.
    _loadBusinessEmployeeCount() {
        this._selectedBusiness.calculateEmployeeAmount;
        this._employeeAmountDisplay.innerHTML = this._selectedBusiness.employeeAmount;
    }

    // Loads the selected business' info into their respective displays.
    _loadSelectedBusiness() {
        this._businessNameDisplay.innerHTML = this._selectedBusiness.businessName;
        this._ownerNameDisplay.innerHTML = this._selectedBusiness.businessOwner

        this._loadBusinessEmployeeCount();
    }

    _loadEmployees() {
        this._
    }

    // Loads all of the businesses from localStorage into the businessListElement.
    _loadAllBusinesses() {
        // Gets the businessArray from localStorage.
        let businessArray = storageModule.businessStorage.getBusinessArray();

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