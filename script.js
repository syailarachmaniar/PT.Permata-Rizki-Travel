const WA = "https://wa.me/6281256424430";

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav-links");
const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".dots button")];
const caption = document.querySelector(".hero-caption");
const cards = [...document.querySelectorAll(".package-card")];
const emptyNote = document.querySelector(".empty-note");
const searchForm = document.querySelector("#search-form");
const orderForm = document.querySelector("#order-form");
const formNote = document.querySelector(".form-note");

function waLink(text) {
  return `${WA}?text=${encodeURIComponent(text)}`;
}

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 8);
  const marker = window.scrollY + 120;
  document.querySelectorAll(".nav-links a[href^='#']").forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    if (!section) return;
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    link.classList.toggle("active", marker >= top && marker < bottom);
  });
});

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

let slideIndex = 0;
function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === slideIndex));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === slideIndex));
  caption.textContent = slides[slideIndex].dataset.caption;
}

dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));
setInterval(() => showSlide(slideIndex + 1), 6500);

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.className = "img-fallback";
    fallback.textContent = img.alt || "Permata Rizki";
    img.replaceWith(fallback);
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(searchForm);
  const tujuan = String(data.get("tujuan") || "");
  const tanggal = String(data.get("tanggal") || "");
  const orang = String(data.get("orang") || "");
  let visible = 0;

  cards.forEach((card) => {
    const keys = card.dataset.tujuan.split(" ");
    const show = tujuan === "lainnya" ? false : !tujuan || keys.includes(tujuan);
    card.classList.toggle("is-hidden", !show);
    if (show) visible += 1;
  });

  emptyNote.classList.toggle("show", visible === 0);
  document.querySelector("#paket").scrollIntoView({ behavior: "smooth" });

  const paketSelect = orderForm.querySelector("[name='paket']");
  const matchOption = [...paketSelect.options].find((option) => (option.dataset.key || "").split(" ").includes(tujuan));
  if (matchOption) paketSelect.value = matchOption.value;
  if (tanggal) orderForm.querySelector("[name='tanggal']").value = tanggal;
  if (orang) orderForm.querySelector("[name='orang']").value = orang;
});

orderForm.querySelector("[name='tanggal']").min = new Date().toISOString().slice(0, 10);

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(orderForm);
  const nama = String(data.get("nama")).trim();
  const whatsapp = String(data.get("whatsapp")).trim();
  const paket = String(data.get("paket"));
  const orang = String(data.get("orang"));
  const tanggal = String(data.get("tanggal"));

  if (!nama || !whatsapp || !paket || !orang || !tanggal) {
    formNote.textContent = "Lengkapi semua isian terlebih dahulu.";
    return;
  }

  const message = [
    "Assalamualaikum, saya ingin memesan perjalanan luar negeri di PT. Permata Rizki.",
    "",
    `Nama: ${nama}`,
    `No WhatsApp: ${whatsapp}`,
    `Paket: ${paket}`,
    `Jumlah orang: ${orang}`,
    `Tanggal berangkat: ${tanggal}`,
    "",
    "Mohon info ketersediaan dan cara pendaftaran. Terima kasih."
  ].join("\n");

  formNote.textContent = "";
  window.open(waLink(message), "_blank", "noopener");
});

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = "true";
    const target = Number(entry.target.dataset.count);
    const decimals = Number(entry.target.dataset.decimals || 0);
    const suffix = entry.target.dataset.suffix || "";
    const start = performance.now();
    const duration = 1200;
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * (1 - Math.pow(1 - progress, 3));
      entry.target.textContent = `${value.toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
counters.forEach((counter) => counterObserver.observe(counter));
