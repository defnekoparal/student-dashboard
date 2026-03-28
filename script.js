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
const saveTaskBtn = document.getElementById("saveTaskBtn");

const taskDay = document.getElementById("taskDay");
const taskTime = document.getElementById("taskTime");
const taskText = document.getElementById("taskText");

generateBtn?.addEventListener("click", () => {
  summarySection.classList.remove("hidden");
  dashboardSection.classList.remove("hidden");
});

startQuizBtn?.addEventListener("click", () => {
  quizSection.classList.remove("hidden");
});

answerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    quizResult.textContent =
      "Nice work. Your result suggests medium confidence, so a review session was suggested for tomorrow.";
    scheduleSection.classList.remove("hidden");
  });
});

addTaskBtn?.addEventListener("click", () => {
  taskModal.classList.remove("hidden");
});

closeModalBtn?.addEventListener("click", () => {
  taskModal.classList.add("hidden");
});

saveTaskBtn?.addEventListener("click", () => {
  const day = taskDay.value;
  const time = taskTime.value.trim();
  const text = taskText.value.trim();

  if (!time || !text) {
    alert("Please fill in both time and task.");
    return;
  }

  const dayColumns = document.querySelectorAll(".day-column");

  dayColumns.forEach((column) => {
    const heading = column.querySelector("h3").textContent.toLowerCase();

    if (heading === day) {
      const newTask = document.createElement("div");
      newTask.className = "task";
      newTask.innerHTML = `
        <strong>${time}</strong>
        <p>${text}</p>
      `;

      newTask.addEventListener("click", () => {
        const shouldDelete = confirm("Do you want to delete this task?");
        if (shouldDelete) {
          newTask.remove();
        }
      });

      column.appendChild(newTask);
    }
  });

  taskTime.value = "";
  taskText.value = "";
  taskModal.classList.add("hidden");
});

document.querySelectorAll(".task").forEach((task) => {
  task.addEventListener("click", () => {
    const shouldDelete = confirm("Do you want to delete this task?");
    if (shouldDelete) {
      task.remove();
    }
  });
});
