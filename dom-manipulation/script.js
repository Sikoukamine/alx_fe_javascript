let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Fetch quotes from server periodically
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example API

function fetchQuotesFromServer() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const fetchedQuotes = data.map(item => ({
        text: item.title,
        category: 'General' // Default category or derive from data
      }));
      syncWithServer(fetchedQuotes);
    })
    .catch(error => console.error('Error fetching quotes:', error));
}

// Periodically fetch new quotes (e.g., every 10 seconds)
setInterval(fetchQuotesFromServer, 10000);

// Sync quotes with server data
function syncWithServer(fetchedQuotes) {
  const existingQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const mergedQuotes = [...existingQuotes];

  fetchedQuotes.forEach(fetchedQuote => {
    const exists = existingQuotes.find(quote => quote.text === fetchedQuote.text);
    if (!exists) {
      mergedQuotes.push(fetchedQuote);
    } else {
      const localQuote = exists;
      if (localQuote.category !== fetchedQuote.category) {
        const userChoice = confirm(`Conflict detected for quote: "${localQuote.text}". 
        Local: "${localQuote.category}", Server: "${fetchedQuote.category}". 
        Click OK to keep the server's version, Cancel to keep local version.`);
        
        if (userChoice) {
          // Replace local quote with server quote
          const index = mergedQuotes.indexOf(localQuote);
          mergedQuotes[index] = fetchedQuote;
          notifyUser(`Updated "${localQuote.text}" with server's version.`);
        } else {
          notifyUser(`Kept local version of "${localQuote.text}".`);
        }
      }
    }
  });

  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  filterQuotes();
}

// Notify user with a message
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.top = "10px";
  notification.style.right = "10px";
  notification.style.backgroundColor = "#f8d7da";
  notification.style.color = "#721c24";
  notification.style.padding = "10px";
  notification.style.zIndex = "1000";
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000); // Remove after 5 seconds
}

// Other existing functions (e.g., addQuote, showRandomQuote, filterQuotes, etc.) go here...

// Fetch quotes on load
window.onload = function() {
  populateCategories();
  fetchQuotesFromServer(); // Fetch quotes on page load
};
