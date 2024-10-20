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

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = new Set(quotes.map(quote => quote.category));

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
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous quotes
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement("p");
    quoteElement.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    quoteDisplay.appendChild(quoteElement);
  });

  // Save the last selected category to local storage
  localStorage.setItem("lastSelectedCategory", selectedCategory);
}

// Restore last selected category from local storage
window.onload = function() {
  populateCategories();
  
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";
  document.getElementById("categoryFilter").value = lastSelectedCategory;
  filterQuotes(); // Call filterQuotes to display quotes based on last selected category
};

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    // Check if the category already exists
    if (!quotes.some(quote => quote.category === newQuoteCategory)) {
      const newOption = document.createElement("option");
      newOption.value = newQuoteCategory;
      newOption.textContent = newQuoteCategory;
      document.getElementById("categoryFilter").appendChild(newOption);
    }

    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save the updated quotes to local storage
    alert("New quote added successfully!");

    // Clear input fields
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
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
