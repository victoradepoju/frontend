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
document.addEventListener("DOMContentLoaded", function(e) {
  var form = document.querySelector("#signup-form");
  // Add max attribute to birthday input
  var today = new Date();
  var maxDate = today.toISOString().split("T")[0];
  document.querySelector("#signup-birthday").setAttribute("max", maxDate);

  const step1Form = document.getElementById('signup-form-step1');
  const step2Form = document.getElementById('signup-form-step2');
  const nextBtn = document.getElementById('next-step-btn');
  const prevBtn = document.getElementById('prev-step-btn');
  const step1Indicator = document.getElementById('step1-indicator');
  const step2Indicator = document.getElementById('step2-indicator');



  // Add submit listener to signup form
  form.addEventListener("submit", function(event) {
    var passwordsMatch = document.querySelector("#signup-password").value == document.querySelector("#signup-password-repeat").value;
    if (!form.checkValidity() || !passwordsMatch) {
      event.preventDefault();
      event.stopPropagation();
      if (!passwordsMatch) document.querySelector("#alertBanner").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    form.classList.add("was-validated");
  });


  nextBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Validate step 1 before proceeding
    if (step1Form.checkValidity()) {
      // Check if passwords match
      const password = document.getElementById('signup-password').value;
      const passwordRepeat = document.getElementById('signup-password-repeat').value;
      
      if (password !== passwordRepeat) {
        document.getElementById('alertBanner').classList.remove('hidden');
        return;
      }
      
      // Hide password mismatch alert if shown
      document.getElementById('alertBanner').classList.add('hidden');
      
      // Proceed to step 2
      step1Form.classList.remove('active');
      step1Form.classList.add('prev');
      step2Form.classList.add('active');
      
      // Update step indicators
      step1Indicator.classList.remove('active');
      step1Indicator.classList.add('completed');
      step2Indicator.classList.add('active');
    } else {
      // Show validation errors
      step1Form.classList.add('was-validated');
    }
  });
  
  prevBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Go back to step 1
    step2Form.classList.remove('active');
    step1Form.classList.add('active');
    step1Form.classList.remove('prev');
    
    // Update step indicators
    step2Indicator.classList.remove('active');
    step1Indicator.classList.add('active');
    step1Indicator.classList.remove('completed');
  });
  
  // Handle form submission (step 2)
  step2Form.addEventListener('submit', function(e) {
    if (!step2Form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      step2Form.classList.add('was-validated');
    }
  });
});