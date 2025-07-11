// Employee data
let employees = [{
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        department: 'HR',
        role: 'Manager'
    },
    {
        id: 2,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        department: 'IT',
        role: 'Developer'
    },
    {
        id: 3,
        firstName: 'Charlie',
        lastName: 'Lee',
        email: 'charlie@example.com',
        department: 'Finance',
        role: 'Analyst'
    },
    {
        id: 4,
        firstName: 'David',
        lastName: 'Brown',
        email: 'david@example.com',
        department: 'Engineering',
        role: 'Software Engineer'
    },
    {
        id: 5,
        firstName: 'Eva',
        lastName: 'Garcia',
        email: 'eva@example.com',
        department: 'Marketing',
        role: 'Content Writer'
    },
    {
        id: 6,
        firstName: 'Frank',
        lastName: 'Wilson',
        email: 'frank@example.com',
        department: 'Operations',
        role: 'Coordinator'
    },
    {
        id: 7,
        firstName: 'Grace',
        lastName: 'Taylor',
        email: 'grace@example.com',
        department: 'HR',
        role: 'Recruiter'
    },
    {
        id: 8,
        firstName: 'Henry',
        lastName: 'Martinez',
        email: 'henry@example.com',
        department: 'IT',
        role: 'System Admin'
    },
    {
        id: 9,
        firstName: 'Ivy',
        lastName: 'Anderson',
        email: 'ivy@example.com',
        department: 'Finance',
        role: 'Accountant'
    },
    {
        id: 10,
        firstName: 'Jack',
        lastName: 'Thomas',
        email: 'jack@example.com',
        department: 'Engineering',
        role: 'Software Engineer'
    }
];

// DOM Elements
const employeeGrid = document.getElementById('employee-grid');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const addEmployeeBtn = document.getElementById('add-employee');
const departmentFilter = document.getElementById('department-filter');
const roleFilter = document.getElementById('role-filter');
const sortBy = document.getElementById('sort-by');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const perPage = document.getElementById('per-page');

// Modal elements
const modal = document.getElementById('employee-modal');
const modalTitle = document.getElementById('modal-title');
const employeeForm = document.getElementById('employee-form');
const employeeIdInput = document.getElementById('employee-id');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const roleInput = document.getElementById('role');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const closeBtn = document.querySelector('.close');

// Error elements
const firstNameError = document.getElementById('first-name-error');
const lastNameError = document.getElementById('last-name-error');
const emailError = document.getElementById('email-error');
const departmentError = document.getElementById('department-error');
const roleError = document.getElementById('role-error');

// State variables
let currentPage = 1;
let itemsPerPage = 10;
let filteredEmployees = [...employees];
let searchTerm = '';
let departmentFilterValue = '';
let roleFilterValue = '';
let sortValue = 'firstName-asc';

// Initialize the app
function init() {
    renderEmployees();
    setupEventListeners();
    populateFilters();
}

// Render employees
function renderEmployees() {
    employeeGrid.innerHTML = '';

    // Apply filters, search, and sort
    applyFilters();
    applySearch();
    applySort();

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const employeesToShow = filteredEmployees.slice(startIndex, endIndex);

    if (employeesToShow.length === 0) {
        employeeGrid.innerHTML = '<p class="no-results">No employees found matching your criteria.</p>';
    } else {
        employeesToShow.forEach(employee => {
            const employeeCard = document.createElement('div');
            employeeCard.className = 'employee-card';
            employeeCard.innerHTML = `
                <h3>${employee.firstName} ${employee.lastName}</h3>
                <p><strong>ID:</strong> ${employee.id}</p>
                <p><strong>Email:</strong> ${employee.email}</p>
                <p><strong>Department:</strong> ${employee.department}</p>
                <p><strong>Role:</strong> ${employee.role}</p>
                <div class="employee-actions">
                    <button class="edit-btn" data-id="${employee.id}">Edit</button>
                    <button class="delete-btn" data-id="${employee.id}">Delete</button>
                </div>
            `;
            employeeGrid.appendChild(employeeCard);
        });
    }

    // Update pagination info
    updatePagination();
}

// Setup event listeners
function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Add employee
    addEmployeeBtn.addEventListener('click', openAddModal);

    // Filters
    departmentFilter.addEventListener('change', () => {
        departmentFilterValue = departmentFilter.value;
        currentPage = 1;
        renderEmployees();
    });

    roleFilter.addEventListener('change', () => {
        roleFilterValue = roleFilter.value;
        currentPage = 1;
        renderEmployees();
    });

    // Sort
    sortBy.addEventListener('change', () => {
        sortValue = sortBy.value;
        renderEmployees();
    });

    // Pagination
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderEmployees();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderEmployees();
        }
    });

    perPage.addEventListener('change', () => {
        itemsPerPage = parseInt(perPage.value);
        currentPage = 1;
        renderEmployees();
    });

    // Modal
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    employeeForm.addEventListener('submit', handleFormSubmit);

    // Event delegation for edit/delete buttons
    employeeGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            openEditModal(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            deleteEmployee(id);
        }
    });
}

// Handle search
function handleSearch() {
    searchTerm = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    renderEmployees();
}

// Populate filter dropdowns
function populateFilters() {
    // Departments
    const departments = [...new Set(employees.map(emp => emp.department))];
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentFilter.appendChild(option);
    });

    // Roles
    const roles = [...new Set(employees.map(emp => emp.role))];
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleFilter.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    filteredEmployees = employees.filter(employee => {
        const departmentMatch = !departmentFilterValue ||
            employee.department === departmentFilterValue;
        const roleMatch = !roleFilterValue ||
            employee.role === roleFilterValue;

        return departmentMatch && roleMatch;
    });
}

// Apply search
function applySearch() {
    if (searchTerm) {
        filteredEmployees = filteredEmployees.filter(employee => {
            const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
            return fullName.includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm);
        });
    }
}

// Apply sort
function applySort() {
    const [field, direction] = sortValue.split('-');

    filteredEmployees.sort((a, b) => {
        let compareA, compareB;

        if (field === 'firstName') {
            compareA = a.firstName.toLowerCase();
            compareB = b.firstName.toLowerCase();
        } else {
            compareA = a[field].toLowerCase();
            compareB = b[field].toLowerCase();
        }

        if (compareA < compareB) return direction === 'asc' ? -1 : 1;
        if (compareA > compareB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

// Update pagination info
function updatePagination() {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Open add modal
function openAddModal() {
    modalTitle.textContent = 'Add Employee';
    employeeIdInput.value = '';
    employeeForm.reset();
    clearErrors();
    modal.style.display = 'block';
}

// Open edit modal
function openEditModal(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        modalTitle.textContent = 'Edit Employee';
        employeeIdInput.value = employee.id;
        firstNameInput.value = employee.firstName;
        lastNameInput.value = employee.lastName;
        emailInput.value = employee.email;
        departmentInput.value = employee.department;
        roleInput.value = employee.role;
        clearErrors();
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    const employeeData = {
        id: employeeIdInput.value ? parseInt(employeeIdInput.value) : generateId(),
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value,
        role: roleInput.value.trim()
    };

    if (employeeIdInput.value) {
        // Update existing employee
        employees = employees.map(emp =>
            emp.id === parseInt(employeeIdInput.value) ? employeeData : emp
        );
    } else {
        // Add new employee
        employees.push(employeeData);
    }

    closeModal();
    currentPage = 1;
    renderEmployees();
}

// Validate form
function validateForm() {
    let isValid = true;
    clearErrors();

    // First name validation
    if (!firstNameInput.value.trim()) {
        firstNameError.textContent = 'First name is required';
        isValid = false;
    }

    // Last name validation
    if (!lastNameInput.value.trim()) {
        lastNameError.textContent = 'Last name is required';
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email';
        isValid = false;
    }

    // Department validation
    if (!departmentInput.value) {
        departmentError.textContent = 'Department is required';
        isValid = false;
    }

    // Role validation
    if (!roleInput.value.trim()) {
        roleError.textContent = 'Role is required';
        isValid = false;
    }

    return isValid;
}

// Clear all error messages
function clearErrors() {
    firstNameError.textContent = '';
    lastNameError.textContent = '';
    emailError.textContent = '';
    departmentError.textContent = '';
    roleError.textContent = '';
}

// Generate new ID
function generateId() {
    const maxId = employees.reduce((max, emp) => Math.max(max, emp.id), 0);
    return maxId + 1;
}

// Delete employee
function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);

        // Reset to first page if current page is empty
        const startIndex = (currentPage - 1) * itemsPerPage;
        if (startIndex >= employees.length) {
            currentPage = Math.max(1, currentPage - 1);
        }

        renderEmployees();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);