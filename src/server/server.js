const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// Test data
let habits = [
  { id: 1, name: 'Pić wodę', dates: ['2025-08-01', '2025-08-02'] },
  { id: 2, name: 'Ćwiczyć', dates: ['2025-08-03'] }
];

// Endpoint: all habits
app.get('/habits', (req, res) => {
  res.json(habits);
});

// Endpoint: one habit
app.get('/habits/:id', (req, res) => {
  const habit = habits.find(h => h.id === parseInt(req.params.id));
  if (habit) {
    res.json(habit);
  } else {
    res.status(404).json({ error: 'Habit not found' });
  }
});

//Adding habit
app.post('/habits', (req, res) => {
  const newHabit = {
    id: habits.length-1,
    name: req.body.name,
    dates: []
  }

  habits.push(newHabit);
  res.status(201).json(newHabit);
})

//Marking habit as done
app.post('/habits/:id/done', (req, res) => {
  const habit = habits.find(h => h.id === parseInt(req.params.id));

  if (!habit){
    return res.status(404).json({error: 'Habit not found'})
  }
  const today = new Date().toString.split('T')[0];
  habit.dates.push(today);
  res.json(habit);
})

// Run
app.listen(3000, () => {
  console.log('✅ Server działa na http://localhost:3000');
});
