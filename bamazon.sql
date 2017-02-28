
create database bamazon_DB;

use bamazon_DB;

create table products(
item_id INTEGER(10) NOT NULL auto_increment primary key,
product_name  VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price decimal(10,2) NOT NULL,
stock_quantity integer(10) NOT NULL
);

alter table products auto_increment(item_id);

select count(*) as Movies from products;

SELECT * from products;

insert into products(item_id, product_name, department_name, price, stock_quantity)
values(43001,"Olay Moisturizer", "Beauty and Health", 9.99, 10);

insert into products(product_name, department_name, price, stock_quantity)
values("Star Wars Blu Ray","Movies and TV", 24.99, 25);

insert into products(product_name, department_name, price, stock_quantity)
values("After Earth DVD", "Movies and TV", 6.99, 15),
("Warcraft Blu Ray", "Movies and TV", 15.99, 12),
("Deadpool Blu Ray", "Movies and TV", 16.99, 8),
("Harry Potter 8 film Collection Blu Ray", "Movies and TV", 39.99, 20),
("Gravity Blu Ray", "Movies and TV", 18.99, 15),
("Matrix Blu Ray", "Movies and TV", 14.99, 30),
("Jurassic Park Collection Blu Ray", "Movies and TV", 25.99, 10),
("Hobbit Collection -3 Blu Ray", "Movies and TV", 22.99, 5),
("Da Vinci Code", "Movies and TV", 16.99, 10);


select * from department;

create table department(
dept_id INTEGER(10) NOT NULL auto_increment primary key,
department_name  VARCHAR(50) NOT NULL,
over_head_costs  decimal(10,2),
total_sales decimal(10,2)
);


update department  set total_sales = (select sum(total_sales) from department d inner join products p on d.department_name= p.department_name);

--profut =  sales - over head cost

select dept_id, department_name, over_ hesd product sales , totalsales -ovcost as total profit join on p and d on dept name  grp by dept name 

"update products p, department d set d.total_sales =? where p.item_id=? and d.department_name = p.department_name";

