var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require('./dbconfig');

var conn = mysql.createConnection({
    host: keys.host,
    user: keys.user,
    password: keys.password,
    port: keys.port,
    database: 'bamazon_DB',
});

conn.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    // console.log('connected as id ' + conn.threadId);
});

function init() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View Product Sales by Department",
            "Create New Department",
            "Exit"
        ]
    }).then(function(answer) {
    	switch (answer.action) {
            case "View Product Sales by Department":
                viewsalesbyDept();
                break;

            case "Create New Department":
                createDept();
                break;
        }
    })
}

function viewsalesbyDept(){

}

function createDept(){
	inquirer.prompt([{
        type : "input",
        name : "deptname",
        message : "Enter the Department name"
    },{
        type : "input",
        name : "overhead",
        message : "Enter the overhead cost"
    },
    {
        type : "input",
        name : "totalsales",
        message : "Enter the Total Sale "
    }]).then(function(ans){
        conn.query("insert into department set ?",{department_name : ans.deptname,
            over_head_costs : ans.overhead,
            total_sales : ans.totalsales}, function(err,rows){
                console.log("New Department details added")
        })
        conn.query("select * from department",function(err,rows){
            for (var i = 0; i < rows.length; i++) {
            console.log(rows[i].dept_id + " | " + rows[i].department_name + " | " +
                rows[i].over_head_costs +" | " + rows[i].total_sales);
            console.log("------------------------------------------------");
        }
        })
    })
}

init();