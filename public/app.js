class calendar{
  constructor(){
    this.now = new Date();
    this.month = this.now.getMonth();
    this.year = this.now.getFullYear();
  }

  render(){
  const result = document.createElement('div');

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '<';
  prevBtn.classList.add('prev-btn');
  prevBtn.addEventListener('click', ()=>this.goToPrevious());
  const nextBtn = document.createElement('div');
  nextBtn.classList.add('next-btn');
  const calendarMonth = document.createElement('div');
  calendarMonth.classList.add('calendar-month');

  const calendarHeader = document.createElement('div');
  calendarHeader.classList.add('calendarHeader');
  calendarHeader.append(prevBtn);
  calendarHeader.append(calendarMonth);
  calendarHeader.append(nextBtn);
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calendarDays = document.createElement('div');
  calendarDays.classList.add('calendar-days');
  for(let i = 0; i<7; i++){
    var day = document.createElement('div');
    day.classList.add('calendar-day');
    day.innerHTML = days[i];

    calendarDays.append(day);
  }

  const calendarDates = document.createElement('div');
  const t = new Date(this.year, this.month, 1);
  const firstDay = t.getDay()
  console.log(firstDay);
  for (let i = 0; i<firstDay; i++){
    const date = document.createElement('div');
    date.classList.add('calendar-date');
    date.innerHTML = 'x';

    calendarDates.append(date);
  }
   
  const daysInMonth = new Date(this.year, this.month , 0).getDate();
  const j = daysInMonth + firstDay - 1;
  for(let i = firstDay-1; i<j; i++){
      const date = document.createElement("div");
      date.innerText = i - firstDay + 2;
      date.dayNr = i - firstDay + 2;
      date.classList.add("calendar-date");

      calendarDates.appendChild(date);
  }

  result.append(calendarHeader);
  result.append(calendarDays);
  result.append(calendarDates);

  document.getElementById('calendar').innerHTML = '';
  document.getElementById('calendar').append(result);
  }

  goToPrevious(){
    if(this.month === 0){
      this.year = this.year-1;
      this.month = 11;
    }
    else{
      --this.month;
    }
    this.render();
  }
}

async function loadHabits() {
    const res = await fetch('http://localhost:3000/habits');
    const habits = await res.json();

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
        if(habit.dates[habit.dates.length-1] !== today.toISOString().split('T')[0]){
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

  const cal = new calendar();
  cal.render();

}

const path = window.location.pathname;

const today = new Date();

if (path.endsWith("index.html")) {
  loadHabits();
}

if (path.endsWith("stats.html")) {
  displayHabitDetails();
}
