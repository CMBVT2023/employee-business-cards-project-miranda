// TODO:
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
        this._selectedEmployee;
        this._selectedEmployeeIndex;

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
        this._removeAllEmployeeButton = document.getElementById('remove-all-employees');
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
        this._newEmployeeFormTitle = document.getElementById('employee-form-title');

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

    // Updates the selected business' employee count and their employee positions into their appropriate displays.
    // // Parameter is the amount of employees that the business has, number is calculated based on the length of the business's
    // // associated business array, and an array containing all employee positions.
    _updateCurrentBusiness(num, arr) {
        // Sets the employee count for the selected business and saves the value to localStorage.
        this._selectedBusiness.employeeAmount = +num;
        this._selectedBusiness.employeePositions = arr;

        // Calls the storageModule method to edit the currently selected business to update its employeeAmount variable and employeePositions array.
        storageModule.businessStorage.editBusiness(this._selectedBusinessIndex, this._selectedBusiness);

        // Loads the employeeAmount variable in to its associated display element.
        this._employeeAmountDisplay.innerHTML = this._selectedBusiness.employeeAmount;

        // Loads the default option into the employeePositionSelection element.
        this._employeePositionSelector.innerHTML = `<option value="none">-Select an Item-</option>`;

        // Loads all employeePositions into the employeePositionSelection element.
        for (const item of this._selectedBusiness.employeePositions) {
            this._employeePositionSelector.innerHTML += `<option>${item}</option>`
        }

        // Clears the employeeNameFilterInput.
        this._employeeNameFilterInput.value = ``;

        // Checks if the employeeAmount for the selected business is greater than 0.
        if (this._selectedBusiness.employeeAmount > 0) {
            // If so, displays the removeAll button.
            this._removeAllEmployeeButton.classList.remove('hidden');
        } else {
            // If not, the removeAll button is hidden.
            this._removeAllEmployeeButton.classList.add('hidden');
        }
    }

    // Loads the selected business' info into their respective displays.
    _loadSelectedBusiness() {
        this._businessNameDisplay.innerHTML = this._selectedBusiness.businessName;
        this._ownerNameDisplay.innerHTML = this._selectedBusiness.businessOwner;

        // Toggles the teamSelection display once a business is selected by the user.
        this._toggleTeamSelection();

        this._loadEmployees();
    }

    _loadEmployeeButtons() {
        // Creates a node list of employeeButton divs.
        let buttonList = this._employeeCardsElement.querySelectorAll('.employee-buttons');

        // Iterates through all divs in the node list.
        for (const buttonGroup of buttonList) {
            // Creates a node list containing all of the h6 header buttons.
            let buttons = buttonGroup.querySelectorAll('h6');
            // Initializes an eventListener to trigger the edit mode and set selectedEmployeeIndex to the parentContainer's id.
            buttons[0].addEventListener('click', () => {
                this._selectedEmployeeIndex = miscModule.returnIndex(buttonGroup.parentElement.getAttribute('id'));
                this._loadEditEmployeeMode();
            }, {once : true})
            // Initializes an eventListener to remove the selected employee based on its parentContainer's id.
            buttons[1].addEventListener('click', () => {
                this._selectedEmployeeIndex = miscModule.returnIndex(buttonGroup.parentElement.getAttribute('id'));
                this._removeEmployee(this._selectedEmployeeIndex);
            }, {once : true})
        }
    }

    // Loads all employees associated with the currently selected business.
    _loadEmployees() {
        // Gets the employeeArray from localStorage.
        let employeeArray = storageModule.employeeStorage.getEmployeeArray(this._selectedBusiness.businessID);

        // Initializes an empty array to store all employee positions.
        let employeePositions = [];

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
            </div>`;

            // Checks if the employeePosition is already in the employeePosition array.
            if (employeePositions.indexOf(employeeArray[item].employeePosition) === -1) {
                // If not, adds the element to the array after passing it through the misc module's capitalization function.
                employeePositions.push(miscModule.capitalizeName(employeeArray[item].employeePosition))
            };
        };

        // Checks if the employeeButtonHidden variable is true.
        if (this._employeeButtonHidden) {
            // If so, then all buttons are meant to be hidden and the function is called to do so.
            this._toggleEmployeeButtons();
        }

        // Checks if the employeeArray for the selected business is equal to zero.
        if (employeeArray.length === 0) {
            // If so, displays the new employeeCreation form.
            this._employeeFormContainer.classList.remove('hidden')
        } else {
            this._employeeFormContainer.classList.add('hidden')
        }

        // Calls the function to load the eventListeners for the employeeButtons.
        this._loadEmployeeButtons();

        // Calls the function to update the currently selected business with its employeeCount value and employeePositions array.
        this._updateCurrentBusiness(employeeArray.length, employeePositions);
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

    // Edits the employee with the new user input values.
    _editEmployee() {
        // Calls the method to create a newEmployeeObj and stores its results in a variable.
        let newEmployee = this._newEmployeeObj();

        // Calls the storageModule's method to edit an employee to the associated business' employeeArray in localStorage.
        storageModule.employeeStorage.editEmployee(this._selectedBusiness.businessID, this._selectedEmployeeIndex, newEmployee);

        // Calls the function to load all of the employees in the associated business' employeeArray to the employeeCardElement.
        this._loadEmployees();

        // Calls the function to unload the edit mode display.
        this._unloadEditMode();
    }

    // Loads the editing mode for editing existing employees
    _loadEditEmployeeMode() {
        // Gets the employeeArray from localStorage.
        let employeeArray = storageModule.employeeStorage.getEmployeeArray(this._selectedBusiness.businessID);

        this._newEmployeeNameInput.value = employeeArray[this._selectedEmployeeIndex].employeeName;
        this._newEmployeePositionInput.value = employeeArray[this._selectedEmployeeIndex].employeePosition;
        this._newEmployeeButton.value = "Save Changes";
        this._employeeFormContainer.classList.remove('hidden');
        this._newEmployeeFormTitle.innerHTML = 'Edit Employee'
    }

    // Unloads the edit mode and sets the display and inputs back to creation mode.
    _unloadEditMode() {
        this._newEmployeeNameInput.value = '';
        this._newEmployeePositionInput.value = '';
        this._newEmployeeButton.value = "Create New Employee";
        this._employeeFormContainer.classList.add('hidden');
        this._newEmployeeFormTitle.innerHTML = 'New Employee'
    }

    // Removes the employee from the currently selected business's employeeArray. 
    _removeEmployee() {
        // Initializes a variable to store the result of a confirm popup
        let result = confirm("Warning: This action cannot be undone!\nDo you still want to continue?");

        // Checks the value of the result variable.
        if (result) {
            // Calls the storageModule method to remove the currently selected employee at its specified index.
            storageModule.employeeStorage.removeEmployee(this._selectedBusiness.businessID, this._selectedEmployeeIndex);

            // Calls the function to reload the employeeArray for the currently selected business.
            this._loadEmployees();
        }
    }

    // Removes all employees from the currently selected business's employeeArray.
    _removeAllEmployees() {
        // Initializes a variable to store the result of a confirm popup
        let result = confirm("Warning: This action cannot be undone!\nDo you still want to continue?");

        // Checks the value of the result variable.
        if (result) {
            // If the value is true,
            // Calls the storage module's method to remove all employees from the passed in key.
            storageModule.employeeStorage.removeAllEmployees(this._selectedBusiness.businessID);
            
            // Calls the function to reload all employees for the display.
            this._loadEmployees()
        }
    }

    // Filters the employees displayed in the employeeCard div based on the user's inputs.
    _filterEmployees() {
        // Initializes variables to store the user's inputs for the filter.
        let filterNameValue = this._employeeNameFilterInput.value === "" ? undefined : this._employeeNameFilterInput.value;
        let filterPositionValue = this._employeePositionSelector.value === "none" ? undefined : this._employeePositionSelector.value;

        // Checks that a business is selected before attempting to filter the employeeCard div.
        if (this._selectedBusiness !== undefined) {
            // Iterates through all employee cards in the employeeCardsElement div.    
            for (const employee of this._employeeCardsElement.querySelectorAll('.business-employee')) {
                // Initializes a variable that will signal if an employee matches the filter inputs.
                let match = true;

                // Checks that the user has specified a name input filter.
                if (filterNameValue !== undefined) {
                    // Initializes a variable to store the employee name from the card element.
                    let employeeName = employee.querySelector('h1').innerHTML;

                    // Initializes a variable to store the user's filter input as a regex pattern.
                    let regexPattern = new RegExp(`(^${filterNameValue}.*)`, 'gi')

                    // Checks if the an the employee's card name matches the user's input filter.
                    if (employeeName.match(regexPattern) === null) {
                        // If not, set match equal to false.
                        match = false;
                    }
                }

                // Checks if the user has specified a position filter, or if the match variable is already false.
                if (filterPositionValue !== undefined || match === false) {
                    // Checks if the filterPOsitionValue is not equal to the employee's position.
                    if (employee.querySelector('span').innerHTML !== filterPositionValue) {
                        // If not, set match equal to false.
                        match = false;
                    }
                }

                // Checks the final value of match.
                if (match) {
                    // If match remains true, then the employee is displayed in the card element.
                    employee.classList.remove('hidden')
                } else {
                    // If the match changed to false, then the employee is hidden in the card element.
                    employee.classList.add('hidden')
                }
            }
        }
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

        // Event listener associated with creating a new employee or editing an existing one.
        this._newEmployeeFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this._selectedBusiness !== undefined) {
                if (this._newEmployeeButton.value === "Create New Employee") {
                    this._createNewEmployee();
                } else if (this._newEmployeeButton.value === "Save Changes") {
                    this._editEmployee();
                }
            } else {
                alert('Please select a business before creating new employees.')
            }
        })

        // Event listeners associated with removing employees from the selected business.
        this._removeAllEmployeeButton.addEventListener('click', () => {
            if (this._selectedBusiness !== undefined) {
                this._removeAllEmployees();
            }
        })
    
        // Event listeners associated with filtering employees in the selected business's employee array.
        this._employeeNameFilterInput.addEventListener('keyup', this._filterEmployees.bind(this));
        this._employeePositionSelector.addEventListener('change', this._filterEmployees.bind(this));
    }
}

// Loads the AppUI class.
let loadUI = new AppUI();