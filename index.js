const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const departmentArray =[];
const roleArray =[];
const employeeArray = ['None'];

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
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
            const sql = `SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.department_name AS Department, roles.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager 
                        FROM employees 
                        JOIN roles ON employees.role_id = roles.id 
                        JOIN departments ON roles.department_id = departments.id 
                        LEFT JOIN employees manager ON employees.manager_id = manager.id
                        ORDER BY employees.id`;
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
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'fname',
                    message: `What is the employee's first name?`,
                    validate: (answer) => {
                        const pass = answer.match(/[a-zA-Z][^0-9]/);
                        if(answer !== '' && pass){
                            return true
                        }
                        return "Do not use numbers when adding a new employee."
                    }
                },
                {
                    type: 'input',
                    name: 'lname',
                    message: `What is the employee's last name?`,
                    validate: (answer) => {
                        const pass = answer.match(/[a-zA-Z][^0-9]/);
                        if(answer !== '' && pass){
                            return true
                        }
                        return "Do not use numbers when adding a new employee."
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is their role?',
                    choices: roleArray
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is their manager?',
                    choices: employeeArray
                }
            ])
            .then((answers) => {
                let name = `${answers.fname} ${answers.lname}`
                employeeArray.push(name);

                let role = parseInt(roleArray.indexOf(answers.role)) + parseInt(1);

                managerID = () => {
                    if (answers.manager !== 'None'){
                        return parseInt(employeeArray.indexOf(answers.manager));
                    } 
                    return null;
                }

                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`;
                const params = [answers.fname, answers.lname, role, managerID()];
                db.query(sql, params, (err, data) => {
                    if(err){
                        console.error(err);
                        return;
                    }
                    console.log(`Employee added\n`);
                    options();
                })
            })
        }

        function updateEmployee() {

        }

        function viewAllDepartments() {
            const sql = `SELECT id, department_name AS Department 
                        FROM departments
                        ORDER BY departments.id`
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
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'department_name',
                    message: 'What is name of the department?',
                    validate: (answer) => {
                        const pass = answer.match(/[a-zA-Z][^0-9]/);
                        if(answer !== '' && pass){
                            return true
                        }
                        return "Do not use numbers when adding a new department."
                    }
                }
            ])
            .then((answers) => {
                departmentArray.push(answers.department_name);

                let sql = `INSERT INTO departments (department_name)
                          VALUES (?)`;
                db.query(sql, answers.department_name, (err, rows) => {
                    if(err){
                        console.error(err);
                        return;
                    }
                    console.log(`\nDepartment Added`);                   
                    options();
                })
            })
        }

        function viewAllRoles() {
            const sql = `SELECT roles.id, title AS Title, departments.department_name AS Department, salary AS Salary
                        FROM roles
                        JOIN departments ON roles.department_id = departments.id
                        ORDER BY roles.id`;
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

        function addRole() {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is name of the new role?',
                    validate: (answer) => {
                        const pass = answer.match(/[a-zA-Z][^0-9]/);
                        if(answer !== '' && pass){
                            return true
                        }
                        return "Do not use numbers when adding a new role."
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for this role?',
                    validate: (answer) => {
                        const fail = answer.match(/[^0-9]/);
                        if(answer !== '' && !fail){
                            return true
                        }
                        return "Please enter only digits."
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'To what department does this role belong?',
                    choices: departmentArray
                }
            ])
            .then((answers) => {
                roleArray.push(answers.title);

                let department = parseInt(departmentArray.indexOf(answers.department)) + parseInt(1);
                const sql = `INSERT INTO roles (title, salary, department_id)
                            VALUES (?, ?, ?)`;
                const params = [answers.title, answers.salary, department];
                db.query(sql, params, (err, data) => {
                    if(err){
                        console.error(err);
                        return;
                    }
                    console.log(`Role added\n`);
                    options();
                })
            })
        }

        function quit() {

        }

    }   
    
    function generateDepartmentArray() {
        const sql = `SELECT department_name FROM departments ORDER BY id`
        db.query(sql, (err, data) => {
            if(err){
                console.error(err);
                return;
            }
            let values = data.map(obj => obj.department_name);
            values.map(obj => departmentArray.push(obj));
        })
    }

    function generateRoleArray() {
        const sql = `SELECT title FROM roles ORDER BY id`
        db.query(sql, (err, data) => {
            if(err){
                console.error(err);
                return;
            }
            let values = data.map(obj => obj.title);
            values.map(obj => roleArray.push(obj));
        })
    }

    function generateEmployeeArray() {
        const sql = `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employees ORDER BY id`
        db.query(sql, (err, data) => {
            if(err){
                console.error(err);
                return;
            }
            let values = data.map(obj => obj.name);
            values.map(obj => employeeArray.push(obj));
        })
    }
    
    generateEmployeeArray();
    generateRoleArray();
    generateDepartmentArray();
    options();
};

module.exports = init();