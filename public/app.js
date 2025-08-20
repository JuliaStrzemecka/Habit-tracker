async function loadHabits() {
    const res = await fetch('http://localhost:3000/habits');
    const habits = await res.json();

    const list = document.getElementById('habits-list');
    list.innerHTML = "";

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.innerHTML = `<p>${habit.name}</p>`;
        li.setAttribute('habit-id', habit.id)

        btn = document.createElement('button');
        btn.addEventListener('click', markDone);
        btn.innerHTML="done";

        li.appendChild(btn);

        list.appendChild(li);
    });
}

async function addHabit(){
    const newHabitName = document.getElementById('habit-name').value;

    await fetch('http://localhost:3000/habits',  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newHabitName })
  });
   document.getElementById('habit-name').value = '';
  loadHabits();
}

async function markDone(){
  const id = this.closest('li').getAttribute('habit-id');
  await fetch(`http://localhost:3000/habits/${id}/done`, { method: 'POST' });
  loadHabits();
}

document.getElementById('add-habit').addEventListener('click', addHabit);
loadHabits();