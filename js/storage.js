// Initializes a class for storing businesses in localStorage.
export class businessStorage {
    // Sets the localStorage businessArray to the array passed in.
    static setBusinessArray(arr) {
        localStorage.setItem('businesses', JSON.stringify(arr));
    }

    // Returns the localStorage businessArray.
    static getBusinessArray() {
        return JSON.parse(localStorage.getItem('businesses')) || [];
    }

    // Appends a new business to the businessArray in localStorage.
    static addNewBusiness(obj) {
        // Uses the method to retrieve the businessArray from the localStorage.
        let list = this.getBusinessArray();

        // Appends the passed in object to the businessArray.
        list.push(obj);

        // Calls the method to set the businessArray to the altered array.
        this.setBusinessArray(list);
    } 

    static removeBusiness(index) {
        // Uses the method to retrieve the businessArray from the localStorage.
        let list = this.getBusinessArray();

        // Removes the businessObject at the passed in index.
        let [businessObj] = list.splice(index, 1);

        // Calls the method to set the businessArray to the altered array.
        this.setBusinessArray(list);

        // Returns the removed business object.
        return businessObj;
    }

    static editBusiness(index, obj) {
        // Uses the method to retrieve the businessArray from the localStorage.
        let list = this.getBusinessArray();

        // Stores the old business object in a variable.
        let oldObj = list[index];

        // Overwrites the object at the specified index with the new passed in obj.
        list[index] = obj;

        // Calls the method to set the businessArray to the altered array.
        this.setBusinessArray(list);

        // Returns the old business object.
        return oldObj;
    }
}

// Initializes a class for storing employees in localStorage.
export class employeeStorage {
    // Creates an empty employeeArray based on the passed in key.
    static createEmployeeArray(key) {
        localStorage.setItem(key, JSON.stringify([]));
    }

    // Removes the employeeArray thats associated with the key parameter passed in.
    static removeEmployeeArray(key) {
        localStorage.removeItem(key);
    }

    // Returns the employeeArray associated with the passed in key.
    static getEmployeeArray(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    // Stores the passed in array into localStorage and sets its key based on the passed in parameter.
    static setEmployeeArray(key, array) {
        localStorage.setItem(key, JSON.stringify(array));
    }

    // Transfers the employeeArray of a business if their id changes.
    // // The two parameters are the oldKey, or old businessID, and their newKey, or new businessID.
    static transferEmployeeArray(oldKey, newKey) {
        // Stores the employeeArray associated with the oldKey in a variable.
        let employeeArray = this.getEmployeeArray(oldKey)

        // Removes the employeeArray associated with teh oldKey from localStorage.
        this.removeEmployeeArray(oldKey);

        // Stores the saved employeeArray into localStorage using the newKey that was passed in.
        this.setEmployeeArray(newKey, employeeArray);
    }

    // Appends a newEmployeeObj to the employeeArray associated with the passed in key.
    // // The two parameters are a key, to define the business' employeeArray to edit, and the second parameter is the newEmployeeObj that will be added to the array. 
    static addEmployee(key, employeeObj) {
        // Gets the employeeArray associated with the passed in key.
        let employeeArray = this.getEmployeeArray(key);

        // Appends the newEmployeeObj to the employeeArray.
        employeeArray.push(employeeObj);

        // Calls the method to save the new changes to the employeeArray associated with the key.
        this.setEmployeeArray(key, employeeArray);
    }
}