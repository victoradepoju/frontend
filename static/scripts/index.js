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
      maximumFractionDigits: 2,
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
      maximumFractionDigits: decimalPlaces,
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
    balanceElement.textContent = formatCurrencyWithConversion(
      initialBalance,
      currency
    );
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

  // Initialize chatbot functionality
  initializeChatbot();
});

$(function () {
  var start = moment().subtract(29, "days");
  var end = moment();

  function cb(start, end) {
    $("#reportRangeInput").html(
      start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
    );

    // Reset to first page when date range changes
    currentPage = 1;
    initializePagination();
  }

  $("#reportrange").daterangepicker(
    {
      startDate: start,
      endDate: end,
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
    },
    cb
  );

  cb(start, end);
});

// Add download button click handler
document
  .querySelector(".download-button")
  .addEventListener("click", downloadTransactionReport);

async function downloadTransactionReport() {
  const dateRange = $("#reportrange").data("daterangepicker");
  const startDate = dateRange.startDate.format("YYYY-MM-DD");
  const endDate = dateRange.endDate.format("YYYY-MM-DD");

  console.log("Start Date:", startDate, "End Date:", endDate);

  // Get account ID from the page
  const accountId = document
    .querySelector(".account-number")
    .textContent.trim();

  // Show loading state
  const downloadButton = document.querySelector(".download-button");
  const originalContent = downloadButton.innerHTML;
  downloadButton.innerHTML = `
    <div class="spinner-border spinner-border-sm" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    Downloading...
  `;
  downloadButton.disabled = true;

  try {
    const response = await fetch(
      "http://34.72.19.177:4002/api/generate/summary",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify({
          accountid: accountId,
          from: startDate,
          to: endDate,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Report generation failed: ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();

    // Validate blob is PDF
    if (blob.type !== "application/pdf") {
      throw new Error("Invalid response format");
    }

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transaction-report-${startDate}-to-${endDate}.pdf`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading report:", error);
    showNotification(
      "Error downloading transaction report. Please try again later.",
      "error"
    );
  } finally {
    // Reset button state
    downloadButton.innerHTML = originalContent;
    downloadButton.disabled = false;
  }
}

// Handle dropdown menus
$(document).on("click", ".actions-dropdown .material-icons", function (e) {
  e.stopPropagation(); // Prevents the click from bubbling up
  $(".dropdown-content").not($(this).siblings(".dropdown-content")).hide(); // Hide other dropdowns
  $(this).siblings(".dropdown-content").toggle(); // Toggle this dropdown
});

// Close dropdowns when clicking outside
$(document).click(function () {
  $(".dropdown-content").hide();
});

function initializeChatbot() {
  console.log("Initializing chatbot functionality");

  const chatButton = document.getElementById("chatbot-button");
  const chatModal = document.getElementById("chatbotModal");

  if (!chatButton || !chatModal) {
    console.error("Chatbot elements not found!");
    return;
  }

  chatModal.setAttribute("data-is-open", "false");

  chatButton.removeEventListener("click", handleChatButtonClick);
  chatButton.addEventListener("click", handleChatButtonClick);

  function handleChatButtonClick(e) {
    console.log("Chat button clicked");
    e.preventDefault();
    showChatModal();
  }

  function showChatModal() {
    console.log("Showing modal manually");
    chatModal.style.display = "block";
    chatModal.classList.add("show");
    document.body.classList.add("modal-open");
    chatModal.setAttribute("data-is-open", "true");

    if (!document.querySelector(".modal-backdrop")) {
      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      document.body.appendChild(backdrop);
    }

    // Scroll messages to bottom
    setTimeout(() => {
      const messages = document.getElementById("chatbot-messages");
      if (messages) messages.scrollTop = messages.scrollHeight;
    }, 100);
  }

  // Add close handlers for all close buttons
  const closeButtons = chatModal.querySelectorAll('[data-dismiss="modal"]');
  closeButtons.forEach((button) => {
    button.removeEventListener("click", closeChatModalManually);
    button.addEventListener("click", closeChatModalManually);
  });

  // Close modal when clicking outside
  chatModal.removeEventListener("click", handleModalBackdropClick);
  chatModal.addEventListener("click", handleModalBackdropClick);

  function handleModalBackdropClick(e) {
    if (e.target === chatModal) {
      closeChatModalManually();
    }
  }

  function closeChatModalManually() {
    console.log("Closing modal manually");
    chatModal.style.display = "none";
    chatModal.classList.remove("show");
    document.body.classList.remove("modal-open");
    chatModal.setAttribute("data-is-open", "false");

    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
  }

  setupChatInteraction();
}

function setupChatInteraction() {
  console.log("Setting up chat interaction");

  const sendButton = document.getElementById("chatbot-send");
  const chatInput = document.getElementById("chatbot-input");

  if (!sendButton || !chatInput) {
    console.error("Chat interaction elements not found!");
    return;
  }

  // Remove existing listeners to prevent duplicates
  sendButton.removeEventListener("click", sendChatbotMessage);
  sendButton.addEventListener("click", sendChatbotMessage);

  chatInput.removeEventListener("keypress", handleChatInputKeypress);
  chatInput.addEventListener("keypress", handleChatInputKeypress);

  function handleChatInputKeypress(e) {
    if (e.key === "Enter" || e.which === 13) {
      e.preventDefault();
      sendChatbotMessage();
    }
  }

  function sendChatbotMessage() {
    const message = chatInput.value.trim();

    if (message === "") return;

    // Add user message to chat
    addChatMessage("You", message, false);

    // Clear input
    chatInput.value = "";

    // Show loading indicator
    const loadingIndicator = document.getElementById("chatbot-loading");
    if (loadingIndicator) loadingIndicator.classList.remove("d-none");

    // Simulate response delay
    setTimeout(() => {
      // Hide loading indicator
      if (loadingIndicator) loadingIndicator.classList.add("d-none");

      // Add bot response
      processUserQuery(message);
    }, 700);
  }
}

function addChatMessage(sender, content, isBot) {
  const messagesContainer = document.getElementById("chatbot-messages");
  if (!messagesContainer) {
    console.error("Chat messages container not found!");
    return;
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = isBot
    ? "chatbot-message chatbot-response"
    : "chatbot-message user-message";

  let avatarIcon = isBot ? "account_circle" : "person";

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
  // Simple example responses
  const lowercaseQuery = query.toLowerCase();

  let response =
    "I'm sorry, I don't have information about that. Try asking about your transactions or account.";

  if (
    lowercaseQuery.includes("largest") ||
    lowercaseQuery.includes("biggest")
  ) {
    response =
      "Your largest transaction in the past month was a debit of ₦45,000.00 to account 1234567890 on April 15th.";
  } else if (lowercaseQuery.includes("balance")) {
    const balance =
      document.getElementById("current-balance")?.textContent || "unknown";
    response = `Your current account balance is ${balance}.`;
  } else if (
    lowercaseQuery.includes("amazon") ||
    lowercaseQuery.includes("transaction")
  ) {
    response =
      "I found 3 transactions related to Amazon in the past 30 days totaling ₦12,500.00.";
  } else if (
    lowercaseQuery.includes("help") ||
    lowercaseQuery.includes("what can you do")
  ) {
    response =
      "I can help you analyze your transaction history. Try asking questions like 'What was my largest expense last month?' or 'Show transactions to [merchant name]'.";
  }

  addChatMessage("Transaction Assistant", response, true);
}

// Make sure to initialize when the document is fully loaded
window.addEventListener("load", function () {
  console.log(
    "Window fully loaded - initializing chatbot again to ensure it's ready"
  );
  initializeChatbot();
});

async function downloadReceipt(transactionId, element) {
  // Prevent default link behavior
  event.preventDefault();

  // Get elements
  const receiptIcon = element.querySelector(".receipt-icon");
  const receiptText = element.querySelector(".receipt-text");
  const spinner = element.querySelector(".receipt-spinner");

  // Show loading state
  receiptIcon.style.display = "none";
  receiptText.style.display = "none";
  spinner.style.display = "inline-block";

  try {
    // Make API request with CORS headers
    const response = await fetch(
      `http://34.72.19.177:4002/api/generate/receipt?id=${transactionId}`,
      {
        method: "POST",
        mode: "cors", // Enable CORS
        credentials: "same-origin",
        headers: {
          Accept: "application/pdf",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Receipt generation failed: ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();

    // Validate blob is PDF
    if (blob.type !== "application/pdf") {
      throw new Error("Invalid response format");
    }

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${transactionId}.pdf`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading receipt:", error);

    // Show specific error message based on error type
    let errorMessage = "Error downloading receipt. Please try again later.";
    if (error.message.includes("CORS")) {
      errorMessage = "Server connection error. Please contact support.";
    }

    showNotification(errorMessage, "error");
  } finally {
    // Reset UI state
    receiptIcon.style.display = "inline-block";
    receiptText.style.display = "inline-block";
    spinner.style.display = "none";
  }
}

// Helper function to show notifications
function showNotification(message, type = "error") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;

  document
    .querySelector("main.container")
    .insertAdjacentElement("afterbegin", alertDiv);

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Pagination functionality
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let transactionRows = [];

function initializePagination() {
  // Clear any existing event listeners
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");

  // Remove old event listeners
  const newPrevButton = prevButton.cloneNode(true);
  const newNextButton = nextButton.cloneNode(true);
  prevButton.parentNode.replaceChild(newPrevButton, prevButton);
  nextButton.parentNode.replaceChild(newNextButton, nextButton);

  // Get all transaction rows and calculate total pages
  transactionRows = Array.from(
    document.querySelectorAll("#transaction-list tr")
  );
  const totalPages = Math.max(
    1,
    Math.ceil(transactionRows.length / ITEMS_PER_PAGE)
  );

  // Reset current page if it's beyond the total pages
  currentPage = Math.min(currentPage, totalPages);

  // Update total pages display
  document.getElementById("total-pages").textContent = totalPages;

  // Add event listeners to pagination controls
  newPrevButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });

  newNextButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
    }
  });

  // Initial pagination update
  updatePagination();
}

function updatePagination() {
  // Calculate indexes and total pages
  const totalPages = Math.max(
    1,
    Math.ceil(transactionRows.length / ITEMS_PER_PAGE)
  );
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, transactionRows.length);

  // Update current page display
  document.getElementById("current-page").textContent = currentPage;

  // Update pagination button states
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");

  prevButton.classList.toggle("disabled", currentPage <= 1);
  nextButton.classList.toggle("disabled", currentPage >= totalPages);

  // Hide all rows first
  transactionRows.forEach((row) => (row.style.display = "none"));

  // Show only rows for current page
  for (let i = startIdx; i < endIdx; i++) {
    if (transactionRows[i]) {
      transactionRows[i].style.display = "";
    }
  }
}

// Initialize pagination when document is loaded
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("transaction-list")) {
    initializePagination();
  }
});

// Add this to the existing daterangepicker callback to handle pagination after date changes
$("#reportrange").on("apply.daterangepicker", function (ev, picker) {
  // After loading new transactions
  initializePagination();
});
