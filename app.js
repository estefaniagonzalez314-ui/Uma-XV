
const EVENT_DATE = new Date("2026-10-24T21:00:00-03:00").getTime();
const VIDEO_ID = "UxxajLWwzqY";

const enterButton = document.getElementById("enterButton");
const invitation = document.getElementById("invitation");
const musicToggle = document.getElementById("musicToggle");
const modal = document.getElementById("giftModal");
const closeModalButton = document.getElementById("closeModal");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");
const transitionVeil = document.getElementById("transitionVeil");

let player = null;
let musicPlaying = false;
let playerReady = false;

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
      modestbranding: 1,
      preload: "auto"
    },
    events: {
      onReady: event => {
        playerReady = true;
        event.target.mute();
        event.target.cueVideoById(VIDEO_ID);
      }
    }
  });
};

const youtubeScript = document.createElement("script");
youtubeScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(youtubeScript);

enterButton.addEventListener("click", async event => {
  launchSparkles(event.clientX || innerWidth / 2, event.clientY || innerHeight / 2, 220);
  transitionVeil.classList.add("active");

  musicToggle.style.display = "grid";

  if (playerReady && player && player.playVideo) {
    player.unMute();
    player.seekTo(0, true);
    player.playVideo();
    musicPlaying = true;
    musicToggle.textContent = "❚❚";
  }

  setTimeout(() => {
    invitation.scrollIntoView({ behavior: "smooth" });
  }, 350);

  setTimeout(() => {
    transitionVeil.classList.remove("active");
  }, 950);
});

musicToggle.addEventListener("click", event => {
  launchSparkles(event.clientX, event.clientY, 55);

  if (!playerReady || !player) return;

  if (musicPlaying) {
    player.pauseVideo();
    musicToggle.textContent = "♪";
  } else {
    player.playVideo();
    musicToggle.textContent = "❚❚";
  }

  musicPlaying = !musicPlaying;
});

document.querySelectorAll(".sparkle-trigger").forEach(element => {
  element.addEventListener("pointerdown", event => {
    launchSparkles(event.clientX, event.clientY, 48);
  });
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
      <button id="copyAliasButton" class="glass-button sparkle-trigger">Copiar alias</button>
    `;

    requestAnimationFrame(() => {
      const copyButton = document.getElementById("copyAliasButton");
      copyButton.addEventListener("pointerdown", event => {
        launchSparkles(event.clientX, event.clientY, 55);
      });
      copyButton.addEventListener("click", copyAlias);
    });
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

  modal.style.display = "grid";
  requestAnimationFrame(() => modal.classList.add("show"));
  modal.setAttribute("aria-hidden", "false");
}

function closeGiftModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    modal.style.display = "none";
  }, 420);
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

function launchSparkles(originX, originY, amount = 70) {
  const canvas = document.getElementById("sparkCanvas");
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const particles = Array.from({ length: amount }, () => ({
    x: originX,
    y: originY,
    angle: Math.random() * Math.PI * 2,
    speed: 1.4 + Math.random() * 6.8,
    radius: .8 + Math.random() * 2.8,
    life: 48 + Math.random() * 52,
    gravity: .18 + Math.random() * .45,
    twinkle: Math.random() * Math.PI * 2
  }));

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed + particle.gravity;
      particle.speed *= .982;
      particle.life -= 1;
      particle.twinkle += .18;

      context.globalAlpha = Math.max(0, particle.life / 90) * (.65 + Math.sin(particle.twinkle) * .35);
      context.fillStyle = "#ffffff";
      context.shadowBlur = 14;
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
