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
    conn.query("SELECT item_id,product_name,price from products",
        function(err, rows) {
            console.log("\n****************Inventory*****************\n");
            console.log("Item Id " + " " + " Product Name " + "\t Price \n===============================")
            for (var i = 0; i < rows.length; i++) {
                console.log(rows[i].item_id + " | " + rows[i].product_name + " | " +
                    rows[i].price);
                console.log("------------------------------------------------");
            }
            promptProductId();
        }); //select
}

function promptProductId() {
    inquirer.prompt([{
        type: "input",
        name: "item_id",
        message: "Enter the product ID, for the product you want to buy "
    }]).then(function(ans) {
        var query = "select * from products where ?";
        conn.query(query, { item_id: ans.item_id }, function(err, rows) {
            if (err) throw err;
            if (rows == "") {
                console.log("invalid ID");
                return;
            } 
            promptQuantity(ans.item_id);       
        })

    })
}


function promptQuantity(itemId) {
    console.log(itemId)
    inquirer.prompt([{
        type: "input",
        name: "qty",
        message: "How many you wish to buy ?"
    }]).then(function(ans) {
        var quantity = ans.qty;
        var query = "select * from products where ?";
        conn.query(query, { item_id: itemId }, function(err, rows) {
            if (quantity <= rows[0].stock_quantity) {
                var cost = (quantity * parseFloat(rows[0].price));
                remItem = (parseInt(rows[0].stock_quantity) - quantity); //remaining quantity
                conn.query("update products set ? where ?", [{ stock_quantity: remItem },
                    { item_id: itemId }
                ], function(err, rows) {
                    console.log("Order placed! \n Total Cost : " + cost);
                })
            } else {
                console.log("Insufficient Stock!!");
                init();
            }

        }); //select query
    })
}
init();
