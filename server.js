const mysql = require("mysql")
const inquirer = require('inquirer')

const connection = mysql.createConnection({
    host: 'localhost',
  
    port: 3306,
  
    user: 'root',
  
    password: '',
    database: 'employeeDB',
});

const initialQuestion = [
    {
        type: 'list',
        message: 'What would like to do?',
        name: 'initialq',
        choices: ['View all employees', 'View departments', 'View roles', 'Add a department','Add a role','Add an employee','Update employee manager', 'Update employee role','Delete employee', 'Delete role', 'Delete department','I am finished']
    }
]
const firstQuestion = () => {
    inquirer.prompt(initialQuestion)
    .then((answers) => {
        switch(answers.initialq){
            case "View all employees":
                viewAllEmployees()
                break;
            case "View departments":
                viewADepartments()
                break;
            case "View roles":
                viewRoles()
                break;
            case "Add a department":
                addDepartment()
                break;
            case "Add a role":
                addRole()
                break;
            case "Add an employee":
                addEmployee()
                break;
            case "Update employee manager":
                updateEmployeeManager()
                break;
            case "Update employee role":
                updateEmployeeRole()
                break;
            case "Delete employee":
                deleteEmployee()
                break;
            case "Delete role":
                deleteRole()
                break;
            case "Delete department":
                deleteDepartment()
                break;
            case "I am finished":
                endConnection()
                break;
            default:
                console.log("Error.")

        }
    })

}

const viewAllEmployees = () => {
    const query =  connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err; 
        
        if(!res[0]){   
            console.log("You must enter an employee first.")
            firstQuestion();
        } else {
            console.table(res);
        }
    });

   
    
}


connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    firstQuestion();
});