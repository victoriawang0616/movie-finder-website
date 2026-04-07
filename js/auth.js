// =========================================
// AUTH.JS — Login, Register, Logout Logic
// Uses localStorage to save users
// =========================================

// ---------- REGISTER ----------
function registerUser() {
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  const errorMsg = document.getElementById("errorMsg");
  const successMsg = document.getElementById("successMsg");

  errorMsg.classList.add("d-none");
  successMsg.classList.add("d-none");

  if (!username || !email || !password) {
    errorMsg.textContent = "Please fill in all fields.";
    errorMsg.classList.remove("d-none");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    errorMsg.textContent = "Please enter a valid email address.";
    errorMsg.classList.remove("d-none");
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters.";
    errorMsg.classList.remove("d-none");
    return;
  }

  const existingUser = localStorage.getItem("user_" + email);
  if (existingUser) {
    errorMsg.textContent = "An account with this email already exists.";
    errorMsg.classList.remove("d-none");
    return;
  }

  const userData = { username, email, password };
  localStorage.setItem("user_" + email, JSON.stringify(userData));

  successMsg.textContent = "Account created! Redirecting to login...";
  successMsg.classList.remove("d-none");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
}

// ---------- LOGIN ----------
function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const errorMsg = document.getElementById("errorMsg");
  const successMsg = document.getElementById("successMsg");

  errorMsg.classList.add("d-none");
  successMsg.classList.add("d-none");

  if (!email || !password) {
    errorMsg.textContent = "Please fill in all fields.";
    errorMsg.classList.remove("d-none");
    return;
  }

  const storedUser = localStorage.getItem("user_" + email);

  if (!storedUser) {
    errorMsg.textContent = "No account found with this email.";
    errorMsg.classList.remove("d-none");
    return;
  }

  const userData = JSON.parse(storedUser);

  if (userData.password !== password) {
    errorMsg.textContent = "Incorrect password. Please try again.";
    errorMsg.classList.remove("d-none");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(userData));

  successMsg.textContent = "Login successful! Redirecting...";
  successMsg.classList.remove("d-none");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

// ---------- LOGOUT ----------
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
