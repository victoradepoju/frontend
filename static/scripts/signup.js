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

// Sign-up validation
document.addEventListener("DOMContentLoaded", function (e) {
  var form = document.querySelector("#signup-form");
  // Add max attribute to birthday input
  var today = new Date();
  var maxDate = today.toISOString().split("T")[0];
  document.querySelector("#signup-birthday").setAttribute("max", maxDate);

  const accountForm = document.getElementById("account-info-form");
  const personalForm = document.getElementById("personal-info-form");
  const continueBtn = document.getElementById("continue-btn");
  const backBtn = document.getElementById("back-btn");

  // Add submit listener to signup form
  form.addEventListener("submit", function (event) {
    var passwordsMatch =
      document.querySelector("#signup-password").value ==
      document.querySelector("#signup-password-repeat").value;
    if (!form.checkValidity() || !passwordsMatch) {
      event.preventDefault();
      event.stopPropagation();
      if (!passwordsMatch)
        document.querySelector("#alertBanner").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    form.classList.add("was-validated");
  });

  continueBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Validate account form before proceeding
    if (true) {
      // Check if passwords match
      const password = document.getElementById("signup-password").value;
      const passwordRepeat = document.getElementById(
        "signup-password-repeat"
      ).value;

      if (password !== passwordRepeat) {
        document.getElementById("alertBanner").classList.remove("hidden");
        // Add shake animation to highlight error
        accountForm.classList.add("animate__animated", "animate__shakeX");
        setTimeout(() => {
          accountForm.classList.remove("animate__animated", "animate__shakeX");
        }, 1000);
        return;
      }

      // Hide password mismatch alert if shown
      document.getElementById("alertBanner").classList.add("hidden");

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

  backBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Smooth transition back to account form
    personalForm.classList.remove("active");

    setTimeout(() => {
      accountForm.classList.remove("prev");
      accountForm.classList.add("active");
    }, 50);
  });

  // Handle form submission
  personalForm.addEventListener("submit", function (e) {
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
    }
  });
});
