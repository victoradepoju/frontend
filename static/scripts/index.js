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
  // Currency conversion functionality - IMPROVED
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

  // Function to format currency with commas and appropriate symbol
  function formatCurrency(amount, currency) {
    // Determine decimal places: 2 for most currencies, 0 for JPY
    const decimalPlaces = currency === "JPY" ? 0 : 2;

    return `${currencySymbols[currency]}${amount.toLocaleString("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })}`;
  }

  // Function to update the displayed balance
  function updateBalance(currency) {
    const balanceElement = document.getElementById("current-balance");
    if (!balanceElement) return; // Ensure element exists
    
    // Get initial balance from the correct element
    const initialBalanceElement = document.getElementById("init-balance");
    if (!initialBalanceElement) return; // Ensure element exists
    
    const initialBalance = parseFloat(initialBalanceElement.textContent) || 0;
    const convertedAmount = initialBalance * exchangeRates[currency];
    balanceElement.textContent = formatCurrency(convertedAmount, currency);
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

$(function () {
  var start = moment().subtract(29, "days");
  var end = moment();

  function cb(start, end) {
    $("#reportRangeInput").html(
      start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
    );
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