const chalk = require('chalk');
const figlet = require('figlet');
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
});