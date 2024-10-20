let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Check if there are any quotes in local storage
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;
  
  // Save last viewed quote to session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Display the last viewed quote from session storage if available
if (sessionStorage.getItem("lastQuote")) {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  document.getElementById("quoteDisplay").innerHTML = `<p>"${lastQuote.text}" - <em>${lastQuote.category}</em></p>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save the updated quotes to local storage
    alert("New quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Function to export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save the imported quotes to local storage
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add event listener for showing a new random quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add event listener for adding a new quote
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Add event listener for importing a JSON file
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
