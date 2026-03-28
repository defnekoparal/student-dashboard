const generateBtn = document.getElementById("generateBtn");
const startQuizBtn = document.getElementById("startQuizBtn");
const answerBtns = document.querySelectorAll(".answerBtn");

const summarySection = document.getElementById("summarySection");
const dashboardSection = document.getElementById("dashboardSection");
const quizSection = document.getElementById("quizSection");
const scheduleSection = document.getElementById("scheduleSection");
const quizResult = document.getElementById("quizResult");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModalBtn");
closeModalBtn?.addEventListener("click", () => {
  taskModal.classList.add("hidden");
});
const saveTaskBtn = document.getElementById("saveTaskBtn");
const taskDate = document.getElementById("taskDate");
const taskText = document.getElementById("taskText");

generateBtn?.addEventListener("click", () => {
  summarySection?.classList.remove("hidden");
  dashboardSection?.classList.remove("hidden");
});

startQuizBtn?.addEventListener("click", () => {
  quizSection?.classList.remove("hidden");
});

answerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (quizResult) {
      quizResult.textContent =
        "Nice work. Your result suggests medium confidence, so a review session was suggested for tomorrow.";
    }
    scheduleSection?.classList.remove("hidden");
  });
});

addTaskBtn?.addEventListener("click", () => {
  taskModal?.classList.remove("hidden");
});

closeModalBtn?.addEventListener("click", () => {
  taskModal?.classList.add("hidden");
});

saveTaskBtn?.addEventListener("click", () => {
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

  targetDay.appendChild(newTask);

  taskText.value = "";
  taskModal.classList.add("hidden");
});
