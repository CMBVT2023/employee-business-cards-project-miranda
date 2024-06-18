// Creates a employeeObject constructor.
export function employeeObject(name, position) {
    this.employeeName = name;
    this.employeePosition = position;
}

// Creates a businessObject constructor.
export function businessObject(id, name, owner) {
    this.businessID = id;
    this.businessName = name;
    this.businessOwner = owner;
    this.employeeAmount = 0;
    this.calculateEmployeeAmount = function(arr) {
        this.businessEmployeeAmount = arr.length;
    };
}
