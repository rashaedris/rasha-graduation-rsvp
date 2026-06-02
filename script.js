/*
  عدّلي تفاصيل المناسبة من هنا.

  RSVP_ENDPOINT:
  ضعي رابط Google Apps Script هنا بعد نشره.
  إذا تركتيه فارغًا، سيعمل الموقع كتجربة فقط وسيحفظ الردود داخل متصفح الضيف نفسه، وليس عندك.
*/
const SITE_CONFIG = {
  graduateName: "رشا إدريس",
  heroCopy: "يسعدنا حضوركم ومشاركتكم هذه المناسبة الجميلة للاحتفال بتخرّج رشا، بعد رحلة تعب واجتهاد ونجاح.",
  eventDateText: "السبت، ٦ يونيو ٢٠٢٦",
  eventTimeText: "سيتم تأكيد الوقت قريبًا",
  eventLocationText: "سيتم تأكيد المكان قريبًا",
  dressCodeText: "لباس أنيق، ولمسات باللون الأخضر مرحّب بها",
  storyText: "نود أن تشاركونا هذه المناسبة الخاصة في أجواء مليئة بالحب، الصور، الضحكات، والذكريات الجميلة. يرجى كتابة الاسم أدناه للتحقق من الدعوة ثم تأكيد الحضور.",

  /*
    إذا أردتِ تغيير وقت العدّ التنازلي، عدّلي الوقت هنا.
    الصيغة: YYYY-MM-DDTHH:mm:ss
  */
  eventDateISO: "2026-06-06T18:00:00",

  /*
    ضعي رابط Google Apps Script Web App هنا لاحقًا.
    مثال:
    "https://script.google.com/macros/s/AKfycb.../exec"
  */
  RSVP_ENDPOINT: ""
};

const $ = (selector) => document.querySelector(selector);

const els = {
  graduateName: $("#graduateName"),
  heroCopy: $("#heroCopy"),
  eventDateText: $("#eventDateText"),
  eventTimeText: $("#eventTimeText"),
  eventLocationText: $("#eventLocationText"),
  dressCodeText: $("#dressCodeText"),
  storyText: $("#storyText"),
  guestName: $("#guestName"),
  checkInviteBtn: $("#checkInviteBtn"),
  lookupStatus: $("#lookupStatus"),
  inviteResult: $("#inviteResult"),
  ticketName: $("#ticketName"),
  ticketMessage: $("#ticketMessage"),
  plusOnes: $("#plusOnes"),
  rsvpForm: $("#rsvpForm"),
  submitStatus: $("#submitStatus"),
  thankYou: $("#thankYou"),
  thankYouText: $("#thankYouText"),
  resetBtn: $("#resetBtn"),
  days: $("#days"),
  hours: $("#hours"),
  minutes: $("#minutes"),
  seconds: $("#seconds"),
  particles: $("#particles")
};

let selectedGuest = null;

function applyConfig() {
  for (const [key, value] of Object.entries(SITE_CONFIG)) {
    if (els[key] && typeof value === "string") {
      els[key].textContent = value;
    }
  }
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/[ى]/g, "ي")
    .replace(/[ة]/g, "ه")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s'-]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function findGuest(inputName) {
  const cleanInput = normalizeName(inputName);
  if (!cleanInput) return null;

  return (window.GUESTS || []).find((guest) => {
    const namesToCheck = [guest.name, guest.displayName, ...(guest.aliases || [])];
    return namesToCheck.some((name) => normalizeName(name) === cleanInput);
  }) || null;
}

function setStatus(element, message, type = "") {
  element.textContent = message;
  element.className = `status ${type}`.trim();
}

function populatePlusOnes(maxPlusOnes) {
  els.plusOnes.innerHTML = "";
  const max = Number(maxPlusOnes || 0);

  for (let i = 0; i <= max; i += 1) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = i === 0 ? "بدون مرافق" : `+${i}`;
    els.plusOnes.appendChild(option);
  }
}

function celebrate(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const icons = ["✦", "✨", "🎓", "💚", "🌿"];
  for (let i = 0; i < 26; i += 1) {
    const pop = document.createElement("span");
    pop.className = "celebration-pop";
    pop.textContent = icons[Math.floor(Math.random() * icons.length)];
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    pop.style.setProperty("--x", `${Math.random() * 340 - 170}px`);
    pop.style.setProperty("--y", `${Math.random() * -260 - 60}px`);
    pop.style.animationDelay = `${Math.random() * 0.16}s`;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 1500);
  }
}

function checkInvite() {
  const input = els.guestName.value;
  const guest = findGuest(input);

  selectedGuest = guest;
  els.submitStatus.textContent = "";
  els.rsvpForm.reset();

  if (!guest) {
    els.inviteResult.classList.add("hidden");
    els.thankYou.classList.add("hidden");
    setStatus(
      els.lookupStatus,
      "عذرًا، لم يتم العثور على هذا الاسم. تأكدي من كتابة الاسم بشكل صحيح أو تواصلي مع صاحبة الدعوة.",
      "error"
    );
    return;
  }

  const displayName = guest.displayName || guest.name;
  els.ticketName.textContent = displayName;
  els.ticketMessage.textContent =
    guest.plusOnes > 0
      ? `أهلًا ${displayName}، تم تأكيد وجود دعوتك. يمكنك إحضار ${guest.plusOnes} مرافق.`
      : `أهلًا ${displayName}، تم تأكيد وجود دعوتك. يسعدنا حضورك ومشاركتك هذه المناسبة.`;

  populatePlusOnes(guest.plusOnes);
  els.inviteResult.classList.remove("hidden");
  els.thankYou.classList.add("hidden");
  setStatus(els.lookupStatus, "تم العثور على الدعوة. يرجى تأكيد الحضور بالأسفل.", "success");
  celebrate(window.innerWidth / 2, window.innerHeight * 0.45);
  els.inviteResult.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function submitRSVP(event) {
  event.preventDefault();

  if (!selectedGuest) {
    setStatus(els.submitStatus, "يرجى التحقق من الدعوة أولًا.", "error");
    return;
  }

  const formData = new FormData(els.rsvpForm);
  const attendance = formData.get("attendance");

  if (!attendance) {
    setStatus(els.submitStatus, "يرجى اختيار هل ستحضر أم لا.", "error");
    return;
  }

  const payload = {
    guestName: selectedGuest.name,
    displayName: selectedGuest.displayName || selectedGuest.name,
    attendance,
    plusOnes: formData.get("plusOnes") || "0",
    contact: formData.get("phone") || "",
    message: formData.get("message") || "",
    submittedAt: new Date().toISOString()
  };

  els.submitStatus.textContent = "جارٍ الإرسال...";
  $("#submitRsvpBtn").disabled = true;

  try {
    if (SITE_CONFIG.RSVP_ENDPOINT) {
      await fetch(SITE_CONFIG.RSVP_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
    } else {
      const saved = JSON.parse(localStorage.getItem("demoRsvps") || "[]");
      saved.push(payload);
      localStorage.setItem("demoRsvps", JSON.stringify(saved));
    }

    els.inviteResult.classList.add("hidden");
    els.thankYou.classList.remove("hidden");

    if (attendance === "yes") {
      els.thankYouText.textContent = `رائع، شكرًا لك يا ${payload.displayName}. تم إرسال تأكيد حضورك.`;
    } else {
      els.thankYouText.textContent = `شكرًا لك يا ${payload.displayName}. تم إرسال ردك.`;
    }

    celebrate(window.innerWidth / 2, window.innerHeight * 0.45);
    els.thankYou.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error(error);
    setStatus(els.submitStatus, "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل مع صاحبة الدعوة.", "error");
  } finally {
    $("#submitRsvpBtn").disabled = false;
  }
}

function resetLookup() {
  selectedGuest = null;
  els.guestName.value = "";
  els.lookupStatus.textContent = "";
  els.submitStatus.textContent = "";
  els.inviteResult.classList.add("hidden");
  els.thankYou.classList.add("hidden");
  els.guestName.focus();
}

function updateCountdown() {
  const target = new Date(SITE_CONFIG.eventDateISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  els.days.textContent = String(Math.floor(diff / day)).padStart(2, "0");
  els.hours.textContent = String(Math.floor((diff % day) / hour)).padStart(2, "0");
  els.minutes.textContent = String(Math.floor((diff % hour) / minute)).padStart(2, "0");
  els.seconds.textContent = String(Math.floor((diff % minute) / 1000)).padStart(2, "0");
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function setupParticles() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const total = Math.min(42, Math.max(20, Math.floor(window.innerWidth / 32)));
  for (let i = 0; i < total; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `${-10 - Math.random() * 100}px`;
    particle.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
    particle.style.animationDuration = `${8 + Math.random() * 14}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.opacity = String(0.25 + Math.random() * 0.65);
    particle.style.transform = `scale(${0.55 + Math.random() * 0.95})`;
    els.particles.appendChild(particle);
  }
}

function setupMagneticButtons() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

applyConfig();
setupRevealAnimations();
setupParticles();
setupMagneticButtons();
updateCountdown();
setInterval(updateCountdown, 1000);

els.checkInviteBtn.addEventListener("click", checkInvite);
els.guestName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkInvite();
});
els.rsvpForm.addEventListener("submit", submitRSVP);
els.resetBtn.addEventListener("click", resetLookup);
