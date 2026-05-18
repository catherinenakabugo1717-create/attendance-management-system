const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/students", (req, res) => {

    const students = JSON.parse(

        fs.readFileSync("students.json")

    );

    res.json(students);

});

const PORT = process.env.PORT || 3000;

// students
app.post("/students", (req, res) => {

    const newStudent = req.body;

    const students = JSON.parse(
        fs.readFileSync("students.json")
    );

    students.push(newStudent);

    fs.writeFileSync(
        "students.json",
        JSON.stringify(students, null, 2)
    );

    res.json({
        message: "Student Added"
    });

});

//login
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    // demo credentials (you can later store in file or DB)
    if(username === "admin" && password === "1234"){

        res.json({
            success: true,
            token: "logged-in-admin"
        });

    } else {

        res.json({
            success: false,
            message: "Invalid credentials"
        });

    }

});

//post attendance
app.post("/attendance", (req, res) => {

    const newRecord = req.body;

    const attendance = JSON.parse(
        fs.readFileSync("attendance.json")
    );

    attendance.push(newRecord);

    fs.writeFileSync(
        "attendance.json",
        JSON.stringify(attendance, null, 2)
    );

    res.json({
        message: "Attendance recorded"
    });

});

//get attendance
app.get("/attendance", (req, res) => {

    const attendance = JSON.parse(
        fs.readFileSync("attendance.json")
    );

    res.json(attendance);

});

//gets total number of students
app.get("/stats/students", (req, res) => {

    const students = JSON.parse(
        fs.readFileSync("students.json")
    );

    res.json({ total: students.length });

});

//attendance stats
app.get("/stats/attendance", (req, res) => {

    const attendance = JSON.parse(
        fs.readFileSync("attendance.json")
    );

    let present = 0;
    let absent = 0;

    attendance.forEach(a => {
        if(a.status === "Present") present++;
        else absent++;
    });

    res.json({
        total: attendance.length,
        present,
        absent
    });

});

//delete student
app.delete("/students/:name", (req, res) => {

    let students = JSON.parse(
        fs.readFileSync("students.json")
    );

    const name = req.params.name;

    students = students.filter(s => s.name !== name);

    fs.writeFileSync(
        "students.json",
        JSON.stringify(students, null, 2)
    );

    res.json({ message: "Student deleted" });

});

//delete attendance
app.delete("/attendance/:index", (req, res) => {

    let attendance = JSON.parse(
        fs.readFileSync("attendance.json")
    );

    const index = req.params.index;

    attendance.splice(index, 1);

    fs.writeFileSync(
        "attendance.json",
        JSON.stringify(attendance, null, 2)
    );

    res.json({ message: "Attendance deleted" });

});

//statistics
app.get("/stats/advanced", (req, res) => {

    const students = JSON.parse(fs.readFileSync("students.json"));
    const attendance = JSON.parse(fs.readFileSync("attendance.json"));

    let present = 0;

    attendance.forEach(a => {
        if(a.status === "Present") present++;
    });

    let attendanceRate = attendance.length === 0
        ? 0
        : (present / attendance.length) * 100;

    res.json({
        totalStudents: students.length,
        totalAttendance: attendance.length,
        present,
        absent: attendance.length - present,
        attendanceRate: attendanceRate.toFixed(2)
    });

});

//percentage stats
app.get("/stats/per-student", (req, res) => {

    const students = JSON.parse(fs.readFileSync("students.json"));
    const attendance = JSON.parse(fs.readFileSync("attendance.json"));

    let result = [];

    students.forEach(student => {

        let records = attendance.filter(a => a.student === student.name);

        let total = records.length;
        let present = records.filter(r => r.status === "Present").length;

        let percent = total === 0 ? 0 : (present / total) * 100;

        result.push({
            name: student.name,
            percentage: percent.toFixed(2)
        });

    });

    res.json(result);

});

//posts everything
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

