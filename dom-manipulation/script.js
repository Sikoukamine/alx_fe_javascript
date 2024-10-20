const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API for quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available. Please add some!");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteDisplay").innerText = quotes[randomIndex].text;
}

// Function to add a quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value;
  const quoteCategory = document.getElementById("newQuoteCategory").value;

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill out both fields.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  notifyUser("Quote added successfully!");
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes.length > 0 ? filteredQuotes.map(q => `<div>${q.text}</div>`).join("") : "No quotes found.";
}

// Function to export quotes to JSON
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    notifyUser("Quotes imported successfully!");
    populateCategories();
    filterQuotes();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to notify the user
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.className = "notification"; // Add a class for styling
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000); // Remove after 5 seconds
}

// Function to sync quotes with the server
async function syncQuotes() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();

    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    serverQuotes.forEach(serverQuote => {
      const existingQuote = localQuotes.find(localQuote => localQuote.text === serverQuote.title);
      if (!existingQuote) {
        localQuotes.push({
          text: serverQuote.title,
          category: 'General' // Adjust category as needed
        });
      } else {
        // Conflict handling
        if (existingQuote.category !== 'General') {
          const userChoice = confirm(`Conflict detected for quote: "${existingQuote.text}". 
          Local: "${existingQuote.category}", Server: "General". 
          Click OK to keep the server's version, Cancel to keep local version.`);
          
          if (userChoice) {
            existingQuote.category = 'General'; // Update local quote with server's category
            notifyUser(`Updated "${existingQuote.text}" with server's version.`);
          } else {
            notifyUser(`Kept local version of "${existingQuote.text}".`);
          }
        }
      }
    });

    // Update local storage with the merged quotes
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    quotes = localQuotes; // Update the quotes variable to the new local quotes
    filterQuotes(); // Update the displayed quotes

    // Notify user about successful sync
    notifyUser("Quotes synced with server!");
  } catch (error) {
    console.error('Error syncing quotes:', error);
  }
}

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();
  syncQuotes(); // Optional: sync quotes on page load
});
