const searchTabToggle = () => {
    if ($('#personnelBtn').hasClass('active')) {
        $('#searchInpDept').hide();
        $('#searchInpLoc').hide();
        $('#searchInpEmp').show();
    } else if ($('#departmentsBtn').hasClass('active')) {
        $('#searchInpLoc').hide();
        $('#searchInpEmp').hide();
        $('#searchInpDept').show();
    } else if ($('#locationsBtn').hasClass('active')) {
        $('#searchInpDept').hide();
        $('#searchInpEmp').hide();
        $('#searchInpLoc').show();
    }
};

const clearSearchBar = () => {
    $('#searchInpEmp').val('');
    $('#searchInpDept').val('');
    $('#searchInpLoc').val('');
    getEmployees();
    getDepartments();
    getLocations();
};

const getEmployees = () => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getAll.php',
        success: (response) => {
            if (response.status.code == '200') {
                //let content = "";
                //console.log('employee', response);
                populateEmployees(response.data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching employee info: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const populateEmployees = (data) => {
    let content = "";
        //console.log('populate', data);
    for (let i = 0; i < data.length; i++) {
        let employee = data[i];
        content += `<tr>`;
        content += `<td class="employeeNameList"> ${employee.lastName}, ${employee.firstName} </td>`;
        content += `<td class="employeeEmailList"> ${employee.email}</td>`;
        content += `<td class="employeeDeptList1"> ${employee.department}</td>`;
        content += `<td class="employeeLocList1"> ${employee.location}</td>`;
        content += `<td class="text-end"><button type="button" class="btn btn-sm" id="editPersonnelBtn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${employee.id}"><i class="fa-solid fa-pencil fa-fw"></i></button></td>`
        content += `<td class="text-end"><button type="button" class="btn btn-sm" id="deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" data-id="${employee.id}" data-name="${employee.lastName}, ${employee.firstName}"><i class="fa-solid fa-trash fa-fw"></i></button></td>`
        content += `</tr>`;
    }
    $('#personnelTableBody').html(content);
};

const getDepartments = () => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getDeptLocList.php',
        success: (response) => {
            //console.log(response);
            if (response.status.code == '200') {

                populateDepartments(response.data);
                createDepartmentList(response.data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching departments: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const populateDepartments = (data) => {
    let content = "";
    for (let i = 0; i < data.length; i++) {
        let employee = data[i];
        content += `<tr>`;
        content += `<td class="employeeDeptList"> ${employee.department}</td>`;
        content += `<td class="employeeLocList"> ${employee.location}</td>`;
        content += `<td class="text-end"><button type="button" class="btn btn-sm" id="editDepartmentBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${employee.id}"><i class="fa-solid fa-pencil fa-fw"></i></button></td>`
        content += `<td class="text-end"><button type="button" class="btn btn-sm" id="deleteDepartmentBtn" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${employee.id}" data-name="${employee.department}"><i class="fa-solid fa-trash fa-fw"></i></button></td>`
        content += `</tr>`;
    }
    $('#departmentTableBody').html(content);               
}

const createDepartmentList = (list) => {

    let content = '';

    for (let i = 0; i < list.length; i++) {
        let deptId = list[i].id;
        let deptName = list[i].department;

        content += `<option value='${deptId}'>${deptName}</option>`;
    }
    $('#addPersonnelDepartment').html(content);
    $('#editPersonnelDepartment').html(content);
};

const getLocations = () => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getLocation.php',
        success: (response) => {
            if (response.status.code == '200') {
                
                populateLocation(response.data);
                createLocationList(response.data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching locations: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const populateLocation = (data) => {
    let content = "";
    for (let i = 0; i < data.length; i++) {
        let employee = data[i];

        content += `<tr>`;
        content += `<td class="employeeLocList">${employee.location}</td>`;
        content += `<td class="text-end"><button type="button" class="btn btn-sm" id="editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${employee.id}"><i class="fa-solid fa-pencil fa-fw"></i></button></td>`
        content += `<td class="text-end"><button type="button" class="btn btn-sm" id="deleteLocationBtn" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${employee.id}" data-name="${employee.location}"><i class="fa-solid fa-trash fa-fw"></i></button></td>`
        content += `</tr>`;
    }
    $('#locationTableBody').html(content);
}

const createLocationList = (list) => {
    let content = '';

    for (let i = 0; i < list.length; i++) {
        let LocId = list[i].id;
        let LocName = list[i].location;

        content += `<option value='${LocId}'>${LocName}</option>`;
    }
    $('#editLocation').html(content);
    $('#addLocationList').html(content);
};

//Create,update and deletion for employee 

const getEmployeeDetailsById = (id) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getPersonnelById.php',
        data: { id },
        success: (response) => {
            //console.log(response);
            if (response.status.code == '200') {
                $('#editPersonnelFirstName').val(response.data.personnel[0].firstName);
                $('#editPersonnelLastName').val(response.data.personnel[0].lastName);
                $('#editPersonnelJobTitle').val(response.data.personnel[0].jobTitle);
                $('#editPersonnelEmailAddress').val(response.data.personnel[0].email);
                $('#editPersonnelDepartment').val(response.data.personnel[0].departmentID);
                $('#editPersonnelEmployeeID').val(response.data.personnel[0].id);

            } 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Unable to fetch the employee details: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const createNewEmployee = (firstName, lastName, jobTitle, email, departmentID) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/insertEmployee.php',
        data: { firstName, lastName, jobTitle, email, departmentID },
        dataType: 'json',
        success: (response) => {

            if (response.status.code == '200') {
                alert('Employee added Successfully!');
                $('#addPersonnelForm')[0].reset();

                getEmployees();
            } else {
                alert('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while adding new employee " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const updateNewEmployee = (firstName, lastName, jobTitle, email, departmentID, personnelID) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/updateEmployee.php',
        data: { firstName, lastName, jobTitle, email, departmentID, personnelID },
        dataType: 'json',
        success: (response) => {
            if (response.status.code == '200') {
                alert ('Employee info updated succesfully!');
                getEmployees();
            } else {
                alert('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while updating employee " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const deleteEmployee = (id) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/deleteEmployee.php',
        data: { id },
        dataType: 'json',
        success: (response) => {
            if (response.status.code == '200') {
                alert('Deleted successfully!');
                getEmployees();
            } else {
                alert('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while deleting employee" + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

//create, update and deletion for department

const getDepartmentById = (id) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getDepartmentByID.php',
        data: { id },
        dataType: 'json',
        success: (response) => {
            if (response.status.code == '200') {
                //console.log(response);
                $('#editDepartmentName').val(response.data[0].name);
                $('#editLocation').val(response.data[0].locationID);
                $('#editDepartmentID').val(response.data[0].id);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Unable to fetch the department details: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const createNewDepartment = (name, locationID) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/insertDepartment.php',
        data: { name, locationID },
        dataType: 'json',
        success: (response) => {

            if (response.status.code == '200') {
                alert('Department added Successfully!');
                getDepartments();
            } else if (response.status.code == '409') {
                alert('Department already exist!')
            } else if (response.status.code == '405') {
                alert('Duplicate Entry!')
            } else {
                alert('Error: ' + response.status.description);
            }
            $('#addDepartmentForm')[0].reset();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while inserting new department " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const updateNewDepartment = (departmentName, locationID, departmentID) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/updateDepartment.php',
        data: { departmentName, locationID, departmentID },
        dataType: 'json',
        success: (response) => {
            if (response.status.code == '200') {
                alert ('Department updated succesfully!');
                getDepartments();
            } else {
                alert('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while updating department " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};


const deleteDepartment = (id) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/deleteDepartment.php',
        data: { id },
        dataType: 'json',
        success: (response) => {
            if (response.status.code == '200') {
                alert('Deleted successfully!');
                getDepartments();
            } else if (response.status.code == '405') {
                alert('Sorry, unable to delete. Department has dependencies!')
            
            } else {
                alert('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while deleting department" + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

//create update and deletion for location

const getLocationById = (id) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getlocationByID.php',
        data: { id },
        dataType: 'json',
        success: (response) => {
            if (response.status.code == '200') {
                //console.log(response);
                $('#editLocationName').val(response.data[0].name);
                $('#editLocationID').val(response.data[0].id);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Unable to fetch locations: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const createNewLocation = (name) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/insertLocation.php',
        data: { name },
        dataType: 'json',
        success: (response) => {

            if (response.status.code == '200') {
                alert('Location added Successfully!');
                getLocations();
            } else if (response.status.code == '409') {
                alert('Duplicate Entry!')
            } else {
                alert('Error: ' + response.status.description);
            }
            $('#addLocationForm')[0].reset();

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while adding new location " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const updateNewLocation = (locationName, locationID) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/updateLocation.php',
        data: { locationName, locationID },
        dataType: 'json',
        success: (response) => {
            console.log(response);
            if (response.status.code == '200') {
                alert ('Location updated succesfully!');
                getLocations();
            } else if (response.status.code == '405') {
                alert('Duplicate Entry!')
            
            } else {
                alert('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while updating location " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const deleteLocation = (locationID) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/deleteLocation.php',
        data: { locationID },
        dataType: 'json',
        success: (response) => {
            console.log(response);
            if (response.status.code == '200') {
                alert('Deleted successfully!');
                getLocations();
            } else if (response.status.code == '405') {
                alert('Sorry, unable to delete. Location has dependencies!')
            } else {
                alert('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while deleting location" + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

// Searching functions
const searchPersonnel = (wordToSearch) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/searchByEmployee.php',
        data: { txt: wordToSearch },
        dataType: 'json',
        success: (response) => {
            console.log(response);
            if (response.status.code == '200') {
                populateEmployees(response.data.found);

            } else {
                alert('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while searching for employee" + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const searchDepartment = (wordToSearch) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/searchByDepartment.php',
        data: { txt: wordToSearch },
        dataType: 'json',
        success: (response) => {
            //console.log(response);
            if (response.status.code == '200') {
                populateDepartments(response.data.found);

            } else {
                alert('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while searching for department" + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const searchLocation = (wordToSearch) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/searchByLocation.php',
        data: { txt: wordToSearch },
        dataType: 'json',
        success: (response) => {
            //console.log(response);
            if (response.status.code == '200') {
                populateLocation(response.data.found);

            } else {
                alert('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occured while searching for location" + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};


$(document).ready(() => {
    getEmployees();
    getDepartments();
    getLocations();
    searchTabToggle();

    window.addEventListener("load", function() {
        var preloader = document.getElementById("preloader");
        setTimeout(function() {
          preloader.style.display = "none";
        }, 500);
    });

    $(".nav-link").click(() => {
        searchTabToggle();
    });

    $('#myTab button').on('shown.bs.tab', function (event) {
        clearSearchBar();
    });
    
    document.getElementById('addEmployee').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior

        var addEmployeeModal = new bootstrap.Modal(document.getElementById('addPersonnelModal'));
        addEmployeeModal.show();
    });

    document.getElementById('addDepartment').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior

        var addDepartmentModal = new bootstrap.Modal(document.getElementById('addDepartmentModal'));
        addDepartmentModal.show();
    });

    document.getElementById('addLocation').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior

        var addLocationModal = new bootstrap.Modal(document.getElementById('addLocationModal'));
        addLocationModal.show();
    });

    //EMPLOYEE FUNCTION CALLS.............................................................................

    $("#editPersonnelModal").on("show.bs.modal", (e) => {
        let employeeId = $(e.relatedTarget).attr("data-id");
        getEmployeeDetailsById(employeeId);
    });

    document.getElementById('addPersonnelForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
       
        const firstName = $("#addPersonnelFirstName").val();
        const lastName = $("#addPersonnelLastName").val();
        const jobTitle = $("#addPersonnelJobTitle").val();
        const email = $("#addPersonnelEmailAddress").val();
        const departmentID = $("#addPersonnelDepartment").val();

        createNewEmployee(firstName, lastName, jobTitle, email, departmentID);
        $('#addPersonnelModal').modal('hide'); 
    });

    // $("#addPersonnelModel").on("hidden.bs.modal", () => {
    //     $("#addPersonnelForm")[0].reset();
    // });

    document.getElementById('editPersonnelForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
       
         const firstName = $("#editPersonnelFirstName").val();
         const lastName = $("#editPersonnelLastName").val();
         const jobTitle = $("#editPersonnelJobTitle").val();
         const email = $("#editPersonnelEmailAddress").val();
         const departmentID = $("#editPersonnelDepartment").val();
         const personnelID = $("#editPersonnelEmployeeID").val();

        updateNewEmployee(firstName, lastName, jobTitle, email, departmentID, personnelID);

        $('#editPersonnelModal').modal('hide'); 
    });

    $("#deleteEmployeeModal").on("show.bs.modal", (e) => {
        let employeeId = $(e.relatedTarget).attr("data-id");
        let employeeName = $(e.relatedTarget).attr("data-name");

        $('#employeeNameFordeletion').text(employeeName);

        $('#deleteEmployeeBtn').off('click').on('click', function() {
            deleteEmployee(employeeId);

            $('#deleteEmployeeModal').modal('hide'); 
        });

    });

    //DEPARTMENT FUNCTION CALLS.............................................................................

    $("#editDepartmentModal").on("show.bs.modal", (e) => {
        let employeeId = $(e.relatedTarget).attr("data-id");
        getDepartmentById(employeeId);
    });

    document.getElementById('addDepartmentForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default link behavior
       
        const deptName = $("#addDepartmentName").val();
        const locationID = $("#addLocationList").val();

        createNewDepartment(deptName, locationID);

        $('#addDepartmentModal').modal('hide'); 

    });

    document.getElementById('editDepartmentForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default link behavior
       
        const deptName = $("#editDepartmentName").val();
        const locationID = $("#editLocation").val();
        const departmentID = $('#editDepartmentID').val();

        updateNewDepartment(deptName, locationID, departmentID);

        $('#editDepartmentModal').modal('hide'); 
    });

    $("#deleteDepartmentModal").on("show.bs.modal", (e) => {
        let employeeId = $(e.relatedTarget).attr("data-id");
        let employeeName = $(e.relatedTarget).attr("data-name");
        console.log(employeeId, employeeName);

        $('#departmentNameFordeletion').text(employeeName);

        $('#deleteDepartmentBtnn').off('click').on('click', function() {
            
            deleteDepartment(employeeId);

            $('#deleteDepartmentModal').modal('hide'); 
        });

    });
   
    //LOCATION FUNCTION CALLS.............................................................................

   $("#editLocationModal").on("show.bs.modal", (e) => {
        let employeeId = $(e.relatedTarget).attr("data-id");
        getLocationById(employeeId);
    });

    document.getElementById('addLocationForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
       
        const locName = $("#addLocationName").val();

        createNewLocation(locName);
        $('#addLocationModal').modal('hide'); 
    });

    document.getElementById('editLocationForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default link behavior
       
        const locationName = $("#editLocationName").val();
        const locationID = $("#editLocationID").val();

        updateNewLocation(locationName, locationID);

        $('#editLocationModal').modal('hide'); 
    });

    $("#deleteLocationModal").on("show.bs.modal", (e) => {
        let locationId = $(e.relatedTarget).attr("data-id");
        let locationName = $(e.relatedTarget).attr("data-name");
        console.log(locationId, locationName);

        $('#locationNameFordeletion').text(locationName);

        $('#deleteLocationBtnn').off('click').on('click', function() {
            
            deleteLocation(locationId);

            $('#deleteLocationModal').modal('hide'); 
        });

    });

    //Call to searching functions
    $('#searchInpEmp').on('input', function() {
        let wordToSearch = $(this).val();
        //console.log(wordToSearch);

        if (wordToSearch !== '') {
            searchPersonnel(wordToSearch);
        } else {
            getEmployees();
        }
    });

    $('#searchInpDept').on('input', function() {
        let wordToSearch = $(this).val();
        //console.log(wordToSearch);

        if (wordToSearch !== '') {
            searchDepartment(wordToSearch);
        } else {
            getDepartments();
        }
    });

    $('#searchInpLoc').on('input', function() {
        let wordToSearch = $(this).val();
        //console.log(wordToSearch);

        if (wordToSearch !== '') {
            searchLocation(wordToSearch);
        } else {
            getLocations();
        }
    });
});