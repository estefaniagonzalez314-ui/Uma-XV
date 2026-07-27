
const EVENT_DATE = new Date("2026-10-24T21:00:00-03:00").getTime();
const VIDEO_ID = "UxxajLWwzqY";

const enterButton = document.getElementById("enterButton");
const invitation = document.getElementById("invitation");
const musicToggle = document.getElementById("musicToggle");
const modal = document.getElementById("giftModal");
const closeModalButton = document.getElementById("closeModal");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");

let player = null;
let musicPlaying = false;

function updateCountdown() {
  const distance = Math.max(0, EVENT_DATE - Date.now());

  document.getElementById("days").textContent =
    String(Math.floor(distance / 86400000)).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("youtubePlayer", {
    videoId: VIDEO_ID,
    playerVars: {
      controls: 0,
      playsinline: 1,
      rel: 0,
      modestbranding: 1
    }
  });
};

const youtubeScript = document.createElement("script");
youtubeScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(youtubeScript);

enterButton.addEventListener("click", () => {
  launchSparkles();
  invitation.scrollIntoView({ behavior: "smooth" });

  musicToggle.style.display = "grid";

  if (player && player.playVideo) {
    player.playVideo();
    musicPlaying = true;
    musicToggle.textContent = "❚❚";
  }
});

musicToggle.addEventListener("click", () => {
  if (!player) return;

  if (musicPlaying) {
    player.pauseVideo();
    musicToggle.textContent = "♪";
  } else {
    player.playVideo();
    musicToggle.textContent = "❚❚";
  }

  musicPlaying = !musicPlaying;
});

document.querySelectorAll("[data-gift]").forEach(button => {
  button.addEventListener("click", () => openGiftModal(button.dataset.gift));
});

function openGiftModal(type) {
  if (type === "transferencia") {
    modalContent.innerHTML = `
      <p class="eyebrow">Transferencia</p>
      <h2 style="font-size:2.4rem">Mi alias</h2>
      <div class="alias">umasilva.mp</div>
      <button id="copyAliasButton" class="glass-button">Copiar alias</button>
    `;

    setTimeout(() => {
      document.getElementById("copyAliasButton").addEventListener("click", copyAlias);
    }, 0);
  }

  if (type === "sobre") {
    modalContent.innerHTML = `
      <p class="eyebrow">Sobre</p>
      <h2 style="font-size:2.4rem">Durante la fiesta</h2>
      <p class="lead" style="font-size:1.1rem">
        Si lo preferís, habrá un espacio destinado para recibir sobres durante la recepción.
      </p>
    `;
  }

  if (type === "regalo") {
    modalContent.innerHTML = `
      <p class="eyebrow">Regalo tradicional</p>
      <h2 style="font-size:2.4rem">Con mucho cariño</h2>
      <p class="lead" style="font-size:1.1rem">
        Y, por supuesto, cualquier regalo elegido con cariño será más que bienvenido.
      </p>
    `;
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeGiftModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

closeModalButton.addEventListener("click", closeGiftModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeGiftModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeGiftModal();
});

async function copyAlias() {
  try {
    await navigator.clipboard.writeText("umasilva.mp");
    showToast("Alias copiado");
  } catch {
    showToast("Alias: umasilva.mp");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.getElementById("calendarButton").addEventListener("click", () => {
  const calendarText = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20261025T000000Z
DTEND:20261025T080000Z
SUMMARY:Uma XV
LOCATION:Stihmpra, Neuquén
DESCRIPTION:Fiesta de 15 de Uma
END:VEVENT
END:VCALENDAR`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([calendarText], { type: "text/calendar" }));
  link.download = "Uma-XV.ics";
  link.click();
});

function launchSparkles() {
  const canvas = document.getElementById("sparkCanvas");
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  context.scale(ratio, ratio);

  const particles = Array.from({ length: 190 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.55,
    angle: Math.random() * Math.PI * 2,
    speed: 2.2 + Math.random() * 7.5,
    radius: 1 + Math.random() * 3.2,
    life: 75 + Math.random() * 55,
    gravity: 0.6 + Math.random() * 0.5
  }));

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed + particle.gravity;
      particle.speed *= 0.984;
      particle.life -= 1;

      context.globalAlpha = Math.max(0, particle.life / 105);
      context.fillStyle = "#ffffff";
      context.shadowBlur = 12;
      context.shadowColor = "#ffffff";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    if (particles.some(particle => particle.life > 0)) {
      requestAnimationFrame(draw);
    } else {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  draw();
}
