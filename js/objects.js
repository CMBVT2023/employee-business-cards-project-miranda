// Creates a employeeObject constructor.
export function employeeObject(name, position) {
    this.employeeName = name;
    this.employeePosition = position;
}

// Creates a businessObject constructor.
export function businessObject(id, name, owner, num = 0) {
    this.businessID = id;
    this.businessName = name;
    this.businessOwner = owner;
    this.employeeAmount = num;
}
