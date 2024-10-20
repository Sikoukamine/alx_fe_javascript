let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Fetch quotes from server periodically
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example API

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const fetchedQuotes = data.map(item => ({
      text: item.title, // Adjust based on your structure
      category: 'General' // Default category or derive from data if possible
    }));

    syncWithServer(fetchedQuotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
  }
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

// Add new quote
async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory
  };

  // Save the new quote to local storage first
  quotes.push(newQuote);
  saveQuotes(); // Your existing function to save quotes to local storage

  // Now, post the new quote to the server
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newQuote)
    });

    if (response.ok) {
      const postedQuote = await response.json();
      notifyUser(`Quote added successfully: "${postedQuote.title}"`);
    } else {
      console.error('Error posting quote:', response.statusText);
      notifyUser(`Failed to add quote: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error posting quote:', error);
    notifyUser(`Failed to add quote: ${error.message}`);
  }

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Fetch quotes on load
window.onload = function() {
  populateCategories();
  fetchQuotesFromServer(); // Fetch quotes on page load
};
