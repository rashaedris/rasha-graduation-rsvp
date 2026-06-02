/*
  EDIT EVENT DETAILS HERE.
  عدّلي تفاصيل المناسبة من هنا.

  RSVP_ENDPOINT:
  Paste the Google Apps Script Web App URL here.
  ضعي رابط Google Apps Script هنا.

  If it is empty, RSVP submissions only save in the visitor's browser for testing.
  إذا كان فارغًا، الردود تحفظ فقط في متصفح الضيف للتجربة ولا تصل إليك.
*/
const SITE_CONFIG = {
  graduateName: "Rasha Edris",
  heroCopy: "We would be delighted to have you join us in celebrating Rasha’s graduation after a journey of hard work, dedication, and success.",
  heroCopyArabic: "يسعدنا حضوركم ومشاركتكم فرحة تخرّج رشا بعد رحلة من التعب والاجتهاد والنجاح.",
  eventDateText: "Saturday, 6 June 2026",
  eventDateTextArabic: "السبت، ٦ يونيو ٢٠٢٦",
  eventTimeText: "Time to be confirmed",
  eventTimeTextArabic: "سيتم تأكيد الوقت قريبًا",
  eventLocationText: "Location to be confirmed",
  eventLocationTextArabic: "سيتم تأكيد المكان قريبًا",
  dressCodeText: "Elegant dress, green touches welcome",
  dressCodeTextArabic: "لباس أنيق، ولمسات باللون الأخضر مرحّب بها",
  storyText: "We would love for you to share this special occasion with us, filled with love, photos, laughter, and beautiful memories.",
  storyTextArabic: "نود أن تشاركونا هذه المناسبة الخاصة في أجواء مليئة بالحب، الصور، الضحكات، والذكريات الجميلة.",

  eventDateISO: "2026-06-06T18:00:00",

  RSVP_ENDPOINT: ""
};

const $ = (selector) => document.querySelector(selector);

const els = {
  graduateName: $("#graduateName"),
  heroCopy: $("#heroCopy"),
  heroCopyArabic: $("#heroCopyArabic"),
  eventDateText: $("#eventDateText"),
  eventDateTextArabic: $("#eventDateTextArabic"),
  eventTimeText: $("#eventTimeText"),
  eventTimeTextArabic: $("#eventTimeTextArabic"),
  eventLocationText: $("#eventLocationText"),
  eventLocationTextArabic: $("#eventLocationTextArabic"),
  dressCodeText: $("#dressCodeText"),
  dressCodeTextArabic: $("#dressCodeTextArabic"),
  storyText: $("#storyText"),
  storyTextArabic: $("#storyTextArabic"),
  guestName: $("#guestName"),
  checkInviteBtn: $("#checkInviteBtn"),
  lookupStatus: $("#lookupStatus"),
  inviteResult: $("#inviteResult"),
  ticketName: $("#ticketName"),
  ticketMessage: $("#ticketMessage"),
  ticketMessageArabic: $("#ticketMessageArabic"),
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

function populatePlusOnes(maxGuests) {
  els.plusOnes.innerHTML = "";
  const max = Number(maxGuests || 0);

  for (let i = 0; i <= max; i += 1) {
    const option = document.createElement("option");
    option.value = String(i);

    if (i === 0) {
      option.textContent = "Just me / بدون مرافقين";
    } else if (i === 1) {
      option.textContent = "+1 additional guest / مرافق واحد";
    } else {
      option.textContent = `+${i} additional guests / ${i} مرافقين`;
    }

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
      "Sorry, this name is not on the guest list. Please check the spelling or contact the host. / عذرًا، هذا الاسم غير موجود في قائمة الضيوف. يرجى التأكد من كتابة الاسم أو التواصل مع صاحبة الدعوة.",
      "error"
    );
    return;
  }

  const displayName = guest.displayName || guest.name;
  const maxGuests = Number(guest.maxGuests || guest.plusOnes || 0);

  els.ticketName.textContent = displayName;

  if (maxGuests > 0) {
    els.ticketMessage.textContent = `Hi ${displayName}, your invitation was found. You may bring up to ${maxGuests} additional guest${maxGuests > 1 ? "s" : ""}. Please choose how many will come with you.`;
    els.ticketMessageArabic.textContent = `أهلًا ${displayName}، تم العثور على دعوتك. يمكنك إحضار حتى ${maxGuests} مرافقين. يرجى اختيار عدد المرافقين.`;
  } else {
    els.ticketMessage.textContent = `Hi ${displayName}, your invitation was found. We would love to celebrate with you.`;
    els.ticketMessageArabic.textContent = `أهلًا ${displayName}، تم العثور على دعوتك. يسعدنا حضورك ومشاركتك هذه المناسبة.`;
  }

  populatePlusOnes(maxGuests);
  els.inviteResult.classList.remove("hidden");
  els.thankYou.classList.add("hidden");
  setStatus(
    els.lookupStatus,
    "Invitation found. Please confirm below. / تم العثور على الدعوة. يرجى تأكيد الحضور بالأسفل.",
    "success"
  );
  celebrate(window.innerWidth / 2, window.innerHeight * 0.45);
  els.inviteResult.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function submitRSVP(event) {
  event.preventDefault();

  if (!selectedGuest) {
    setStatus(els.submitStatus, "Please check your invitation first. / يرجى التحقق من الدعوة أولًا.", "error");
    return;
  }

  const formData = new FormData(els.rsvpForm);
  const attendance = formData.get("attendance");

  if (!attendance) {
    setStatus(els.submitStatus, "Please choose whether you are attending. / يرجى اختيار هل ستحضر أم لا.", "error");
    return;
  }

  const additionalGuests = Number(formData.get("plusOnes") || "0");
  const totalPeople = attendance === "yes" ? additionalGuests + 1 : 0;

  const payload = {
    guestName: selectedGuest.name,
    displayName: selectedGuest.displayName || selectedGuest.name,
    attendance,
    additionalGuests: String(additionalGuests),
    totalPeople: String(totalPeople),
    contact: formData.get("phone") || "",
    message: formData.get("message") || "",
    submittedAt: new Date().toISOString()
  };

  els.submitStatus.textContent = "Sending... / جارٍ الإرسال...";
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
      els.thankYouText.textContent =
        `Amazing — thank you, ${payload.displayName}. Your RSVP has been sent. Total attending: ${payload.totalPeople}. / رائع، شكرًا لك. تم إرسال تأكيد الحضور. إجمالي الحضور: ${payload.totalPeople}.`;
    } else {
      els.thankYouText.textContent =
        `Thank you, ${payload.displayName}. Your response has been sent. / شكرًا لك. تم إرسال ردك.`;
    }

    celebrate(window.innerWidth / 2, window.innerHeight * 0.45);
    els.thankYou.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error(error);
    setStatus(
      els.submitStatus,
      "Something went wrong. Please try again or contact the host. / حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل مع صاحبة الدعوة.",
      "error"
    );
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
