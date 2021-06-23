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
        choices: ['View all employees', 'View departments', 'View roles', 'Add a department','Add a role','Add an employee', 'Update employee role', 'Delete employee', 'Exit']
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
                viewDepartments()
                break;
            case "View roles":
                viewRoles()
                break;ß
            case "Add a department":
                addDepartment()
                break;
            case "Add a role":
                addRole()
                break;
            case "Add an employee":
                addEmployee()
                break;
            case "Update employee role":
                updateEmployeeRole()
                break;
            case "Delete employee":
                deleteEmployee()
                break;
            case "Exit":
                connection.end()
                break;
            default:
                console.log("Error")

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
            firstQuestion();
        }
    });
    
}

const viewDepartments = () => {
    const query =  connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err; 
            console.table(res);
            firstQuestion();
    });
    
}

const viewRoles = () => {
    const query =  connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err; 
            console.table(res);
            firstQuestion();
    });
    
}

function employeeQuestions(roles){

    const employeeQ = [
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'firstname',
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastname',
        },
        {
            type: 'list',
            message: "What is the employee's role?",
            name: 'role',
            choices: roles.map(role => ({name:role.title, value:role.id}))
        }
        ]
        
    return employeeQ
} 
function addEmManager (managers) {
    const managerChoices= managers.map(manager => ({name:manager.full_name, value:manager.id}))
    const managerChoice=[...managerChoices,{name:'None',value:null}]

        const emManager = [{
            type: 'list',
            message: "Who is the employee's manager?",
            name: 'empManager',
            choices: managerChoice
        }]
        return emManager
}
        
const addEmployee = () => {

    connection.query('SELECT * FROM employeeDB.roles', (err,roles) => {
        const employeeQ = employeeQuestions(roles)

            inquirer. prompt(employeeQ)
            .then((answers)=> {
                let emQAnswers = answers

                connection.query ('SELECT employee.id, concat(employee.first_name, " " ,  employee.last_name) AS full_name FROM employee', (err, managers) => {
                let emManager = addEmManager(managers)
                inquirer.prompt(emManager)
                .then((answers) => {connection.query ('INSERT INTO employee SET ?', 
                {
                    first_name: emQAnswers.firstname,
                    last_name: emQAnswers.lastname,
                    roles_id: emQAnswers.role,
                    manager_id: answers.empManager
                },
                (err, res) => {
                    if (err) throw err;
                    console.log("Employee added!");
                    firstQuestion()
            })   
            })
        })
    } 
)}
)}

function roleQuestions(departments) {

    const roleDepartments = [
        {
            type: 'input',
            message: "What is the name of the role you would like to add?",
            name: 'rolename',
        },
        {
            type: 'input',
            message: "What is the salary of this role?",
            name: 'rolesalary',
        },
    {
        type: 'list',
        message: "What department does this role fall under?",
        name: 'roledepart',
        choices: departments.map(department => ({name:department.department_name, value:department.id}))
    }]
    return roleDepartments
}

const addRole = () => {
    connection.query('SELECT * FROM employeeDB.department', (err,departments) => {
        let roleDepartments = roleQuestions(departments)
        inquirer.prompt(roleDepartments)
        .then((answers)=>{
            connection.query ('INSERT INTO roles SET ?', 
        {
            title: answers.rolename,
            salary: answers.rolesalary,
            department_id: answers.roledepart
        },
            (err, res) => {
            if (err) throw err;
            console.log("Role added!");
            firstQuestion()
        }) 

})
})
}

const addDepartment = () => {
    connection.query('SELECT * FROM employeeDB.department', (err,res) => {
        inquirer.prompt([
            {
                type: 'input',
                message: "What is the name of the department you would like to add?",
                name: 'departname',
            }
        ])
        .then((answers)=>{
            connection.query ('INSERT INTO department SET ?', 
        {
            department_name: answers.departname
        },
            (err, res) => {
            if (err) throw err;
            console.log("Department added!");
            firstQuestion()
        }) 

})
})

}

function updateEQuestion1 (employees) {
    updateEQ = [
        {
            type: 'list',
            message: "Which employee would you like to update?",
            name: 'employee',
            choices: employees.map(employee => ({name:employee.full_name, value:employee.id}))
        }
    ]
    return updateEQ
}
function updateEQuestion2 (roles) {
    updateEQ2 = [
        {
            type: 'list',
            message: "What is the employee's new role?",
            name: 'newrole',
            choices: roles.map(role => ({name:role.title, value:role.id}))
        }
    ]
    return updateEQ2
}

const updateEmployeeRole = () => {
    connection.query ('SELECT employee.id, concat(employee.first_name, " " ,  employee.last_name) AS full_name FROM employee', (err, employees) => {
    let updateEQ = updateEQuestion1(employees)
        inquirer.prompt(updateEQ)
        .then((answers) => {
            let employeeAns = answers 
            console.log(employeeAns)
            connection.query('SELECT * FROM employeeDB.roles', (err,roles) => {
            let updateEQ2 = updateEQuestion2 (roles)
            inquirer.prompt(updateEQ2)
            .then((answers)=> {
                console.log(answers)
                connection.query('UPDATE employee SET ? WHERE ?', [
                    { roles_id: answers.newrole
                },{
                    id: employeeAns.employee} ],
                (err,res) => {
                    if (err) throw err;
                    console.log('Employee updated!')
                    firstQuestion()
                })

            })
        })
    })
})
}


connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    firstQuestion();
});