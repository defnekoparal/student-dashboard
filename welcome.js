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
  const quoteText = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("motivationalQuote").textContent = quoteText;
}

// Run when page loads
showRandomQuote();

<button onclick="showRandomQuote()">New Quote</button>