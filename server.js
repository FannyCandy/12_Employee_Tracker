const express = require('express');
const inquirer = require('inquirer')
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password1',
    database: 'employee_db'
  },
  console.log('Connected to the employee_db!.')
);

// view all departments (department names,  department ids)
function viewDepartments() {
  const sql = `SELECT department.id, department.department_name AS department FROM department`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(result);
    init();
  });
};
// view all roles (job title, role id, the department that role belongs to, the salary for that role)
function viewRoles() {
  const sql = `SELECT role.id, role.role_title, role.role_salary, department.department_name  FROM role JOIN department ON department.id = role.department_id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(result);
    init();
  });
};
// view all employees (employee ids, first names, last names, job titles, departments, salaries, managers that the employees report to)
function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.role_title AS title, department.department_name AS department, role.role_salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
  JOIN role ON role.id = employee.role_id
  JOIN department ON department.id = role.department_id
  LEFT JOIN manager ON manager.id = employee.manager_id 
  ORDER BY employee.first_name`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(result);
    init();
  });
};
// add a department (name of the department)
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'what is the name of the department?'
      }
    ]).then((answer) => {
      const sql = `INSERT INTO department SET department_name = ${answer.department}`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('new department add!');
        init();
      });
    });
};
// add a role (name, salary, department for the role)
function addRole() {
  db.query(`SELECT * FROM department`, (err, result) => {
    departments = result.map(department => ({
      name: department.department_name, value: department.id
    }));
  });

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'department',
        message: 'which department this role belongs to?',
        choices: departments
      },
      {
        type: 'input',
        name: 'role',
        message: 'what is the name of the role?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'what is the salary of the role?'
      }
    ]).then((answer) => {
      const sql = `INSERT INTO role SET role_title=${answer.role}, role_salary=${answer.salary}, department_id=${answer.department}`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('new role add!');
        init();
      });
    });
};

// add an employee (first name, last name, role, and manager)
function addEmployee() {
  db.query(`SELECT * FROM role`, (err, result) => {
    roles = result.map(role => ({
      name: role.role_title, value: role.id
    }));
  });

  db.query(`SELECT * FROM employee`, (err, result) => {
    employees = result.map(employee => ({
      name: employee.first_name + employee.last_name, value: employee.id
    }));
  });

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'what is the first name of the employee?'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'what is the last name of the employee?'
      },
      {
        type: 'list',
        name: 'role',
        message: 'what is the role of the employee?',
        choices: roles
      },
      {
        type: 'list',
        name: 'manager',
        message: 'who is the manager of the employee?',
        choices: employees
      }
    ]).then((answer) => {
      const sql = `INSERT INTO employee SET first_name=${answer.firstName}, last_name=${answer.lastName}, role_id=${answer.role}, manager_id=${answer.manager}`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('new employee add!');
        init();
      });
    });
};
// update an employee role (new role)
function updateEmployeeRole() {
  db.query(`SELECT * FROM role`, (err, result) => {
    roles = result.map(role => ({
      name: role.role_title, value: role.id
    }));
  });

  db.query(`SELECT * FROM employee`, (err, result) => {
    employees = result.map(employee => ({
      name: employee.first_name + employee.last_name, value: employee.id
    }));
  });

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'which employee do you want to update role?',
        choices: employees
      },
      {
        type: 'list',
        name: 'role',
        message: 'what is the new role of the employee?',
        choices: roles
      },
      {
        type: 'list',
        name: 'manager',
        message: 'who is the new manager of the employee?',
        choices: employees
      }
    ]).then((answer) => {
      const sql = `INSERT INTO employee SET role_id=${answer.role}, manager_id=${answer.manager} WHERE id=${answer.employee}`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('new role updated!');
        init();
      });
    });
};

function init() {
  inquirer
    .prompt([
      {
        message: 'How can I help you?',
        type: 'list',
        choices: [
          'view all departments',
          'view all roles',
          'view all employees',
          'add a department',
          'add a role',
          'add an employee',
          'update an employee role',
          'exit'
        ]
      }
    ]).then((answer) => {

      switch (answer) {
        case 'view all departments': viewDepartments();
          break;
        case 'view all roles': viewRoles();
          break;
        case 'view all employees': viewEmployees();
          break;
        case 'add a department': addDepartment();
          break;
        case 'add a role': addRole();
          break;
        case 'add an employee': addEmployee();
          break;
        case 'update an employee role': updateEmployeeRole();
          break;
        case 'exit': db.end();
          break;
      }
    });
};

init();

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 