/**
 * Zappy - Autenticação
 * Gerencia a troca de painéis e simula o login/registro.
 */

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");


sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Simulação de Redirecionamento
const handleAuth = (e) => {
  e.preventDefault();
  console.log("Autenticando...");

  // Simula salvamento de sessão
  sessionStorage.setItem('zappy_auth', 'true');

  // Redireciona para o chat principal
  // Como estamos em src/auth/index.html, o chat está em ../index.html
  window.location.href = "../index.html";
};

if (loginForm) loginForm.addEventListener("submit", handleAuth);
if (signupForm) signupForm.addEventListener("submit", handleAuth);
