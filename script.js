// =========================
// WELCOME PAGE QUOTES
// =========================
const quotes = [
  "Small progress is still progress.",
  "You don’t have to do everything today.",
  "Focus on what you can control.",
  "One step at a time leads to big change.",
  "Mistakes are proof that you’re learning.",
  "Your future self will thank you for this effort.",
  "Stay curious, stay consistent, stay kind.",
  "Do it now so your future self can thank you.",
  "Focus on the step in front of you, not the whole staircase.",
  "You don’t have to feel like it. You just have to start.",
  "Every assignment is a step closer to your goals.",
  "Study now, stress less later.",
  "Your effort today is your success tomorrow.",
  "It’s okay to struggle. It’s not okay to quit.",
  "Stay consistent.",
  "Make it happen.",
  "Keep going.",
  "You’ve got this.",
  "Just start.",
  "Be the student you’d look up to.",
  "You are becoming the person you needed.",
  "Progress, not perfection.",
  "Little steps every day.",
  "Grow through what you go through."
];

function showRandomQuote() {
  const motivationalQuote = document.getElementById("motivationalQuote");
  if (!motivationalQuote) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  motivationalQuote.textContent = quotes[randomIndex];
}

const newQuoteBtn = document.getElementById("newQuoteBtn");
if (newQuoteBtn) {
  newQuoteBtn.addEventListener("click", showRandomQuote);
}

showRandomQuote();


// =========================
// DASHBOARD / QUIZ (MORE "AI")
// =========================
const startQuizBtn = document.getElementById("startQuizBtn");
const answerBtns = document.querySelectorAll(".answerBtn");

const quizSection = document.getElementById("quizSection");
const scheduleSection = document.getElementById("scheduleSection");
const quizResult = document.getElementById("quizResult");

const aiResponses = [
  "You're doing well, but a quick review tomorrow will strengthen your memory.",
  "You might want to revisit this topic — you're close to mastering it.",
  "Great understanding — try moving on to a harder concept.",
  "You're improving! A short study session later will help lock this in."
];

if (startQuizBtn) {
  startQuizBtn.addEventListener("click", () => {
    if (quizSection) quizSection.classList.remove("hidden");
  });
}

if (answerBtns.length > 0) {
  answerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (quizResult) {
        quizResult.textContent =
          aiResponses[Math.floor(Math.random() * aiResponses.length)];
      }

      if (scheduleSection) {
        scheduleSection.classList.remove("hidden");
      }
    });
  });
}


// =========================
// CALENDAR (WITH STORAGE)
// =========================
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const taskDate = document.getElementById("taskDate");
const taskText = document.getElementById("taskText");

function makeTaskDeletable(taskElement) {
  taskElement.addEventListener("click", () => {
    const confirmDelete = confirm(`Delete "${taskElement.textContent}"?`);
    if (confirmDelete) {
      taskElement.remove();
      saveTasksToStorage();
    }
  });
}

function saveTasksToStorage() {
  const tasks = [];

  document.querySelectorAll(".calendar-day").forEach(day => {
    const date = day.dataset.day;
    const dayTasks = [];

    day.querySelectorAll(".task-pill").forEach(task => {
      dayTasks.push(task.textContent);
    });

    tasks.push({ date, tasks: dayTasks });
  });

  localStorage.setItem("calendarTasks", JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const saved = JSON.parse(localStorage.getItem("calendarTasks"));
  if (!saved) return;

  saved.forEach(dayData => {
    const day = document.querySelector(`.calendar-day[data-day="${dayData.date}"]`);
    if (!day) return;

    dayData.tasks.forEach(taskText => {
      const task = document.createElement("div");
      task.className = "task-pill";
      task.textContent = taskText;
      makeTaskDeletable(task);
      day.appendChild(task);
    });
  });
}

// Load saved tasks
loadTasksFromStorage();

// Modal controls
if (addTaskBtn) {
  addTaskBtn.addEventListener("click", () => {
    taskModal.classList.remove("hidden");
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    taskModal.classList.add("hidden");
  });
}

if (taskModal) {
  taskModal.addEventListener("click", (e) => {
    if (e.target === taskModal) {
      taskModal.classList.add("hidden");
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    taskModal.classList.add("hidden");
  }
});

// Save task
if (saveTaskBtn) {
  saveTaskBtn.addEventListener("click", () => {
    const selectedDate = taskDate.value;
    const newTaskText = taskText.value.trim();

    if (!newTaskText) {
      alert("Please enter a task.");
      return;
    }

    const targetDay = document.querySelector(
      `.calendar-day[data-day="${selectedDate}"]`
    );

    const newTask = document.createElement("div");
    newTask.className = "task-pill";
    newTask.textContent = newTaskText;

    makeTaskDeletable(newTask);
    targetDay.appendChild(newTask);

    saveTasksToStorage();

    taskText.value = "";
    taskModal.classList.add("hidden");
  });
}


// =========================
// POMODORO TIMER
// =========================
const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");

let timerInterval;
let timeLeft = 25 * 60;

function updateTimerDisplay() {
  if (!timerDisplay) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

if (startTimerBtn) {
  startTimerBtn.addEventListener("click", () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert("Pomodoro finished! Time for a break.");
      }
    }, 1000);
  });
}

if (pauseTimerBtn) {
  pauseTimerBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });
}

if (resetTimerBtn) {
  resetTimerBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
  });
}

updateTimerDisplay();

/* 
// =========================
// WELCOME PAGE QUOTES
// =========================
const quotes = [
  "Small progress is still progress.",
  "You don’t have to do everything today.",
  "Focus on what you can control.",
  "One step at a time leads to big change.",
  "Mistakes are proof that you’re learning.",
  "Your future self will thank you for this effort.",
  "Stay curious, stay consistent, stay kind.",
  "Do it now so your future self can thank you.",
  "Focus on the step in front of you, not the whole staircase.",
  "You don’t have to feel like it. You just have to start.",
  "Every assignment is a step closer to your goals.",
  "Study now, stress less later.",
  "Your effort today is your success tomorrow.",
  "It’s okay to struggle. It’s not okay to quit.",
  "Stay consistent.",
  "Make it happen.",
  "Keep going.",
  "You’ve got this.",
  "Just start.",
  "Be the student you’d look up to.",
  "You are becoming the person you needed.",
  "Progress, not perfection.",
  "Little steps every day.",
  "Grow through what you go through."
];

function showRandomQuote() {
  const motivationalQuote = document.getElementById("motivationalQuote");
  if (!motivationalQuote) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  motivationalQuote.textContent = quotes[randomIndex];
}

const newQuoteBtn = document.getElementById("newQuoteBtn");
if (newQuoteBtn) {
  newQuoteBtn.addEventListener("click", showRandomQuote);
}

showRandomQuote();


// =========================
// DASHBOARD / QUIZ / NOTES
// =========================
const generateBtn = document.getElementById("generateBtn");
const startQuizBtn = document.getElementById("startQuizBtn");
const answerBtns = document.querySelectorAll(".answerBtn");

const summarySection = document.getElementById("summarySection");
const dashboardSection = document.getElementById("dashboardSection");
const quizSection = document.getElementById("quizSection");
const scheduleSection = document.getElementById("scheduleSection");
const quizResult = document.getElementById("quizResult");

if (generateBtn) {
  generateBtn.addEventListener("click", () => {
    if (summarySection) summarySection.classList.remove("hidden");
    if (dashboardSection) dashboardSection.classList.remove("hidden");
  });
}

if (startQuizBtn) {
  startQuizBtn.addEventListener("click", () => {
    if (quizSection) quizSection.classList.remove("hidden");
  });
}

if (answerBtns.length > 0) {
  answerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (quizResult) {
        quizResult.textContent =
          "Nice work. Your result suggests medium confidence, so a review session was suggested for tomorrow.";
      }

      if (scheduleSection) {
        scheduleSection.classList.remove("hidden");
      }
    });
  });
}


// =========================
// CALENDAR / ADD TASK MODAL
// =========================
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const taskDate = document.getElementById("taskDate");
const taskText = document.getElementById("taskText");

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", () => {
    if (taskModal) taskModal.classList.remove("hidden");
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    if (taskModal) taskModal.classList.add("hidden");
  });
}

if (taskModal) {
  taskModal.addEventListener("click", (e) => {
    if (e.target === taskModal) {
      taskModal.classList.add("hidden");
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && taskModal) {
    taskModal.classList.add("hidden");
  }
});

function makeTaskDeletable(taskElement) {
  taskElement.addEventListener("click", () => {
    const confirmDelete = confirm(`Delete "${taskElement.textContent}"?`);
    if (confirmDelete) {
      taskElement.remove();
    }
  });
}

document.querySelectorAll(".task-pill").forEach((task) => {
  makeTaskDeletable(task);
});

if (saveTaskBtn) {
  saveTaskBtn.addEventListener("click", () => {
    if (!taskDate || !taskText || !taskModal) return;

    const selectedDate = taskDate.value;
    const newTaskText = taskText.value.trim();

    if (!newTaskText) {
      alert("Please enter a task.");
      return;
    }

    const targetDay = document.querySelector(
      `.calendar-day[data-day="${selectedDate}"]`
    );

    if (!targetDay) {
      alert("Could not find that calendar day.");
      return;
    }

    const newTask = document.createElement("div");
    newTask.className = "task-pill";
    newTask.textContent = newTaskText;

    makeTaskDeletable(newTask);

    targetDay.appendChild(newTask);

    taskText.value = "";
    taskModal.classList.add("hidden");
  });
}


// =========================
// POMODORO TIMER
// =========================
const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");

let timerInterval;
let timeLeft = 25 * 60;

function updateTimerDisplay() {
  if (!timerDisplay) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

if (startTimerBtn) {
  startTimerBtn.addEventListener("click", () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert("Pomodoro finished! Time for a break.");
      }
    }, 1000);
  });
}

if (pauseTimerBtn) {
  pauseTimerBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });
}

if (resetTimerBtn) {
  resetTimerBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
  });
}

updateTimerDisplay();
*/
