
const EVENT_DATE = new Date("2026-10-24T21:00:00-03:00").getTime();
const VIDEO_ID = "UxxajLWwzqY";
const MUSIC_START_SECONDS = 15;

const html = document.documentElement;
const welcome = document.getElementById("welcome");
const invitation = document.getElementById("invitation");
const enterButton = document.getElementById("enterButton");
const enterLabel = document.getElementById("enterLabel");
const heroBall = document.getElementById("heroBall");
const musicToggle = document.getElementById("musicToggle");
const modal = document.getElementById("giftModal");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");
const flash = document.getElementById("flash");
const ring = document.getElementById("ring");
const beams = document.getElementById("beams");

let player = null;
let playerReady = false;
let musicPlaying = false;

window.scrollTo(0, 0);

function updateCountdown() {
  const remaining = Math.max(0, EVENT_DATE - Date.now());

  document.getElementById("days").textContent =
    String(Math.floor(remaining / 86400000)).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("ytPlayer", {
    videoId: VIDEO_ID,
    playerVars: {
      controls: 0,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      start: MUSIC_START_SECONDS,
      origin: location.origin
    },
    events: {
      onReady(event) {
        playerReady = true;
        event.target.mute();
        event.target.cueVideoById({
          videoId: VIDEO_ID,
          startSeconds: MUSIC_START_SECONDS
        });

        enterButton.disabled = false;
        enterLabel.textContent = "Entrar";
      },
      onError() {
        enterButton.disabled = false;
        enterLabel.textContent = "Entrar";
      }
    }
  });
};

const ytScript = document.createElement("script");
ytScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(ytScript);

setTimeout(() => {
  if (enterButton.disabled) {
    enterButton.disabled = false;
    enterLabel.textContent = "Entrar";
  }
}, 7000);

function playAnimation(el) {
  el.classList.remove("active");
  void el.offsetWidth;
  el.classList.add("active");
}

function triggerWow() {
  const rect = heroBall.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height * 0.42;

  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  beams.style.left = `${x}px`;
  beams.style.top = `${y}px`;

  playAnimation(flash);
  playAnimation(ring);
  playAnimation(beams);

  welcome.classList.add("blasting");

  launchParticles(x, y, 650, true);
  setTimeout(() => launchParticles(x, y, 320, true), 170);
  setTimeout(() => launchParticles(x, y, 180, false), 390);
}

enterButton.addEventListener("click", () => {
  if (enterButton.disabled) return;

  triggerWow();

  if (playerReady && player) {
    player.unMute();
    player.seekTo(MUSIC_START_SECONDS, true);
    player.playVideo();
    musicPlaying = true;
    musicToggle.textContent = "❚❚";
  }

  musicToggle.style.display = "grid";

  setTimeout(() => {
    welcome.classList.add("leaving");
  }, 620);

  setTimeout(() => {
    welcome.remove();
    html.classList.remove("locked");
    invitation.setAttribute("aria-hidden", "false");
    invitation.classList.add("ready");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 1650);
});

musicToggle.addEventListener("click", event => {
  launchParticles(event.clientX, event.clientY, 50, false);

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

document.querySelectorAll(".sparkle-target").forEach(el => {
  el.addEventListener("pointerdown", event => {
    launchParticles(event.clientX, event.clientY, 55, false);
  });
});

document.querySelectorAll("[data-gift]").forEach(button => {
  button.addEventListener("click", () => openGift(button.dataset.gift));
});

function openGift(type) {
  if (type === "transferencia") {
    modalContent.innerHTML = `
      <p class="eyebrow">Transferencia</p>
      <h2 style="font-size:2.4rem">Mi alias</h2>
      <div class="alias">umasilva.mp</div>
      <button id="copyAlias" class="pill-button">Copiar alias</button>
    `;
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

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  const copyButton = document.getElementById("copyAlias");

  if (copyButton) {
    copyButton.addEventListener("click", copyAlias);
    copyButton.addEventListener("pointerdown", event => {
      launchParticles(event.clientX, event.clientY, 60, false);
    });
  }
}

function closeGift() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("closeModal").addEventListener("click", closeGift);

modal.addEventListener("click", event => {
  if (event.target === modal) closeGift();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeGift();
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
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 1800);
}

function launchParticles(originX, originY, amount = 80, wow = false) {
  const canvas = document.getElementById("fxCanvas");
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;

  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const particles = Array.from({ length: amount }, () => ({
    x: originX,
    y: originY,
    angle: Math.random() * Math.PI * 2,
    speed: (wow ? 2.8 : 1.4) + Math.random() * (wow ? 14 : 7),
    radius: (wow ? 1.1 : .8) + Math.random() * (wow ? 4.3 : 2.8),
    life: (wow ? 75 : 48) + Math.random() * (wow ? 85 : 52),
    gravity: (wow ? .08 : .18) + Math.random() * (wow ? .34 : .45),
    twinkle: Math.random() * Math.PI * 2,
    streak: wow && Math.random() > .56
  }));

  function draw() {
    context.clearRect(0, 0, innerWidth, innerHeight);

    particles.forEach(p => {
      const oldX = p.x;
      const oldY = p.y;

      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed + p.gravity;
      p.speed *= wow ? .987 : .982;
      p.life -= 1;
      p.twinkle += .22;

      const alpha =
        Math.max(0, p.life / (wow ? 135 : 90)) *
        (.62 + Math.sin(p.twinkle) * .38);

      context.globalAlpha = alpha;
      context.fillStyle = "#fff";
      context.strokeStyle = "#fff";
      context.shadowBlur = wow ? 22 : 14;
      context.shadowColor = "#fff";

      if (p.streak) {
        context.lineWidth = Math.max(1, p.radius * .55);
        context.beginPath();
        context.moveTo(oldX, oldY);
        context.lineTo(p.x, p.y);
        context.stroke();
      } else {
        context.beginPath();
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fill();
      }
    });

    if (particles.some(p => p.life > 0)) {
      requestAnimationFrame(draw);
    } else {
      context.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  draw();
}
