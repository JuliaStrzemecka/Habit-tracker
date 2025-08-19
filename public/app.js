async function loadHabits() {
    const res = await fetch('http://localhost:3000/habits');
    const habits = await res.json();

    const list = document.getElementById('habits-list');
    list.innerHTML = "";

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.innerHTML = `${habit.name} (rozpoczęto${habit.dates[0]}) <button onclick="markDone(${habit.id})">DONE</button>`;
        list.appendChild(li);
    });
}

loadHabits();