async function loadHabits() {
    const res = await fetch('http://localhost:3000/habits');
    const habits = await res.json();

    const today = new Date().toISOString().split('T')[0];
    const list = document.getElementById('habits-list');
    list.innerHTML = "";

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.innerHTML = `<p>${habit.name}</p>`;
        li.setAttribute('habit-id', habit.id)
        li.addEventListener('click', () => {
          window.location.href = `stats.html?id=${habit.id}`;
        });

        btn = document.createElement('button');
        btn.innerHTML="done";
        btn.disabled=true;
        if(habit.dates[habit.dates.length-1] !== today){
          btn.addEventListener('click', markDone);
          btn.disabled=false;
      }

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

async function displayHabitDetails(){
  const params = new URLSearchParams(window.location.search);
  const habitID = params.get('id');

  const res = await fetch(`http://localhost:3000/habits/${habitID}`);
  const habit = await res.json();

  document.getElementById('habit-name').innerHTML = habit.name;  
}

const path = window.location.pathname;

if (path.endsWith("index.html")) {
  loadHabits();
}

if (path.endsWith("stats.html")) {
  displayHabitDetails();
}
