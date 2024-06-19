let departmentList = [];
let locationList = [];

window.addEventListener("load", function() {
    let preloader = document.getElementById("preloader");
    setTimeout(function() {
      preloader.style.display = "none";
    }, 500);
});

const getEmployees = () => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getAll.php',
        success: (response) => {
            if (response.status.code == '200') {
                populateEmployees(response.data);
            } 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Error occurred while fetching employee info: " + textStatus);
        }
    });
};

const populateEmployees = (data) => {

    let frag = document.createDocumentFragment();
    let personnelTableBody = document.getElementById("personnelTableBody");
    personnelTableBody.innerHTML = '';

    data.forEach(function(employee) {
        let row = document.createElement("tr");

        let nameCell = document.createElement("td");
        nameCell.classList = "employeeNameList";
        let nameText = document.createTextNode(`${employee.lastName}, ${employee.firstName}`);
        nameCell.append(nameText);
        row.append(nameCell);

        let deptCell = document.createElement("td");
        deptCell.classList = "employeeDeptList1";
        let deptText = document.createTextNode(employee.departmentName);
        deptCell.append(deptText);
        row.append(deptCell);

        let locCell = document.createElement("td");
        locCell.classList = "employeeLocList1";
        let locText = document.createTextNode(employee.locationName);
        locCell.append(locText);
        row.append(locCell);

        let emailCell = document.createElement("td");
        emailCell.classList = "employeeEmailList";
        let emailText = document.createTextNode(employee.email);
        emailCell.append(emailText);
        row.append(emailCell);

        let actionCell = document.createElement("td");
        actionCell.classList = "text-end";
        let actionDiv = document.createElement("div");
        actionDiv.classList = "d-flex justify-content-end gap-2";

        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList = "btn btn-primary btn-sm";
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editPersonnelModal");
        editButton.setAttribute("data-id", employee.id);
        let editIcon = document.createElement("i");
        editIcon.classList = "fa-solid fa-pencil fa-fw";
        editButton.append(editIcon);

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList = "btn btn-primary btn-sm";
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deleteEmployeeModal");
        deleteButton.setAttribute("data-id", employee.id);
        deleteButton.setAttribute("data-name", `${employee.lastName}, ${employee.firstName}`);
        let deleteIcon = document.createElement("i");
        deleteIcon.classList = "fa-solid fa-trash fa-fw";
        deleteButton.append(deleteIcon);

        actionDiv.append(editButton);
        actionDiv.append(deleteButton);
        actionCell.append(actionDiv);
        row.append(actionCell);

        frag.append(row);
    });

    personnelTableBody.appendChild(frag);
};

const getDepartments = () => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getDeptLocList.php',
        success: (response) => {
            if (response.status.code == '200') {

                departmentList = response.data;
                populateDepartments(response.data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Error occurred while fetching departments: " + textStatus);
        }
    });
};

const populateDepartments = (data) => {
    let frag = document.createDocumentFragment();
    let departmentTableBody = document.getElementById("departmentTableBody");
    departmentTableBody.innerHTML = '';

    data.forEach(function(department) {
        let row = document.createElement("tr");

        let deptCell = document.createElement("td");
        deptCell.classList = "employeeDeptList";
        let deptText = document.createTextNode(department.departmentName);
        deptCell.append(deptText);
        row.append(deptCell);

        let locCell = document.createElement("td");
        locCell.classList = "employeeLocList";
        let locText = document.createTextNode(department.locationName);
        locCell.append(locText);
        row.append(locCell);

        let actionCell = document.createElement("td");
        actionCell.classList = "text-end";
        let actionDiv = document.createElement("div");
        actionDiv.classList = "d-flex justify-content-end gap-2";

        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList = "btn btn-primary btn-sm";
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editDepartmentModal");
        editButton.setAttribute("data-id", department.id);
        let editIcon = document.createElement("i");
        editIcon.classList = "fa-solid fa-pencil fa-fw";
        editButton.append(editIcon);

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList = "btn btn-primary btn-sm dep-del-btn";
        deleteButton.setAttribute("data-id", department.id);
        deleteButton.setAttribute("data-name", department.departmentName);
        let deleteIcon = document.createElement("i");
        deleteIcon.classList = "fa-solid fa-trash fa-fw";
        deleteButton.append(deleteIcon);

        actionDiv.append(editButton);
        actionDiv.append(deleteButton);
        actionCell.append(actionDiv);
        row.append(actionCell);

        frag.append(row);
    });

    departmentTableBody.appendChild(frag);
};

const getLocations = () => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getLocation.php',
        success: (response) => {
            if (response.status.code == '200') {

                locationList = response.data;
                populateLocation(response.data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Error occurred while fetching locations: " + textStatus);
        }
    });
};

const populateLocation = (data) => {
    let frag = document.createDocumentFragment();
    let locationTableBody = document.getElementById("locationTableBody");
    locationTableBody.innerHTML = '';

    data.forEach(function(location) {
        let row = document.createElement("tr");

        let locCell = document.createElement("td");
        locCell.classList = "employeeLocList";
        let locText = document.createTextNode(location.locationName);
        locCell.append(locText);
        row.append(locCell);

        let actionCell = document.createElement("td");
        actionCell.classList = "text-end";
        let actionDiv = document.createElement("div");
        actionDiv.classList = "d-flex justify-content-end gap-2";

        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList = "btn btn-primary btn-sm";
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editLocationModal");
        editButton.setAttribute("data-id", location.id);
        let editIcon = document.createElement("i");
        editIcon.classList = "fa-solid fa-pencil fa-fw";
        editButton.append(editIcon);

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList = "btn btn-primary btn-sm loc-del-btn";
        deleteButton.setAttribute("data-id", location.id);
        deleteButton.setAttribute("data-name", location.locationName);
        let deleteIcon = document.createElement("i");
        deleteIcon.classList = "fa-solid fa-trash fa-fw";
        deleteButton.append(deleteIcon);

        actionDiv.append(editButton);
        actionDiv.append(deleteButton);
        actionCell.append(actionDiv);
        row.append(actionCell);

        frag.append(row);
    });

    locationTableBody.appendChild(frag);
};

//Create,update and deletion for employee 
const getEmployeeDetailsById = (id) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/getPersonnelById.php',
        data: { id },
        success: (response) => {
            if (response.status.code == '200') {
                $('#editPersonnelEmployeeID').val(response.data.personnel[0].id);
                $('#editPersonnelFirstName').val(response.data.personnel[0].firstName);
                $('#editPersonnelLastName').val(response.data.personnel[0].lastName);
                $('#editPersonnelJobTitle').val(response.data.personnel[0].jobTitle);
                $('#editPersonnelEmailAddress').val(response.data.personnel[0].email);
                $('#editPersonnelDepartment').val(response.data.personnel[0].departmentID);
            } 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to fetch the employee Details: " + textStatus);
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
                getEmployees();
            } else {
                showErrorModal('Error: ' + response.status.description);
            }
            $('#addPersonnelForm').trigger('reset');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to add new employee " + textStatus);
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
                getEmployees();
            } else {
                showErrorModal('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to update employee " + textStatus);
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
                getEmployees();
            } else {
                showErrorModal('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to delete employee details" + textStatus);
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
                $('#editDepartmentName').val(response.data[0].name);
                $('#editLocation').val(response.data[0].locationID);
                $('#editDepartmentID').val(response.data[0].id);
            } else {
                showErrorModal('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to fetch department details:" + textStatus);
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
                getDepartments();
            } else if (response.status.code == '409') {
                showErrorModal('Department already exist!')
            } else if (response.status.code == '405') {
                showErrorModal('Duplicate Entry!')
            } else {
                showErrorModal('Error: ' + response.status.description);
            }
            $('#addDepartmentForm').trigger('reset');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to add new department:" + textStatus);
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
                getDepartments();
            } else {
                showErrorModal('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to update department " + textStatus);
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
                getDepartments();
            } else {
                showErrorModal('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to delete employee details" + textStatus);
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

                $('#editLocationName').val(response.data[0].name);
                $('#editLocationID').val(response.data[0].id);

            } else {
                showErrorModal('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to fetch location details: " +textStatus);
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
                getLocations();
            } else if (response.status.code == '409') {
                showErrorModal('Duplicate Entry!')
            } else {
                showErrorModal('Error: ' + response.status.description);
            }
            $('#addLocationForm').trigger('reset');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to add new location: " + textStatus);
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
            if (response.status.code == '200') {
                getLocations();
            } else {
                showErrorModal('Error: ' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to update location: " + textStatus);
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
            if (response.status.code == '200') {
                getLocations();
            } else {
                showErrorModal('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to delete location" + textStatus);
        }
    });
};

// Searching functions
const searchPersonnel = (wordToSearch) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/searchAll.php',
        data: { txt: wordToSearch },
        dataType: 'json',
        success: (response) => {
            if (response.status.code == '200') {
                populateEmployees(response.data.found);

            } else {
                showErrorModal('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to search employee" + textStatus);
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

            if (response.status.code == '200') {
                populateDepartments(response.data.found);

            } else {
                showErrorModal('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to search department" + textStatus);
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
            if (response.status.code == '200') {
                populateLocation(response.data.found);

            } else {
                showErrorModal('Error:' + response.status.description);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Unable to search location" + textStatus);
        }
    });
};

//Checking Dependency 
const getDepartmentDepencies = (id, departmentName) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/departmentDependencies.php',
        data: { id },
        dataType: 'json',
        success: (response) => {
            if (response.status.code=='200') {
                if (response.data.length > 0) {
                    $('#cantDeleteDeptName').html(response.data[0].departmentName);
                    $('#personnelCount').html(response.data[0].employeeCount);
                    $('#cantDeleteDepartmentModal').modal('show');

                } else {

                    $('#areYouSureDeptName').html(departmentName);
                    $('#confirmDeleteDepartmentID').val(id);
                    $('#areYouSureDeleteDepartmentModal').modal('show');
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Error occured while retrieving department dependencies!" + textStatus);
        }
    });
};

const getlocationDepencies = (id, locationName) => {
    $.ajax({
        type: 'POST',
        url: './libs/php/locationDependencies.php',
        data: { id },
        dataType: 'json',
        success: (response) => {
            if (response.status.code=='200') {
                if (response.data.length > 0) {
                    $('#cantDeleteLocName').html(response.data[0].locationName);
                    $('#personnelCountLoc').html(response.data[0].employeeCount);
                    $('#cantDeleteLocationModal').modal('show');

                } else {

                    $('#areYouSureLocName').html(locationName);
                    $('#confirmDeleteLocationID').val(id);
                    $('#areYouSureDeleteLocationModal').modal('show');
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal("Error occured while retrieving location dependencies!" + textStatus);
        }
    });
};

//Filtering Employees
function filterEmployees(departmentId, locationId) {
    $.ajax({
        type: 'POST',
        url: './libs/php/getFilteredEmployees.php',
        data: {
            departmentId: departmentId,
            locationId: locationId
        },
        success: function(response) {
            if (response.status.code === '200') {
                populateEmployees(response.data);
            } else {
                showErrorModal('Failed to fetch employees.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showErrorModal('Error fetching employees: ' + textStatus);
        }
    });
};

//Error handling
const showErrorModal = (message) => {
    $('#errorModalMessage').text(message);
    $('#errorModal').modal('show');
};

$(document).ready(() => {
    getEmployees();
    getDepartments();
    getLocations();

    // Displaying Edit Modals
    $("#editPersonnelModal").on("show.bs.modal", (e) => {
        const employeeId = $(e.relatedTarget).attr("data-id");
        getEmployeeDetailsById(employeeId);

        const $deptSelect = $('#editPersonnelDepartment');
        $deptSelect.empty();

        departmentList.forEach(department => {
            const $option = $('<option>').val(department.id).text(department.departmentName);
            $deptSelect.append($option);
        });
    });

    $("#editDepartmentModal").on("show.bs.modal", (e) => {
        const employeeId = $(e.relatedTarget).attr("data-id");
        getDepartmentById(employeeId);

        const $locSelect = $('#editLocation');
        $locSelect.empty();

        locationList.forEach(location => {
            const $option = $('<option>').val(location.id).text(location.locationName);
            $locSelect.append($option);
        });
    });

    $("#editLocationModal").on("show.bs.modal", (e) => {
        const employeeId = $(e.relatedTarget).attr("data-id");
        getLocationById(employeeId);
    });


    //Displaying modals for ADD button
    $('#addBtn').on('click', (e) => {
        e.preventDefault();
            if ($('#personnelBtn').hasClass('active')) {
                $('#addPersonnelModal').modal('show');
                
            } else if ($('#departmentsBtn').hasClass('active')) {
                $('#addDepartmentModal').modal('show');
                    
            } else {
                $('#addLocationModal').modal('show');
            }    
    });

    $('#addPersonnelModal').on('show.bs.modal', (e) => {
        const $deptSelect = $('#addPersonnelDepartment');
        $deptSelect.empty();

        departmentList.forEach(department => {
            const $option = $('<option>').val(department.id).text(department.departmentName);
            $deptSelect.append($option);
        });
    });

    $('#addDepartmentModal').on('show.bs.modal', (e) => {
        const $locSelect = $('#addLocationList');
        $locSelect.empty();

        locationList.forEach(location => {
            const $option = $('<option>').val(location.id).text(location.locationName);
            $locSelect.append($option);
        });
    });

    //Search Function
    $('#searchInp').on('input', function() {
        
        if ($('#personnelBtn').hasClass('active')) {
            searchPersonnel($(this).val());
        
        } else if ($('#departmentsBtn').hasClass('active')) {
            searchDepartment($(this).val());

        } else {
            searchLocation($(this).val());
        }
    });

    $('[data-bs-toggle="tab"]').on('shown.bs.tab', function() {
        $('#searchInp').val(''); 
    });

    //Refresh Function
    $('#refreshBtn').on('click', function() {
        if ($('#personnelBtn').hasClass('active')) {
            getEmployees();
        } else if ($('#departmentsBtn').hasClass('active')) {
            getDepartments();   
                
        } else {
            getLocations();
        }
        $('#searchInp').val('');
    });

    //Filter Functions
    $("#personnelBtn").click(function () {
  
        $("#filterBtn").attr("disabled", false);        
        getEmployees();
    });

    $("#departmentsBtn").click(function () {
  
        $("#filterBtn").attr("disabled", true);
        getDepartments();        
    });

    $("#locationsBtn").click(function () {
  
        $("#filterBtn").attr("disabled", true);
        getLocations();        
    });
    
    $('#filterPersonnelModal').on('show.bs.modal', (e) => {
        const $locSelect = $('#filterPersonnelByLocation');
        $locSelect.empty();

        const $defaultOptionLoc = $('<option>').val('').text('All');
        $locSelect.append($defaultOptionLoc);

        locationList.forEach(location => {
            const $option = $('<option>').val(location.id).text(location.locationName);
            $locSelect.append($option);
        });

        const $deptSelect = $('#filterPersonnelByDepartment');
        $deptSelect.empty();

        const $defaultOptionDept = $('<option>').val('').text('All');
        $deptSelect.append($defaultOptionDept); 
               
        departmentList.forEach(department => {
            const $option = $('<option>').val(department.id).text(department.departmentName);
            $deptSelect.append($option);
        });
    });

    //Inserting Functions
    $('#addPersonnelForm').on('submit', function(e) {
        e.preventDefault(); 

        const firstName = $("#addPersonnelFirstName").val();
        const lastName = $("#addPersonnelLastName").val();
        const jobTitle = $("#addPersonnelJobTitle").val();
        const email = $("#addPersonnelEmailAddress").val();
        const departmentID = $("#addPersonnelDepartment").val();

        createNewEmployee(firstName, lastName, jobTitle, email, departmentID);
        $('#addPersonnelModal').modal('hide'); 
    });

    $('#addDepartmentForm').on('submit', function(e) {
        e.preventDefault();

        const deptName = $("#addDepartmentName").val();
        const locationID = $("#addLocationList").val();

        createNewDepartment(deptName, locationID);

        $('#addDepartmentModal').modal('hide');
    });

    $('#addLocationForm').on('submit', function(e) {
        e.preventDefault();

        const locName = $("#addLocationName").val();

        createNewLocation(locName);
        $('#addLocationModal').modal('hide');
    });

    //Updating Functions
    $('#editPersonnelForm').on('submit', function(e) {
        e.preventDefault();

        const firstName = $("#editPersonnelFirstName").val();
        const lastName = $("#editPersonnelLastName").val();
        const jobTitle = $("#editPersonnelJobTitle").val();
        const email = $("#editPersonnelEmailAddress").val();
        const departmentID = $("#editPersonnelDepartment").val();
        const personnelID = $("#editPersonnelEmployeeID").val();

        updateNewEmployee(firstName, lastName, jobTitle, email, departmentID, personnelID);
        $('#editPersonnelModal').modal('hide'); 
    });

    $('#editDepartmentForm').on('submit', function(e) {
        e.preventDefault();

        const deptName = $("#editDepartmentName").val();
        const locationID = $("#editLocation").val();
        const departmentID = $('#editDepartmentID').val();

        updateNewDepartment(deptName, locationID, departmentID);

        $('#editDepartmentModal').modal('hide'); 
    });

    $('#editLocationForm').on('submit', function(e) {
        e.preventDefault();

        const locationName = $("#editLocationName").val();
        const locationID = $("#editLocationID").val();

        updateNewLocation(locationName, locationID);

        $('#editLocationModal').modal('hide');  
    });

    //Deleting Functions
    $("#deleteEmployeeModal").on("show.bs.modal", (e) => {

        const employeeId = $(e.relatedTarget).attr("data-id");
        const employeeName = $(e.relatedTarget).attr("data-name");

        $('#employeePersonnelName').text(employeeName);

        $('#deletePersonnelForm').on('submit', function(e) {
            e.preventDefault();
            deleteEmployee(employeeId);

            $('#deleteEmployeeModal').modal('hide'); 
        });

    });

    //--------------------------------------------------------
    $(document).on('click', '.dep-del-btn', function(e) {
        e.preventDefault();

        const departmentID = $(this).attr("data-id");
        const departmentName = $(this).attr("data-name")
        
        getDepartmentDepencies(departmentID, departmentName);


    });

    $('#deleteDepConfirmationForm').on('submit', function(e) {
        e.preventDefault();
        const departmentID = $('#confirmDeleteDepartmentID').val();

        deleteDepartment(departmentID);

        $('#areYouSureDeleteDepartmentModal').modal('hide');

    });
    //----------------------------------------------------------
    $(document).on('click', '.loc-del-btn', function(e) {
        e.preventDefault();

        const locationID = $(this).attr("data-id");
        const locationName = $(this).attr("data-name")
        
        getlocationDepencies(locationID, locationName);

    });

    $('#deleteLocConfirmationForm').on('submit', function(e) {
        e.preventDefault();
        const locationID = $('#confirmDeleteLocationID').val();

        deleteLocation(locationID);

        $('#areYouSureDeleteLocationModal').modal('hide');

    });

    //Filter Functions
    $('#filterPersonnelByDepartment').on('change', function() {
        $('#filterPersonnelByLocation').val(''); 
        const departmentId = $(this).val();
        filterEmployees(departmentId, null);
    });

    $('#filterPersonnelByLocation').on('change', function() {
        $('#filterPersonnelByDepartment').val(''); 
        const locationId = $(this).val();
        filterEmployees(null, locationId);
    });
});