
const EVENT_DATE = new Date("2026-10-24T21:00:00-03:00").getTime();
const VIDEO_ID = "UxxajLWwzqY";
const MUSIC_START_SECONDS = 15;

const html = document.documentElement;
const welcome = document.getElementById("welcome");
const invitation = document.getElementById("invitation");
const enterButton = document.getElementById("enterButton");
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

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});

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
      },
      onError() {
        playerReady = false;
      }
    }
  });
};

const youtubeScript = document.createElement("script");
youtubeScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(youtubeScript);

function restartAnimation(element) {
  element.classList.remove("active");
  void element.offsetWidth;
  element.classList.add("active");
}

function triggerWow() {
  const rect = heroBall.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height * 0.48;

  ring.style.left = `${originX}px`;
  ring.style.top = `${originY}px`;
  beams.style.left = `${originX}px`;
  beams.style.top = `${originY}px`;

  restartAnimation(flash);
  restartAnimation(ring);
  restartAnimation(beams);

  welcome.classList.add("blasting");

  launchParticles(originX, originY, 700, true);
  setTimeout(() => launchParticles(originX, originY, 350, true), 170);
  setTimeout(() => launchParticles(originX, originY, 220, false), 390);
}

enterButton.addEventListener("click", () => {
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

document.querySelectorAll(".sparkle-target").forEach(element => {
  element.addEventListener("pointerdown", event => {
    launchParticles(event.clientX, event.clientY, 55, false);
  });
});

document.querySelectorAll("[data-gift]").forEach(button => {
  button.addEventListener("click", () => {
    openGift(button.dataset.gift);
  });
});

function openGift(type) {
  if (type === "transferencia") {
    modalContent.innerHTML = `
      <p class="eyebrow">Transferencia</p>
      <h2 style="font-size:2.4rem">Mi alias</h2>
      <div class="alias">umasilva.mp</div>
      <button id="copyAlias" class="pill-button" type="button">Copiar alias</button>
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

  setTimeout(() => {
    toast.classList.remove("visible");
  }, 1800);
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

    particles.forEach(particle => {
      const previousX = particle.x;
      const previousY = particle.y;

      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed + particle.gravity;
      particle.speed *= wow ? .987 : .982;
      particle.life -= 1;
      particle.twinkle += .22;

      const alpha =
        Math.max(0, particle.life / (wow ? 135 : 90)) *
        (.62 + Math.sin(particle.twinkle) * .38);

      context.globalAlpha = alpha;
      context.fillStyle = "#ffffff";
      context.strokeStyle = "#ffffff";
      context.shadowBlur = wow ? 22 : 14;
      context.shadowColor = "#ffffff";

      if (particle.streak) {
        context.lineWidth = Math.max(1, particle.radius * .55);
        context.beginPath();
        context.moveTo(previousX, previousY);
        context.lineTo(particle.x, particle.y);
        context.stroke();
      } else {
        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );
        context.fill();
      }
    });

    if (particles.some(particle => particle.life > 0)) {
      requestAnimationFrame(draw);
    } else {
      context.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  draw();
}
