const quotes = [
  "Small progress is still progress.",
  "You don’t have to do everything today.",
  "Focus on what you can control.",
  "One step at a time leads to big change.",
  "Mistakes are proof that you’re learning.",
  "Your future self will thank you for this effort.",
  "Stay curious, stay consistent, stay kind."
];

function showRandomQuote() {
  const quoteText = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("motivationalQuote").textContent = quoteText;
}

// Run when page loads
showRandomQuote();