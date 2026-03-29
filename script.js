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
  "If you're not a cs major, you're stupid.",
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
