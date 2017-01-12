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
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add new Product",
            "Exit"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInv();
                break;

            case "Add to Inventory":
                addToInv();
                break;

            case "Add new Product":
                addProduct();
                break;
            
        }
    });
}

function viewProducts() {
    conn.query("SELECT * from products",
        function(err, rows) {
            console.log("\n****************Inventory*****************\n");
            console.log("Item Id " + " " + " Product Name " + "\t Price \n===============================")
            for (var i = 0; i < rows.length; i++) {
                console.log(rows[i].item_id + " | " + rows[i].product_name + " | " +
                    rows[i].department_name + " | " + rows[i].price +
                    " | " + rows[i].stock_quantity);
                console.log("------------------------------------------------");
            }
            init();
        }); //select
}

function viewLowInv() {
    conn.query("select * from products where stock_quantity < 5", function(err, rows) {
        console.log("\n****************Inventory*****************\n");
        console.log("Item Id " + " " + " Product Name " + "\t Price \n===============================")
        for (var i = 0; i < rows.length; i++) {
            console.log(rows[i].item_id + " | " + rows[i].product_name + " | " +
                rows[i].department_name + " | " + rows[i].price +
                " | " + rows[i].stock_quantity);
            console.log("------------------------------------------------");
        }
        init();
    })
}

function addToInv() {
    inquirer.prompt([{
        name: "itemid",
        type: "input",
        message: "Which item you want to add?"
    }, {
        name: "quantity",
        type: "input",
        message: "How many you want to add ?"
    }]).then(function(answer) {
        conn.query("select * from products where ?", { item_id: answer.itemid },
            function(err, rows) {
                var newqty = (parseInt(rows[0].stock_quantity) + parseInt(answer.quantity));
                conn.query("update products set ? where ?", [{ stock_quantity: newqty },
                    { item_id: answer.itemid },
                ], function(err, rows) {
                    console.log("Stock Added successfully");
                });
            })
    });
}

function addProduct(){
    inquirer.prompt([{
        type : "input",
        name : "productname",
        message : "Enter the Product name"
    },{
        type : "input",
        name : "deptName",
        message : "Enter the Department Name it belongs to "
    },
    {
        type : "input",
        name : "newprice",
        message : "Enter the Price "
    },{
        type : "input",
        name : "newStockQuantity",
        message : "Enter the quantity you want to add"
    }]).then(function(ans){
        conn.query("insert into products set ?",{product_name : ans.productname,
            department_name: ans.deptName,
            price : ans.newprice, stock_quantity : ans.newStockQuantity}, function(err,rows){
                console.log("Item details added")
        })
        conn.query("select * from products",function(err,rows){
            for (var i = 0; i < rows.length; i++) {
            console.log(rows[i].item_id + " | " + rows[i].product_name + " | " +
                rows[i].department_name + " | " + rows[i].price +
                " | " + rows[i].stock_quantity);
            console.log("------------------------------------------------");
        }
        })
    })
}

init();
