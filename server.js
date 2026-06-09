const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // This automatically serves all your HTML/CSS files to the network!

// Server Memory Arrays (Our live cloud database simulation)
let ticketsDb = [];
let quizzesDb = [];
let submissionsDb = [];

/* --- 1. STUDENT DOUBTS QUEUE ENDPOINTS --- */
app.get('/api/tickets', (req, res) => {
    res.json(ticketsDb);
});

app.post('/api/tickets', (req, res) => {
    const ticket = {
        id: 'REF-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        student_id: req.body.student_id,
        query_text: req.body.query_text,
        status: 'PENDING',
        teacher_response: null,
        timestamp: new Date().toISOString()
    };
    ticketsDb.push(ticket);
    res.status(201).json(ticket);
});

app.post('/api/tickets/resolve', (req, res) => {
    const { id, teacher_response } = req.body;
    ticketsDb = ticketsDb.map(t => t.id === id ? { ...t, status: 'RESOLVED', teacher_response } : t);
    res.json({ success: true });
});

/* --- 2. INFINITE QUIZ GENERATOR STUDIO ENDPOINTS --- */
app.get('/api/quizzes', (req, res) => {
    res.json(quizzesDb);
});

app.post('/api/quizzes', (req, res) => {
    const quiz = {
        id: 'SET-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        author: req.body.author,
        title: req.body.title,
        questions: req.body.questions,
        timestamp: new Date().toISOString()
    };
    quizzesDb.push(quiz);
    res.status(201).json(quiz);
});

/* --- 3. EXAM SUBMISSIONS & GRADING DESK ENDPOINTS --- */
app.get('/api/submissions', (req, res) => {
    res.json(submissionsDb);
});

app.post('/api/submissions', (req, res) => {
    const sub = {
        id: 'SUB-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        student_id: req.body.student_id,
        quiz_id: req.body.quiz_id,
        answers: req.body.answers,
        graded: false,
        marks: null,
        comment: null,
        timestamp: new Date().toISOString()
    };
    submissionsDb.push(sub);
    res.status(201).json(sub);
});

app.post('/api/submissions/grade', (req, res) => {
    const { id, marks, comment } = req.body;
    submissionsDb = submissionsDb.map(s => s.id === id ? { ...s, graded: true, marks, comment } : s);
    res.json({ success: true });
});

/* --- 4. ENVIRONMENT-AWARE PORT ACTIVATION --- */
// Render assigns its own port dynamically via process.env.PORT, local testing falls back to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Academy Backend System Active on Port ${PORT}`);
});