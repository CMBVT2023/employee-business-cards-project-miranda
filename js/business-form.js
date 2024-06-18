// Imports necessary modules.
import * as objectsModule from "./objects.js"
import * as storageModule from "./storage.js"
import * as miscModule from "./misc.js"

// Loads necessary HTML Elements from the webpage
const newBusinessNameInput = document.getElementById('business-name-input');
const newBusinessOwnerInput = document.getElementById('business-owner-input');
const teamForm = document.getElementById('team-form');
const teamFormReturnButton = document.getElementById('team-form-return');
const teamListElement = document.getElementById('team-list-container');
const teamFormSubmitButton = document.getElementById('form-submit-button');
const teamFormCancelationButton = document.getElementById('edit-mode-cancelation');
const removeAllBusinessButton = document.getElementById('remove-all-businesses');

// Global variable that saves the index of the task currently being edited, else its value is set to -1.
let selectedBusiness = -1;

// Upon a confirmation, redirects user's back to the initial web url.
function redirectMainPage() {
    window.location.href = "./index.html"
}

// Clears any changes made to the page by the user.
function clearSelection() {
    newBusinessNameInput.value = '';
    newBusinessOwnerInput.value = '';
    teamFormSubmitButton.value = 'Create New Business';
    let selectedBusiness = -1;
    toggleCancelationButton(false);
}

// Toggles the form's cancelation button based on the boolean passed in, true to toggle it on and false to toggle it off.
function toggleCancelationButton(value) {
    // Checks the passed in parameter's value.
    if (value) {
        // If the parameter is true,

        // Displays the cancelation button.
        teamFormCancelationButton.classList.remove('hidden');

        // Assigns an eventlistener to clear the edit mode.
        teamFormCancelationButton.addEventListener('click', () => {
            confirm ("Are you sure you want to discard any changes made to this business?") ? clearSelection() : toggleCancelationButton(true);
        }, {once:true});
    } else {
        // If the parameter is false,

        // Hides the cancel button from the form.
        teamFormCancelationButton.classList.add('hidden');
    }
}

// Toggles the form's remove all button based on the boolean passed in, true to toggle it on and false to toggle it off.
function toggleRemoveAllButton(value) {
    // Checks the passed in parameter's value.
    if (value) {
        // If true,

        // Displays the remove all button.
        removeAllBusinessButton.classList.remove('hidden')

        // Adds an eventListener to the remove all button 
        removeAllBusinessButton.addEventListener('click', () => {
            // Pops up a modal that confirms the user wants to remove all items from localStorage.
            let result = confirm ("Warning, doing this will remove all businesses and their employee lists from storage permanently.") 
            
            // Checks the user's choice
            if (result) {
                // If true, or the user confirms.

                // Clears the localStorage
                localStorage.clear();

                // Calls the method to load the team list.
                loadTeamList();
            };
        })
    } else {
        // If false,

        // Hides the remove all button from the user's display.
        removeAllBusinessButton.classList.add('hidden')
    }
}

// Loads the event listeners for the buttons associated with the various teams.
function loadTeamEventListeners() {
    // Creates a node list of the various team buttons.
    let headerButtons = teamListElement.querySelectorAll('h4')

    // Iterates through the node list.
    for (let index = 0; index < headerButtons.length; index++) {
        // Checks if the button is an 'Edit' button or a 'Remove' button.
        if (headerButtons[index].innerHTML === 'Edit') {
            // If it is an 'Edit' button.
            // Add an eventlistener to the button that will call the method that will load editing mode.
            headerButtons[index].addEventListener('click', () => {
                loadEditMode(headerButtons[index].parentElement.id)
            }, {once:true})
        } else if (headerButtons[index].innerHTML === 'Remove') {
            // If it is a 'Remove' button
            // Add an eventlistener to the button that will call the method to remove the business.
            headerButtons[index].addEventListener('click', () => {
                removeBusiness(headerButtons[index].parentElement.id)
            }, {once:true})
        }
    }
}

// Loads the various teams into the team display element, along with an edit and remove button.
function loadTeamList() {
    // Calls the storageModule method to retrieve the businessArray from localStorage.
    let list = storageModule.businessStorage.getBusinessArray();

    // Clears all items being displayed in the teamListElement.
    teamListElement.innerHTML = ``;

    if (list.length) {
        // Iterates through the businessArray.
        for (let index = 0; index < list.length; index++) {
            // Appends a div with the currently selected business' values and necessary buttons.
            teamListElement.innerHTML += `<div id='${index}'>
                <h3>Business: ${list[index].businessName}</h3>
                <h3>Employee Count: ${list[index].employeeAmount}</h3>
                <h3>Owner: ${list[index].businessOwner}</h3>
                <h4 class="header-button">Edit</h4>
                <h4 class="header-button">Remove</h4>
            </div>`
        }

        // Calls the method to toggle the removeAllButton.
        toggleRemoveAllButton(true);

        // Calls the method to load the necessary evenListeners for the newly created buttons. 
        loadTeamEventListeners();
    } else {
        // Calls the method to remove the removeAllButton from the user's display.
        toggleRemoveAllButton(false);
    }
}

// Checks that the newly created business does not conflict with a previously created business.
function confirmNewBusiness(businessObj) {
    // Calls the storageModule method to retrieve the businessArray from localStorage.
    let businessArr = storageModule.businessStorage.getBusinessArray();

    // Iterates through the businessArray.
    for (const obj of businessArr) {
        // Checks if the newly created businessId conflicts with any of the already created businessIDs.
        if (obj.businessID === businessObj.businessID) {
            // If a conflict is found, return false.
            return false;
        }
    }

    // Calls the storageModule method to add a new business to the businessArray.
    storageModule.businessStorage.addNewBusiness(businessObj);

    // Return true to signify that no conflict was found with the newly created object.
    return true;
}

// Creates a new businessObject with the values in the form inputs.
function newBusinessObj() {
    // Initializes new variables to store the user's inputs, and the values are capitalizes before hand.
    let businessName = miscModule.capitalizeName(newBusinessNameInput.value);
    let businessOwner = miscModule.capitalizeName(newBusinessOwnerInput.value);

    // Creates a new businessID by calling the miscModule's method to convert a string to spinalTap.
    let businessID = miscModule.spinalTapConversion(businessName);

    // Creates a new businessObject by using the objectModule's businessObject constructor.
    let newBusiness = new objectsModule.businessObject(businessID, businessName, businessOwner);

    // Returns the newly created business.
    return newBusiness;
}

// Creates a new business via the user's input on the form container.
function createNewBusiness() {
    // Initializes a new variable to store a newBusinessObject, and the object is created by calling the method to create a newBusinessObject.
    let newBusiness = newBusinessObj();
    
    // Calls the method to check if the newly created businessObject conflicts with any previously created businesses.
    let result = confirmNewBusiness(newBusiness);

    // Checks the value of the result boolean.
    if (result) {
        // If true, signifies that the new business has no conflicts.

        // Calls the storageModule's method to create a newEmployeeArray in localStorage with a key based on the newBusiness's id.
        storageModule.employeeStorage.createEmployeeArray(newBusiness.businessID);

        // Calls the method to remove clear all user inputs.
        clearSelection();

        // Calls the method to reload the businessArray on the page.
        loadTeamList();
    } else {
        // If false, signifies that the new business has a conflict.

        // Pops up a modal to alert the user that the new business has a conflict.
        confirm ('Error, business already exist.');
    }
}

// Edits the business at the specified index with the edited user inputs.
function editBusiness(index) {
    // Have this grab the localStorage employee array associated with this business beforehand and clear it from localStorage,
    // then have the grabbed array be stored with the new key, the spinal tap case of the possibly altered title.

    // Initializes a new variable to store a newBusinessObject, and the object is created by calling the method to create a newBusinessObject.
    let newBusiness = newBusinessObj();

    // Calls the storageModule method to overwrite the previous businessObject with the new changes at the specified index.
    let oldObj = storageModule.businessStorage.editBusiness(index, newBusiness)

    storageModule.employeeStorage.transferEmployeeArray(oldObj.businessID, newBusiness.businessID);

    // Calls the method to remove clear all user inputs.
    clearSelection();

    // Calls the method to reload the businessArray on the page.
    loadTeamList();
}

// Removes the business at the specified index from the businessArray.
function removeBusiness(index) {
    // Pop up a modal to ensure the user wants to remove the businessObject.
    let result = confirm ('Warning this will remove the associate employee array, are you sure you want to continue?');

    // Checks the result of the confirm modal.
    if (result) {
        // If the user confirms,

        // // Add a way to Remove the business's employeeArray from localStorage.

        // Remove the business from the businessArray and temporarily stores the removed item into a variable.
        let obj = storageModule.businessStorage.removeBusiness(index);

        // Calls the storageModule's method to remove the business' employeeArray from local storage
        storageModule.employeeStorage.removeEmployeeArray(obj.businessID);

        // Calls the method to remove clear all user inputs.
        clearSelection();

        // Calls the method to reload the businessArray on the page.
        loadTeamList();
    }
}

// Makes the necessary UI changes to allow editing of a businessObject at the specified index from the businessArray.
function loadEditMode(index) {
    // Calls the storageModule method to retrieve the businessArray from localStorage.
    let list = storageModule.businessStorage.getBusinessArray();

    // Sets the global variable to the index of the business currently being edited.
    selectedBusiness = index;

    // Sets the form inputs to the values of the businessObject being edited.
    newBusinessNameInput.value = list[index].businessName;
    newBusinessOwnerInput.value = list[index].businessOwner;

    // Changes the teamFormSubmitButton's value to "Edit Business" to signifies that an item is being edited.
    teamFormSubmitButton.value = "Edit Business";

    // Calls the method to toggle the cancelation button
    toggleCancelationButton(true);
}

// Loads the default eventListeners for the webpage.
function loadEventListeners() {
    // Eventlistener associated with redirecting back to the main webpage.
    teamFormReturnButton.addEventListener('click', redirectMainPage);

    // Eventlistener associated with adding or editing a business.
    teamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        teamFormSubmitButton.value === "Create New Business" ? createNewBusiness() : editBusiness(selectedBusiness);
    });
}

loadEventListeners();
loadTeamList();