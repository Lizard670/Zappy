/**
 * Zappy - Autenticação
 * Gerencia a troca de painéis e simula o login/registro.
 */

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

// Troca de painéis
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Mock de Autenticação
const doLogin = (e) => {
  if (e) e.preventDefault();

  try {
    localStorage.setItem('zappy_auth', 'true');
    // Redirecionamento forçado com sinal de hash para compatibilidade file://
    const target = "../index.html#auth";
    window.location.href = target;
  } catch (err) {
    alert("Erro ao salvar sessão: " + err.message);
  }
};


if (loginForm) {
  loginForm.addEventListener("submit", doLogin);
}
if (signupForm) {
  signupForm.addEventListener("submit", doLogin);
}


document.querySelectorAll('input[type="submit"]').forEach(btn => {
  btn.addEventListener("click", (e) => {
    doLogin(e);
  });
