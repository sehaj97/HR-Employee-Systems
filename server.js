const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const { connectionProperties, connection } = require('./config/connection');

// establishes connection to db
connection.connect(err => {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log(chalk.blue.bold(`==============================================================================================`));
    console.log(``);
    console.log(chalk.red.bold(figlet.textSync('Employee Tracker')));
    console.log(``);
    console.log(`                                                                    ` + chalk.yellow.bold('Created By: Sehajpreet Singh'));
    console.log(``);
    console.log(chalk.blue.bold(`==============================================================================================`));

    console.log(chalk.blue.bold(`==============================================================================================`));    mainMenu();
});

function mainMenu() {
    inquirer
        .prompt({
            name: "userAction",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all employees",
                "View all roles",
                "View all employees by manager",
                "View all employees by department",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update employee role",
                "Update employee manager",
                "Delete employee",
                "Delete role",
                "Delete department",
                "View department budgets",
                "Exit"
            ]
        })

        .then(response => {
            switch (response.userAction) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees by manager":
                    viewAllEmpByMngr();
                    break;
                case "View all employees by department":
                    viewAllEmpByDept();
                    break;
                case "Add a department":
                    addDept();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update employee role":
                    updateEmpRole();
                    break;
                case "Update employee manager":
                    updateEmpMngr();
                    break;
                case "Delete employee":
                    deleteEmployee();
                    break;
                case "Delete role":
                    deleteRole();
                    break;
                case "Delete department":
                    deleteDepartment();
                    break;
                case "View department budgets":
                    viewDeptBudget();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });

        

    function viewDepartments() {
        let query = "SELECT * FROM  departments";
        connection.query(query, function(err, res) {
            console.log(chalk.yellow.bold(`====================================================================================`));
            console.log(`                              ` + chalk.green.bold(`All Departments:`));
            console.log(chalk.yellow.bold(`====================================================================================`));

            console.table(res);
            mainMenu();
        });
    };

    function viewEmployees() {
        let query = "SELECT e.id, e.first_name, e.last_name, roles.title, departments.department_name AS department, roles.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ORDER BY id ASC";
        connection.query(query, function(err, res) {
            console.log(chalk.yellow.bold(`====================================================================================`));
            console.log(`                              ` + chalk.green.bold(`Current Employees:`));
            console.log(chalk.yellow.bold(`====================================================================================`));

            console.table(res);
            mainMenu();
        });
    };

    function viewRoles() {
        let query = `SELECT roles.id, roles.title, departments.department_name AS department, roles.salary
                  FROM roles
                  INNER JOIN departments ON roles.department_id = departments.id`;

        connection.query(query, function(err, res) {
            console.log(chalk.yellow.bold(`====================================================================================`));
            console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
            console.log(chalk.yellow.bold(`====================================================================================`));

            console.table(res);
            mainMenu();
        });
    };
    };
