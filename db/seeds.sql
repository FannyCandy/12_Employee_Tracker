INSERT INTO department (department_name)
VALUES ("Marketing"),
       ("Human Resource"),
       ("Finance");

INSERT INTO role (role_title, role_salary, department_id)
VALUES ("Marketing Manager", 60000, 1),
       ("HR Coordinator", 50000, 2),
       ("Account Manger", 160000, 3),
       ("Accountant", 125000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lea", "Mayer", 1, null),
       ("Arturo", "Rich", 2, null),
       ("Mason", "Sims", 3, 52),
       ("Margaret", "Alvarez", 3, 52),
       ("Elisa", "Cowan", 3, null);
