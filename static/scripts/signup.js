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

document.addEventListener("DOMContentLoaded", function () {
  // Set max date for birthday input
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  document.querySelector("#signup-birthday").setAttribute("max", maxDate);

  // Form elements
  const accountForm = document.getElementById("account-info-form");
  const personalForm = document.getElementById("personal-info-form");
  const continueBtn = document.getElementById("continue-btn");
  const backBtn = document.getElementById("back-btn");
  const alertBanner = document.getElementById("alertBanner");
  const signupForm = document.querySelector("#personal-info-form"); // This is now our main form

  // Password fields
  const passwordField = document.querySelector("#signup-password");
  const passwordRepeatField = document.querySelector("#signup-password-repeat");

  // Validate passwords match
  function validatePasswords() {
    const passwordsMatch = passwordField.value === passwordRepeatField.value;
    if (!passwordsMatch) {
      alertBanner.classList.remove("hidden");
      return false;
    }
    alertBanner.classList.add("hidden");
    return true;
  }

  // Handle continue to personal info
  continueBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Validate account form
    if (accountForm.checkValidity()) {
      // Check if passwords match
      if (!validatePasswords()) {
        // Add shake animation to highlight error
        accountForm.classList.add("animate__animated", "animate__shakeX");
        setTimeout(() => {
          accountForm.classList.remove("animate__animated", "animate__shakeX");
        }, 1000);
        return;
      }

      // Smooth transition to personal info form
      accountForm.classList.remove("active");
      accountForm.classList.add("prev");

      // Show personal info form with fade-in animation
      setTimeout(() => {
        personalForm.classList.add("active");
      }, 50);
    } else {
      // Show validation errors with animation
      accountForm.classList.add(
        "was-validated",
        "animate__animated",
        "animate__shakeX"
      );
      setTimeout(() => {
        accountForm.classList.remove("animate__animated", "animate__shakeX");
      }, 1000);
    }
  });

  // Handle back to account info
  backBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Smooth transition back to account form
    personalForm.classList.remove("active");

    setTimeout(() => {
      accountForm.classList.remove("prev");
      accountForm.classList.add("active");
    }, 50);
  });

  // Handle final form submission
  signupForm.addEventListener("submit", function (e) {
    // First validate the personal info form
    if (!personalForm.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      personalForm.classList.add(
        "was-validated",
        "animate__animated",
        "animate__shakeX"
      );
      setTimeout(() => {
        personalForm.classList.remove("animate__animated", "animate__shakeX");
      }, 1000);
      return;
    }

    // Then validate passwords again (in case user went back and changed them)
    if (!validatePasswords()) {
      e.preventDefault();
      e.stopPropagation();

      // Switch back to account form to show error
      personalForm.classList.remove("active");
      accountForm.classList.remove("prev");
      accountForm.classList.add("active");

      // Show error and animate
      accountForm.classList.add(
        "was-validated",
        "animate__animated",
        "animate__shakeX"
      );
      setTimeout(() => {
        accountForm.classList.remove("animate__animated", "animate__shakeX");
      }, 1000);
      return;
    }

    // If all validations pass, form will submit normally
    personalForm.classList.add("was-validated");
  });

  // Real-time password matching validation
  [passwordField, passwordRepeatField].forEach((field) => {
    field.addEventListener("input", function () {
      if (passwordField.value && passwordRepeatField.value) {
        validatePasswords();
      }
    });
  });
});
