INSERT INTO departments (department_name)
VALUES  ("Customer Service"),
        ("Finance"),
        ("Engineering"),
        ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Customer Support", 80000, 1),
        ("Consumer Satisfaction", 105000, 1),
        ("Sales Rep", 80000, 2),
        ("Marketing Director", 110000, 2),
        ("Developer", 90000, 3),
        ("Lead Engineer", 125000, 3),
        ("Lawyer", 100000, 4),
        ("Legal Team Lead", 150000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Dan", "Patrick", 1, 2),
        ("Steve", "Irwin", 2, NULL),
        ("Jessica", "Goodwin", 3, 4),
        ("Delainy", "Poppins", 4, NULL),
        ("Justin", "Harding", 5, 7),
        ("Angel", "Rodriguez", 5, 7),
        ("Domi", "White", 6, NULL),
        ("Rosa", "Garcia", 7, 9),
        ("Johnny", "Martinez", 8, NULL);
