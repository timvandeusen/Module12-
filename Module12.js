const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'roscoe',
  database: 'mysql',
});

// Connect to the database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      process.exit(1); // Exit the application on connection error
    }
    console.log('Connected to MySQL database');
  });

// Function to view all departments
function viewAllDepartments() {
    connection.query('SELECT * FROM departments', (err, results) => {
      if (err) throw err;
      console.log("\n=== All Departments ===");
      console.table(results); 
      mainMenu();
    });
  }

// Function to view all roles
function viewAllRoles() {
    connection.query('SELECT * FROM roles', (err, results) => {
      if (err) throw err;
      console.log("\n=== All Roles ===");
      console.table(results); 
      mainMenu();
    });
  }

// Function to view all employees
function viewAllEmployees() {
    connection.query('SELECT * FROM employees', (err, results) => {
      if (err) throw err;
      console.log("\n=== All Employees ===");
      console.table(results); 
      mainMenu();
    });
  }

// Function to add a department
function addDepartment() {
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the department:'
  }).then((answers) => {
    connection.query('INSERT INTO departments (name) VALUES (?)', [answers.name], (err) => {
      if (err) throw err;
      console.log(`Department '${answers.name}' added successfully.`);
      mainMenu();
    });
  });
}

// Function to add a role
function addRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the role:'
    },
    {
      type: 'input',
      name: 'departmentId',
      message: 'Enter the department ID for the role:'
    }
  ]).then((answers) => {
    connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
      [answers.title, answers.salary, answers.departmentId], (err) => {
        if (err) throw err;
        console.log(`Role '${answers.title}' added successfully.`);
        mainMenu();
      });
  });
}

// Function to add an employee
function addEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee:'
    },
    {
      type: 'input',
      name: 'roleId',
      message: 'Enter the role ID for the employee:'
    },
    {
      type: 'input',
      name: 'managerId',
      message: 'Enter the manager ID for the employee:'
    }
  ]).then((answers) => {
    connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
      [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err) => {
        if (err) throw err;
        console.log(`Employee '${answers.firstName} ${answers.lastName}' added successfully.`);
        mainMenu();
      });
  });
}

// Function to update an employee role
function updateEmployeeRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employeeId',
      message: 'Enter the ID of the employee to update:'
    },
    {
      type: 'input',
      name: 'newRoleId',
      message: 'Enter the new role ID for the employee:'
    }
  ]).then((answers) => {
    connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [answers.newRoleId, answers.employeeId], (err) => {
      if (err) throw err;
      console.log("Employee role updated successfully.");
      mainMenu();
    });
  });
}

// Main menu
function mainMenu() {
  inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'Select an option:',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  }).then((answers) => {
    switch (answers.choice) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log("Exiting program. Goodbye!");
        connection.end();
        break;
      default:
        console.log("Invalid choice. Please try again.");
        mainMenu();
    }
  });
}

// Start the application
mainMenu();
