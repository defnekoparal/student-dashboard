const buttons = document.querySelectorAll(".energy-btn");
const taskContainer = document.getElementById("taskContainer");
const message = document.getElementById("energyMessage");

const data = {
  tired: {
    message: "Take it easy today. Small wins matter.",
    tasks: [
      "Review flashcards",
      "Organize notes",
      "Watch a short lecture",
      "Rewrite key concepts",
    ],
  },
  okay: {
    message: "You’ve got a steady pace — keep going.",
    tasks: [
      "Complete homework",
      "Do practice problems",
      "Review weak areas",
      "Summarize a chapter",
    ],
  },
  focused: {
    message: "You’re in the zone. Push your limits.",
    tasks: [
      "Take a full practice test",
      "Deep study session (1–2 hrs)",
      "Work on hardest subject",
      "Teach the material out loud",
    ],
  },
};

function updateUI(energy) {
  const selected = data[energy];

  // message
  message.textContent = selected.message;

  // tasks
  taskContainer.innerHTML = selected.tasks
    .map((task) => `<div class="task">${task}</div>`)
    .join("");

  // highlight button
  buttons.forEach((b) => b.classList.remove("active"));
  document.querySelector(`[data-energy="${energy}"]`).classList.add("active");

  // save
  localStorage.setItem("energyLevel", energy);
}

// click events
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    updateUI(btn.dataset.energy);
  });
});

// load saved state
const saved = localStorage.getItem("energyLevel");
if (saved && data[saved]) {
  updateUI(saved);
}
