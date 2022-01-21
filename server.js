const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const mysqlpromise = require('mysql2/promise'); 
const { connectionProperties, connection } = require('./config/connection');

// establishes connection to db
connection.connect(err => {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log(chalk.blue.bold(`==============================================================================================`));
    console.log(``);
    console.log(chalk.red.bold(figlet.textSync('Hr Employee Cms')));
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
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update employee role",
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

    function addDept() {
        inquirer
            .prompt([
                {
                    name: "deptName",
                    type: "input",
                    message: "What is the name of the new department?",
                }
            ])

            .then(function(response) {
                connection.query("INSERT INTO departments SET ?", {
                        department_name: response.deptName,
                    },
                    function(err) {
                        if (err) throw err;
                        console.log("Your department was created successfully!");
                        mainMenu();
                    }
                );
            });
    };

    function addRole() {
        inquirer 
            .prompt([
                {
                    name: "roleTtile",
                    type: "input",
                    message: "What is the title of the new role?",
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "What is the salary of the new role?",
                },
                {
                    name: "roleDepartment",
                    type: "input",
                    message: "What is the department ID of the new role?",
                }
            ])

            .then(function(response) {
                connection.query("INSERT INTO roles SET ?", {
                        title: response.roleTtile,
                        salary: response.roleSalary,
                        department_id: response.roleDepartment,
                    },
                    function(err) {
                        if (err) throw err;
                        console.log("Your new role was created successfully!");
                        mainMenu();
                    }
                );
            });
    };

    function addEmployee() {
        inquirer
            .prompt([
                {
                    name: "empFirstName",
                    type: "input",
                    message: "What is the first name of the new employee?",
                },
                {
                    name: "empLastName",
                    type: "input",
                    message: "What is the last name of the new employee?",
                },
                {
                    name: "empRole",
                    type: "input",
                    message: "What is the role ID for the new employee?",
                },
                {
                    name: "empManager",
                    type: "input",
                    message: "What is id of the new employee's manager?",
                }
            ])

            .then(function(response) {
                connection.query("INSERT INTO employee SET ?", {
                        first_name: response.empFirstName,
                        last_name: response.empLastName,
                        role_id: response.empRole,
                        manager_id: response.empManager,
                    },
                    function(err) {
                        if (err) throw err;
                        console.log("Your new employee was created successfully!");
                        mainMenu();
                    }
                );
            });
    };

    function updateEmpRole() {

        // create employee and role array
        let employeeArr = [];
        let roleArr = [];
        mysqlpromise.createConnection( connectionProperties )
            .then(conn => {
                return Promise.all([
    
                    // query all roles and employee
                    conn.query('SELECT id, title FROM roles ORDER BY title ASC'),
                    conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
                ]);
            })
            .then(([roles, employees]) => {
                
            // place all roles in array
            for (i=0; i < roles[0].length; i++){
                roleArr.push(roles[0][i].title);
            }

            // place all empoyees in array
            for (i=0; i < employees[0].length; i++){
                employeeArr.push(employees[0][i].Employee);
                //console.log(value[i].name);
            }
            return Promise.all([roles[0], employees[0]]);
             }).then(([roles, employees]) => {

                inquirer.prompt([
                    {
                        // prompt user to select employee
                        name: "employee",
                        type: "list",
                        message: "Who would you like to edit?",
                        choices: employeeArr
                    }, {
                        // Select role to update employee
                        name: "role",
                        type: "list",
                        message: "What is their new role?",
                        choices: roleArr
                    },]).then((answer) => {
    
                    let roleID;
                    let employeeID;
    
                    /// get ID of role selected
                    for (i=0; i < roles.length; i++){
                        if (answer.role == roles[i].title){
                            roleID = roles[i].id;
                        }
                    }
    
                    // get ID of employee selected
                    for (i=0; i < employees.length; i++){
                        if (answer.employee == employees[i].Employee){
                            employeeID = employees[i].id;
                        }
                    }
    
                    // update employee with new role
                    connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                        if(err) return err;
    
                        // confirm update employee
                        console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);
    
                        // back to main menu
                        mainMenu();
                    });
                });
            });
    }
   
    function deleteEmployee() {

        // Create global employee array
        let employeeArr = [];

        connection.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC", function(err, res) {
            // Place all employees in array
            for (i = 0; i < res.length; i++) {
                employeeArr.push(res[i].employee);
            }

            inquirer.prompt([
                {
                    // prompt user of all employees
                    name: "employee",
                    type: "list",
                    message: "Who would you like to delete?",
                    choices: employeeArr
                }, {
                    // confirm delete of employee
                    name: "yesNo",
                    type: "list",
                    message: "Confirm deletion",
                    choices: ["NO", "YES"]
                }]).then((answer) => {

                if (answer.yesNo == "YES") {
                    let employeeID;

                    // if confirmed, get ID of employee selected
                    for (i = 0; i < res.length; i++) {
                        if (answer.employee == res[i].employee) {
                            employeeID = res[i].id;
                        }
                    }

                    // deleted selected employee
                    connection.query(`DELETE FROM employee WHERE id=${employeeID};`, (err, res) => {
                        if (err) return err;

                        // confirm deleted employee
                        console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);

                        // back to main menu
                        mainMenu();
                    });
                }
                else {

                    // if not confirmed, go back to main menu
                    console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

                    // back to main menu
                    mainMenu();
                }

            });
        })
    }

    function deleteRole() {

        // Create role array
        let roleArr = [];

        // query all roles
        connection.query("SELECT roles.id, title FROM roles", function (err, res) {
            // add all roles to array
            for (i = 0; i < res.length; i++) {
                roleArr.push(res[i].title);
            }

            inquirer.prompt([{
                // confirm to continue to select role to delete
                name: "continueDelete",
                type: "list",
                message: "*** WARNING *** Deleting role will delete all employees associated with the role. Do you want to continue?",
                choices: ["NO", "YES"]
            }]).then((answer) => {

                // if not, go to main menu
                if (answer.continueDelete === "NO") {
                    mainMenu();
                }

            }).then(() => {

                inquirer.prompt([{
                    // prompt user of of roles
                    name: "role",
                    type: "list",
                    message: "Which role would you like to delete?",
                    choices: roleArr
                }, {
                    // confirm to delete role by typing role exactly
                    name: "confirmDelete",
                    type: "Input",
                    message: "Type the role title EXACTLY to confirm deletion of the role"

                }]).then((answer) => {

                    if (answer.confirmDelete === answer.role) {

                        // get role id of of selected role
                        let roleID;
                        for (i=0; i < res.length; i++){
                            if (answer.role == res[i].title){
                                roleID = res[i].id;
                            }
                        }

                        // delete role
                        connection.query(`DELETE FROM roles WHERE id=${roleID};`, (err, res) => {
                            if(err) return err;

                            // confirm role has been added
                            console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                            //back to main menu
                            mainMenu();
                        });
                    }
                    else {

                        // if not confirmed, do not delete
                        console.log(`\n ROLE '${answer.role}' NOT DELETED...\n `);

                        //back to main menu
                        mainMenu();
                    }
                });
            })
        });
    }

    function deleteDepartment() {

        // department array
        let deptArr = [];

        connection.query("SELECT id, department_name FROM departments", function (err, depts) {
            // add all departments to array
            for (i=0; i < depts.length; i++){
                deptArr.push(depts[i].department_name);
            }

            inquirer.prompt([{

                // confirm to continue to select department to delete
                name: "continueDelete",
                type: "list",
                message: "*** WARNING *** Deleting a department will delete all roles and employees associated with the department. Do you want to continue?",
                choices: ["NO", "YES"]
            }]).then((answer) => {

                // if not, go back to main menu
                if (answer.continueDelete === "NO") {
                    mainMenu();
                }

            }).then(() => {

                inquirer.prompt([{

                    // prompt user to select department
                    name: "dept",
                    type: "list",
                    message: "Which department would you like to delete?",
                    choices: deptArr
                }, {

                    // confirm with user to delete
                    name: "confirmDelete",
                    type: "Input",
                    message: "Type the department name EXACTLY to confirm deletion of the department: "

                }]).then((answer) => {

                    if (answer.confirmDelete === answer.dept){

                        // if confirmed, get department id
                        let deptID;
                        for (i=0; i < depts.length; i++){
                            if (answer.dept == depts[i].department_name){
                                deptID = depts[i].id;
                            }
                        }

                        // delete department
                        connection.query(`DELETE FROM departments WHERE id=${deptID};`, (err, res) => {
                            if(err) return err;

                            // confirm department has been deleted
                            console.log(`\n DEPARTMENT '${answer.dept}' DELETED...\n `);

                            // back to main menu
                            mainMenu();
                        });
                    }
                    else {

                        // do not delete department if not confirmed and go back to main menu
                        console.log(`\n DEPARTMENT '${answer.dept}' NOT DELETED...\n `);

                        //back to main menu
                        mainMenu();
                    }

                });
            })
        });
    }

    // View Department Budget
    function viewDeptBudget() {
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
        console.log(chalk.yellow.bold(`====================================================================================`));

        const sql =     `SELECT department_id AS id, 
                  departments.department_name AS department,
                  SUM(salary) AS budget
                  FROM  roles 
                  INNER JOIN departments ON roles.department_id = departments.id GROUP BY roles.department_id`;
        connection.query(sql, (error, response) => {
            if (error) throw error;
            console.table(response);
            console.log(chalk.yellow.bold(`====================================================================================`));

            // back to main menu
            mainMenu();
        });
    }

};
