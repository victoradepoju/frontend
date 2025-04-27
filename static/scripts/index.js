/*
 * Copyright 2023 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

document.addEventListener("DOMContentLoaded", function (event) {
  const exchangeRates = {
    NGN: 1,
    USD: 0.00065, 
    EUR: 0.0006, 
    GBP: 0.00052, 
    JPY: 0.098,
    CNY: 0.0047, 
  };

  const currencySymbols = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
  };


  function formatCurrency(intAmount, currency = "NGN") {
    if (intAmount === null || intAmount === undefined) {
      return `${currencySymbols[currency]}---`;
    }
    
    // The last two digits are decimal places, so divide by 100
    const decimalAmount = Math.abs(intAmount) / 100;
    
    // Format with locale and 2 decimal places
    const formattedAmount = decimalAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Add negative sign if needed
    const sign = intAmount < 0 ? "-" : "";
    
    // Return formatted string with appropriate currency symbol
    return `${sign}${currencySymbols[currency]}${formattedAmount}`;
  }

  function formatCurrencyWithConversion(intAmount, currency) {
    if (intAmount === null || intAmount === undefined) {
      return `${currencySymbols[currency]}---`;
    }
    
    // Convert to decimal (divide by 100 since the last two digits are decimals)
    const amountInNaira = intAmount / 100;
    
    // Convert to target currency
    const convertedAmount = amountInNaira * exchangeRates[currency];
    
    // For JPY, no decimals; for others, 2 decimals
    const decimalPlaces = currency === "JPY" ? 0 : 2;
    
    // Format with locale and appropriate decimal places
    const formattedAmount = Math.abs(convertedAmount).toLocaleString("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
    
    // Add negative sign if needed
    const sign = intAmount < 0 ? "-" : "";
    
    // Return formatted string with appropriate currency symbol
    return `${sign}${currencySymbols[currency]}${formattedAmount}`;
  }

  // Function to update the displayed balance
  function updateBalance(currency) {
    const balanceElement = document.getElementById("current-balance");
    if (!balanceElement) return; // Ensure element exists
    
    // Get initial balance from the correct element
    const initialBalanceElement = document.getElementById("init-balance");
    if (!initialBalanceElement) return; // Ensure element exists
    
    // Parse as integer since we're treating it as kobo (smallest currency unit)
    const initialBalance = parseInt(initialBalanceElement.textContent) || 0;
    
    // Format and display the converted currency
    balanceElement.textContent = formatCurrencyWithConversion(initialBalance, currency);
  }

  // Add event listener to the currency dropdown
  const currencyDropdown = document.getElementById("currency-dropdown");
  if (currencyDropdown) {
    currencyDropdown.addEventListener("change", function () {
      updateBalance(this.value);
    });
    
    // Initialize with Naira (default) on page load
    updateBalance("NGN");
  }

  // Deposit modal client-side validation
  var depositForm = document.querySelector("#deposit-form");
  if (depositForm) {
    depositForm.addEventListener("submit", function (e) {
      var isNewAcct = document.querySelector("#accounts").value == "add";
      document.querySelector("#external_account_num").required = isNewAcct;
      document.querySelector("#external_routing_num").required = isNewAcct;

      if (
        !depositForm.checkValidity() ||
        document.querySelector("#deposit-amount").value <= 0.0
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
      depositForm.classList.add("was-validated");
    });

    // Reset form on cancel event
    document.querySelectorAll(".deposit-cancel").forEach((depositCancel) => {
      depositCancel.addEventListener("click", function () {
        depositForm.reset();
        depositForm.classList.remove("was-validated");
        RefreshModals();
      });
    });
  }

  // Send payment modal client-side validation
  var paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", function (e) {
      // Check if account number is required
      document.querySelector("#contact_account_num").required =
        document.querySelector("#payment-accounts").value == "add";

      if (
        !paymentForm.checkValidity() ||
        document.querySelector("#payment-amount").value <= 0.0
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
      paymentForm.classList.add("was-validated");
    });

    // Reset form on cancel event
    document.querySelectorAll(".payment-cancel").forEach((paymentCancel) => {
      paymentCancel.addEventListener("click", function () {
        paymentForm.reset();
        paymentForm.classList.remove("was-validated");
        RefreshModals();
      });
    });
  }

  // Handle new account option in Send Payment modal
  const paymentAccounts = document.querySelector("#payment-accounts");
  if (paymentAccounts) {
    paymentAccounts.addEventListener("change", function (e) {
      RefreshModals();
    });
  }

  // Handle new account option in Deposit modal
  const accounts = document.querySelector("#accounts");
  if (accounts) {
    accounts.addEventListener("change", function (e) {
      RefreshModals();
    });
  }

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // Reset Modals to proper state
  function RefreshModals() {
    const paymentAccounts = document.querySelector("#payment-accounts");
    const otherAccountInputs = document.querySelector("#otherAccountInputs");
    
    if (paymentAccounts && otherAccountInputs) {
      paymentSelection = paymentAccounts.value;
      if (paymentSelection == "add") {
        otherAccountInputs.classList.remove("hidden");
      } else {
        otherAccountInputs.classList.add("hidden");
      }
    }
    
    const accounts = document.querySelector("#accounts");
    const otherDepositInputs = document.querySelector("#otherDepositInputs");
    
    if (accounts && otherDepositInputs) {
      depositSelection = accounts.value;
      if (depositSelection == "add") {
        otherDepositInputs.classList.remove("hidden");
      } else {
        otherDepositInputs.classList.add("hidden");
      }
    }
    
    // generate new uuids
    const paymentUuid = document.querySelector("#payment-uuid");
    const depositUuid = document.querySelector("#deposit-uuid");
    
    if (paymentUuid) paymentUuid.value = uuidv4();
    if (depositUuid) depositUuid.value = uuidv4();
  }
  
  RefreshModals();
});

// Debug function to check if elements exist and events are binding
function debugChatbot() {
  console.log("Debugging chatbot initialization...");
  
  // Check if button exists
  const chatButton = document.getElementById('chatbot-button');
  console.log("Chat button exists:", !!chatButton);
  
  // Check if modal exists
  const chatModal = document.getElementById('chatbotModal');
  console.log("Chat modal exists:", !!chatModal);
  
  // Check jQuery and Bootstrap
  console.log("jQuery loaded:", typeof $ !== 'undefined');
  console.log("Bootstrap modal plugin loaded:", typeof $.fn.modal !== 'undefined');
  
  // Log button properties
  if (chatButton) {
    console.log("Button visibility:", window.getComputedStyle(chatButton).display);
    console.log("Button position:", chatButton.getBoundingClientRect());
    
    // Force a click handler for testing
    chatButton.addEventListener('click', function() {
      console.log("Direct click handler fired");
      if (chatModal && typeof $.fn.modal !== 'undefined') {
        $('#chatbotModal').modal('show');
      } else {
        alert("Chat functionality is currently unavailable");
      }
    });
  }
}

// Our improved chatbot initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM content loaded event fired");
  
  // First run the debugger
  debugChatbot();
  
  // Wait a bit and try again to catch any delayed loading issues
  setTimeout(debugChatbot, 1000);
  
  // Direct approach without waiting for jQuery
  const chatButton = document.getElementById('chatbot-button');
  if (chatButton) {
    chatButton.addEventListener('click', function(e) {
      console.log("Chat button clicked via direct event listener");
      e.preventDefault();
      e.stopPropagation();
      
      const chatModal = document.getElementById('chatbotModal');
      if (chatModal) {
        if (typeof $ !== 'undefined' && typeof $.fn.modal !== 'undefined') {
          $('#chatbotModal').modal('show');
        } else {
          // Fallback to showing the modal without Bootstrap
          chatModal.style.display = 'block';
        }
      }
    });
  }
  
  // Add a backup global click handler
  document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'chatbot-button' || e.target.closest('#chatbot-button'))) {
      console.log("Chat button clicked via global click listener");
      const chatModal = document.getElementById('chatbotModal');
      if (chatModal && typeof $ !== 'undefined' && typeof $.fn.modal !== 'undefined') {
        $('#chatbotModal').modal('show');
      }
    }
  });
  
  // Wait for jQuery and Bootstrap before setting up the rest of the chatbot
  function waitForBootstrap() {
    if (typeof $ !== 'undefined' && typeof $.fn.modal !== 'undefined') {
      console.log("jQuery and Bootstrap modal plugin loaded, initializing chatbot");
      initializeChatbot();
    } else {
      console.log("Waiting for jQuery and Bootstrap...");
      setTimeout(waitForBootstrap, 100);
    }
  }

  function initializeChatbot() {
    // Initialize chatbot modal the jQuery way
    $('#chatbot-button').off('click').on('click', function() {
      console.log("Chat button clicked via jQuery handler");
      $('#chatbotModal').modal('show');
      setTimeout(() => {
        const messages = document.getElementById('chatbot-messages');
        if (messages) messages.scrollTop = messages.scrollHeight;
      }, 100);
    });

    // Handle sending messages
    $('#chatbot-send').click(function() {
      sendChatbotMessage();
    });

    $('#chatbot-input').keypress(function(e) {
      if (e.which === 13) {
        sendChatbotMessage();
      }
    });

    function sendChatbotMessage() {
      const input = document.getElementById('chatbot-input');
      const message = input.value.trim();
      
      if (message === '') return;
      
      // Add user message to chat
      addChatMessage('You', message, false);
      
      // Clear input
      input.value = '';
      
      // Show loading indicator
      $('#chatbot-loading').removeClass('d-none');
      
      // Simulate response delay (this would be an API call in production)
      setTimeout(() => {
        // Hide loading indicator
        $('#chatbot-loading').addClass('d-none');
        
        // Add bot response
        processUserQuery(message);
      }, 700);
    }

    function addChatMessage(sender, content, isBot) {
      const messagesContainer = document.getElementById('chatbot-messages');
      
      const messageDiv = document.createElement('div');
      messageDiv.className = isBot ? 
        'chatbot-message chatbot-response' : 
        'chatbot-message user-message';
      
      let avatarIcon = isBot ? 'account_circle' : 'person';
      
      messageDiv.innerHTML = `
        <div class="chatbot-avatar">
          <span class="material-icons">${avatarIcon}</span>
        </div>
        <div class="chatbot-text">
          <div class="chatbot-name">${sender}</div>
          <div class="chatbot-content">${content}</div>
        </div>
      `;
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function processUserQuery(query) {
      // Simple example responses - in a real app, this would connect to a backend
      const lowercaseQuery = query.toLowerCase();
      
      let response = "I'm sorry, I don't have information about that. Try asking about your transactions or account.";
      
      if (lowercaseQuery.includes('largest') || lowercaseQuery.includes('biggest')) {
        response = "Your largest transaction in the past month was a debit of ₦45,000.00 to account 1234567890 on April 15th.";
      } else if (lowercaseQuery.includes('balance')) {
        const balance = document.getElementById('current-balance').textContent;
        response = `Your current account balance is ${balance}.`;
      } else if (lowercaseQuery.includes('amazon') || lowercaseQuery.includes('transaction')) {
        response = "I found 3 transactions related to Amazon in the past 30 days totaling ₦12,500.00.";
      } else if (lowercaseQuery.includes('help') || lowercaseQuery.includes('what can you do')) {
        response = "I can help you analyze your transaction history. Try asking questions like 'What was my largest expense last month?' or 'Show transactions to [merchant name]'.";
      }
      
      addChatMessage('Transaction Assistant', response, true);
    }
  }

  // Start waiting for Bootstrap to load
  waitForBootstrap();
});

// Add a script load event to ensure everything is loaded
window.addEventListener('load', function() {
  console.log("Window fully loaded");
  debugChatbot();
});