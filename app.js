const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = []

const addEmployee = () => {

  inquirer.prompt([
    {
      type: 'list',
      name: 'class',
      message: 'What classification does this employee have?',
      choices: ['Engineer', 'Intern', 'Manager'],
    },
    {
      type: 'input',
      name: 'name',
      message: "What is this employee's name?",
    },
    {
      type: 'number',
      name: 'id',
      message: "What is this employee's id number?",
    },
    {
      type: 'input',
      name: 'email',
      message: "What is this employee's email?",
    }
  ])
    .then(generalInfo => {
      let newEmployee = ''
      let finalQuestion = "What is this employee's "
      switch (generalInfo.class) {
        case 'Engineer':
          finalQuestion += 'Github username?'
          break
        case 'Intern':
          finalQuestion += 'school?'
          break
        case 'Manager':
          finalQuestion += 'office number?'
          break
      }
      inquirer.prompt({
        type: 'input',
        name: 'response',
        message: finalQuestion,
      })
        .then(specificInfo => {
          switch (generalInfo.class) {
            case 'Engineer':
              employees.push(new Engineer(generalInfo.name, generalInfo.id, generalInfo.email, specificInfo.response))
              break
            case 'Intern':
              employees.push(new Intern(generalInfo.name, generalInfo.id, generalInfo.email, specificInfo.response))
              break
            case 'Manager':
              employees.push(new Manager(generalInfo.name, generalInfo.id, generalInfo.email, specificInfo.response))
              break
          }
          inquirer.prompt({
            type: 'confirm',
            name: 'continue',
            message: 'Add another employee?'
          })
            .then(res => {
              if (res.continue) {
                addEmployee()
              } else {
                console.log(employees)
                fs.writeFile(outputPath, render(employees), err => {
                  if (err) { console.log(err) }
                })
              }
            })
            .catch(error => console.log(error))
      })
  })
  .catch (err => console.log(err))
}

addEmployee()

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different Info via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
