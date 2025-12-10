class calendar{
  constructor(){
    this.now = new Date();
    this.month = this.now.getMonth();
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.year = this.now.getFullYear();
    this.habitInfo = null;
  }

  render(habitInfo){
  this.habitInfo = habitInfo;
  const result = document.createElement('div');

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '<';
  prevBtn.classList.add('prev-btn');
  prevBtn.addEventListener('click', ()=>this.goToPrevious());

  const nextBtn = document.createElement('div');
  nextBtn.innerHTML = '>';
  nextBtn.classList.add('next-btn');
  nextBtn.addEventListener('click', ()=>this.goToNext());

  const calendarMonth = document.createElement('div');
  calendarMonth.innerHTML = `${this.monthNames[this.month]}&nbsp;${this.year}`;
  calendarMonth.classList.add('calendar-month');

  const calendarHeader = document.createElement('div');
  calendarHeader.classList.add('calendarHeader');
  calendarHeader.append(prevBtn);
  calendarHeader.append(calendarMonth);
  calendarHeader.append(nextBtn);
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = document.createElement('div');
  calendarDays.classList.add('calendar-days');
  for(let i = 0; i<7; i++){
    var day = document.createElement('div');
    day.classList.add('calendar-day');
    day.innerHTML = days[i];

    calendarDays.append(day);
  }

  const calendarDates = document.createElement('div');
  calendarDates.classList.add('calendar-dates');
  const t = new Date(this.year, this.month, 1);
  const firstDay = t.getDay()

  for (let i = 0; i<firstDay; i++){
    const date = document.createElement('div');
    date.classList.add('calendar-date');
    date.innerHTML = '';

    calendarDates.append(date);
  }
   
  const daysInMonth = new Date(this.year, this.month+1, 0).getDate();
  const j = daysInMonth + firstDay - 1;
  for(let i = firstDay-1; i<j; i++){
      const date = document.createElement("div");
      date.innerText = i - firstDay + 2;
      date.dayNr = i - firstDay + 2;
      date.classList.add("calendar-date");

     const dayStr = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(date.dayNr).padStart(2, '0')}`;

      if (habitInfo.dates.includes(dayStr)) {
      date.classList.add("done"); 
     }

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
    this.render(this.habitInfo);
  }

  goToNext(){
     if(this.month === 11){
      this.year = this.year+1;
      this.month = 0;
    }
    else{
      ++this.month;
    }
    this.render(this.habitInfo);
  }
}

async function loadHabits() {
    const res = await fetch('http://localhost:3000/habits');
    const habits = await res.json();

    const list = document.getElementById('habits-list');
    list.innerHTML = "";

    habits.forEach(habit => {
        const name = document.createElement('p');
        name.innerHTML = habit.name;
        name.addEventListener('click', () => {
          window.location.href = `stats.html?id=${habit.id}`;
        });

        const li = document.createElement('li');
        li.classList.add('habit');
        li.setAttribute('habit-id', habit.id)

        btn = document.createElement('button');
        btn.innerHTML="done";
        btn.disabled=true;
        if(habit.dates[habit.dates.length-1] !== today.toISOString().split('T')[0]){
          btn.addEventListener('click', markDone);
          btn.disabled=false;
      }

      li. appendChild(name);
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

  document.getElementById('habit-n').innerHTML = habit.name;  

  const streaks = countStreaks(habit);
  document.getElementById('longest-streak').innerHTML = streaks[0];
  document.getElementById('current-streak').innerHTML = streaks[1];

  document.getElementById('first-day').innerHTML = habit.dates[0];

  const cal = new calendar();
  cal.render(habit);

}

function countStreaks(habit){
    if (!habit.dates || habit.dates.length === 0) return 0;


    const sortedDates = [...habit.dates].sort();

    let longest = 0;
    let current = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);

      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24); 

      if (diffDays === 1) {
        current++;
      } else if (diffDays > 1) {
        current = 1;
        longest = Math.max(longest, current);
      }

      longest = Math.max(longest, current);
    }

  const today = new Date().toISOString().split('T')[0];
  const lastDate = sortedDates[sortedDates.length - 1];
  const diffFromToday = (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24);

  if (diffFromToday > 1) {
    current = 0;
  }

    return [longest, current];
}

const path = window.location.pathname;

const today = new Date();

if (path.endsWith("index.html")) {
  loadHabits();
  document.getElementById("add-habit").addEventListener('click', addHabit);
}

if (path.endsWith("stats.html")) {
  displayHabitDetails();
}
