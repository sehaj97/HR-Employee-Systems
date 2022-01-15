INSERT INTO departments(department_name)
VALUES
("Management"),
("Marketing"),
("Engineering"),
("Finance"),
("HR");

INSERT INTO roles (title, salary, department_id)
VALUES
("Operations Manager", 100.50, 1),
("Office Manager", 100.50, 1),
("CEO", 3000000.50, 1),
("Marketing Manager", 40.50, 2),
("Marketing Assistant", 40.10, 2),
("Engineering Manager", 200.00, 3),
("Software Engineering Lead", 168.00, 3),
("Senior Engineer", 90.50, 3),
("Junior Engineer", 80.50, 3),
("Finance Manager", 60.08, 4),
("Accountant", 58.06, 4),
("HR Manager", 20.08, 5),
("HR Rep", 18.69, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Sehaj", "S", 13, 2),
("Isabelle", "A", 12, 5),
("Izzy", "G", 11, 4),
("Bella", "H", 10, 5),
( "William", "B", 3, null),
("Will", "I", 6, 5),
("Billy", "J", 7, 6),
("Liam", "K", 8, 7),
("Genevieve", "C", 9, 7),
("Jen", "L", 8, 7),
("Gene", "M", 7, 6),
("Ginny", "N", 5, 13),
("Viv", "O", 4, 5),
("Eve", "P", 1, 5),
("Alfred", "D", 2, 5)