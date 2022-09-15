const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
// const express = require('express');

// const PORT = process.env.PORT || 3001;
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: ' ',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

function init () {
    function options() {
        console.log(`What would you like to do?\n`);
        inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                choices: ['View All Employees', 'Add Employee', 'Update Employee', 'View All Roles',
                          'Add Role', 'View All Departments', 'Add Department', 'Quit']
            }
        ])
        .then((answers) => {
            switch (answers.options) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee':
                    updateEmployee();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    quit();
                    break;
                default:
                    break;
            }
        })

        function viewAllEmployees() {
            const sql = `SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.department_name AS Department, roles.salary AS Salary, employees.manager_id AS Manager FROM employees 
                        JOIN roles ON employees.role_id = roles.id 
                        JOIN departments ON roles.department_id = departments.id 
                        LEFT JOIN employees a ON employees.manager_id = CONCAT_WS(' ', a.first_name, a.last_name)`;
            db.query(sql, (err, rows) => {
                if(err) {
                    console.error(err);
                    return;
                }
                console.log(`\n`);
                console.table(rows);
                options();
            })    
        };

        function addEmployee() {

        }

        function updateEmployee() {

        }

        function viewAllDepartments() {
            const sql = `SELECT id, department_name AS Department FROM departments`
            db.query(sql, (err, rows) => {
                if(err) {
                    console.error(err);
                    return;
                }
                console.log(`\n`);
                console.table(rows);
                options();
            })
        }

        function addDepartment() {

        }

        function viewAllRoles() {

        }

        function addRole() {

        }

        function quit() {

        }
    }
    options();
};

module.exports = init();