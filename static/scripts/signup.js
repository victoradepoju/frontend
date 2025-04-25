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

  // Form sections
  const accountForm = document.getElementById("account-info-form");
  const personalForm = document.getElementById("personal-info-form");

  // Buttons
  const continueBtn = document.getElementById("continue-btn");
  const backBtn = document.getElementById("back-btn");
  const submitBtn = document.querySelector(
    "#personal-info-form button[type='submit']"
  );

  // Alert banner
  const alertBanner = document.getElementById("alertBanner");

  // Form inputs
  const usernameInput = document.querySelector("#signup-username");
  const passwordInput = document.querySelector("#signup-password");
  const passwordRepeatInput = document.querySelector("#signup-password-repeat");
  const firstNameInput = document.querySelector("#signup-firstname");
  const lastNameInput = document.querySelector("#signup-lastname");
  const birthdayInput = document.querySelector("#signup-birthday");
  const timezoneInput = document.querySelector("#timezone");

  // Main form that will be submitted
  const signupForm = document.querySelector("#personal-info-form");

  // Validate passwords match
  function validatePasswords() {
    const passwordsMatch = passwordInput.value === passwordRepeatInput.value;
    if (!passwordsMatch) {
      alertBanner.classList.remove("hidden");
      return false;
    }
    alertBanner.classList.add("hidden");
    return true;
  }

  // Validate account information
  function validateAccountInfo() {
    let isValid = true;

    // Validate username
    if (!usernameInput.checkValidity()) {
      usernameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      usernameInput.classList.remove("is-invalid");
    }

    // Validate password
    if (!passwordInput.checkValidity()) {
      passwordInput.classList.add("is-invalid");
      isValid = false;
    } else {
      passwordInput.classList.remove("is-invalid");
    }

    // Validate password confirmation
    if (!passwordRepeatInput.checkValidity() || !validatePasswords()) {
      passwordRepeatInput.classList.add("is-invalid");
      isValid = false;
    } else {
      passwordRepeatInput.classList.remove("is-invalid");
    }

    return isValid;
  }

  // Validate personal information
  function validatePersonalInfo() {
    let isValid = true;

    // Validate first name
    if (!firstNameInput.checkValidity()) {
      firstNameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      firstNameInput.classList.remove("is-invalid");
    }

    // Validate last name
    if (!lastNameInput.checkValidity()) {
      lastNameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      lastNameInput.classList.remove("is-invalid");
    }

    // Validate birthday
    if (!birthdayInput.checkValidity()) {
      birthdayInput.classList.add("is-invalid");
      isValid = false;
    } else {
      birthdayInput.classList.remove("is-invalid");
    }

    // Validate timezone
    if (!timezoneInput.checkValidity()) {
      timezoneInput.classList.add("is-invalid");
      isValid = false;
    } else {
      timezoneInput.classList.remove("is-invalid");
    }

    return isValid;
  }

  // Handle continue to personal info
  continueBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Validate account information
    if (validateAccountInfo()) {
      // Smooth transition to personal info form
      accountForm.classList.remove("active");
      accountForm.classList.add("prev");

      // Show personal info form with fade-in animation
      setTimeout(() => {
        personalForm.classList.add("active");
      }, 50);
    } else {
      // Show validation errors with animation
      accountForm.classList.add("animate__animated", "animate__shakeX");
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
    // First validate the personal info
    if (!validatePersonalInfo()) {
      e.preventDefault();
      e.stopPropagation();
      personalForm.classList.add("animate__animated", "animate__shakeX");
      setTimeout(() => {
        personalForm.classList.remove("animate__animated", "animate__shakeX");
      }, 1000);
      return;
    }

    // Then validate account info again (in case user went back and changed them)
    if (!validateAccountInfo()) {
      e.preventDefault();
      e.stopPropagation();

      // Switch back to account form to show error
      personalForm.classList.remove("active");
      accountForm.classList.remove("prev");
      accountForm.classList.add("active");

      // Show error and animate
      accountForm.classList.add("animate__animated", "animate__shakeX");
      setTimeout(() => {
        accountForm.classList.remove("animate__animated", "animate__shakeX");
      }, 1000);
      return;
    }

    // If all validations pass, form will submit normally
  });

  // Real-time password matching validation
  [passwordInput, passwordRepeatInput].forEach((field) => {
    field.addEventListener("input", function () {
      if (passwordInput.value && passwordRepeatInput.value) {
        validatePasswords();
      }
    });
  });

  // Real-time validation for other fields
  [
    usernameInput,
    passwordInput,
    passwordRepeatInput,
    firstNameInput,
    lastNameInput,
    birthdayInput,
    timezoneInput,
  ].forEach((input) => {
    input.addEventListener("input", function () {
      if (this.checkValidity()) {
        this.classList.remove("is-invalid");
      }
    });
  });
});
