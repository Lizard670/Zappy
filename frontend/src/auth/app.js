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
const handleLogin = (e) => {
  if (e) e.preventDefault();

  try {
    localStorage.setItem('zappy_auth', 'true');
    const target = "../index.html#auth";
    window.location.href = target;
  } catch (err) {
    alert("Erro ao salvar sessão: " + err.message);
  }
};

const handleSignup = (e) => {
  if (e) e.preventDefault();

  const username = signupForm.querySelector('input[placeholder="Nome de usuário"]').value;
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;

  const validatedData = {
    user: {
      username: username,
      email: email,
      password: password
    },
    bio: "", // Placeholder para o modelo Usuario
    caminho_foto: null // Placeholder para o modelo Usuario
  };

  console.log("[Zappy Auth] validated_data:", validatedData);

  try {
    localStorage.setItem('zappy_auth', 'true');
    const target = "../index.html#auth";
    window.location.href = target;
  } catch (err) {
    alert("Erro ao salvar sessão: " + err.message);
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
}

document.querySelectorAll('.sign-in-form .btn').forEach(btn => {
  btn.addEventListener("click", handleLogin);
});

document.querySelectorAll('.sign-up-form .btn').forEach(btn => {
  btn.addEventListener("click", handleSignup);
});
