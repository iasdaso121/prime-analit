/*
  Взаимодействия:
  — Бургер-меню
  — Параллакс-движение орбов
  — Анимация появления элементов при прокрутке (IntersectionObserver)
  — Подсветка карточек курсором
  — Отправка форм (демо)
*/

// Текущий год в футере
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Бургер-меню для мобильных
(function initBurger() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav-menu");
  if (!burger || !nav) return;
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
    nav.style.display = nav.classList.contains("open") ? "flex" : "";
  });
})();

// Параллакс для фона (по движению курсора + скроллу)
(function initParallax() {
  const layers = Array.from(document.querySelectorAll(".parallax"));
  const move = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || "0.2");
      el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
  };
  window.addEventListener("scroll", move, { passive: true });
  move();

  // Параллакс от курсора (чуть-чуть)
  window.addEventListener("pointermove", (e) => {
    const cx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;
    layers.forEach((el, i) => {
      const s = parseFloat(el.dataset.speed || "0.2");
      el.style.transform += ` translate(${cx * s * 10}px, ${cy * s * 10}px)`;
    });
  });
})();

// Intersection Observer для появления элементов
(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
})();

// Подсветка/свечения на карточках при движении курсора
(function initCardHoverLight() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    });
  });
})();

// Демонстрационная обработка форм — без бэкенда
window.handleFormSubmit = function (evt) {
  evt.preventDefault();
  const form = evt.target;
  const data = Object.fromEntries(new FormData(form).entries());
  console.log("Form data →", data);
  alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
  form.reset();
  return false;
};
