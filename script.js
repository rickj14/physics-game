const lessons = [
  {
    topic: "Wellen & Alltag",
    lesson: "Eine Welle ist eine Bewegung, die Energie weitergibt. Beispiel: Stadion-Welle oder Wellen im Wasser.",
    tags: ["Welle", "Energie", "Alltag"],
    question: "Was transportiert eine Welle?",
    answers: [
      { text: "Energie", correct: true },
      { text: "feste Teilchen", correct: false },
      { text: "Schokolade", correct: false }
    ],
  },
  {
    topic: "Echo",
    lesson: "Echo ist Schall, der zurückprallt. In Bergen oder leeren Gängen hörst du dein Wort doppelt.",
    tags: ["Schall", "Reflexion"],
    question: "Wann hörst du ein Echo am besten?",
    answers: [
      { text: "In einem leeren Raum oder Tal", correct: true },
      { text: "In einem vollen Bus", correct: false },
      { text: "Mit Ohrstöpseln", correct: false }
    ],
  },
  {
    topic: "Tonhöhe",
    lesson: "Hohe Töne haben viele Schwingungen pro Sekunde (hohe Frequenz). Tiefe Töne haben wenige.",
    tags: ["Frequenz", "Tonhöhe"],
    question: "Was bedeutet hohe Frequenz?",
    answers: [
      { text: "Viele Schwingungen pro Sekunde", correct: true },
      { text: "Wenige Schwingungen", correct: false },
      { text: "Kein Schall", correct: false }
    ],
  },
  {
    topic: "Lautstärke & Dezibel",
    lesson: "Lautstärke messen wir in Dezibel (dB). Flüstern: ca. 30 dB, Rockkonzert: bis 110 dB.",
    tags: ["dB", "Laut"],
    question: "Welcher Wert passt zu Flüstern?",
    answers: [
      { text: "Etwa 30 dB", correct: true },
      { text: "Etwa 150 dB", correct: false },
      { text: "0 dB = Explosion", correct: false }
    ],
  },
  {
    topic: "Additive Farbmischung",
    lesson: "Beim Bildschirm mischen sich Lichtfarben. Rot + Grün = Gelb, Rot + Blau = Magenta, Blau + Grün = Cyan.",
    tags: ["RGB", "Licht"],
    question: "Welche Farben ergeben Gelb am Bildschirm?",
    answers: [
      { text: "Rot + Grün", correct: true },
      { text: "Rot + Blau", correct: false },
      { text: "Grün + Blau", correct: false }
    ],
  },
  {
    topic: "Sonnenlicht & Spektrum",
    lesson: "Weißes Sonnenlicht besteht aus vielen Farben. Ein Prisma oder Regentropfen macht daraus einen Regenbogen.",
    tags: ["Spektrum", "Regenbogen"],
    question: "Was zeigt das Prisma?",
    answers: [
      { text: "Viele Farben im Licht", correct: true },
      { text: "Nur Schwarz", correct: false },
      { text: "Nur UV-Strahlung", correct: false }
    ],
  },
  {
    topic: "Linsen",
    lesson: "Eine Sammellinse bündelt Licht in einem Brennpunkt. Lupe oder Kamera nutzen das.",
    tags: ["Licht", "Brennpunkt"],
    question: "Was macht eine Sammellinse?",
    answers: [
      { text: "Bündelt Licht", correct: true },
      { text: "Blockiert alles Licht", correct: false },
      { text: "Erzeugt nur Wärme", correct: false }
    ],
  },
  {
    topic: "Augen & Kurzsichtigkeit",
    lesson: "Bei Kurzsichtigkeit siehst du Nähe klarer als die Ferne. Eine Zerstreuungslinse (Brille) hilft.",
    tags: ["Sehen", "Brille"],
    question: "Was hilft bei Kurzsichtigkeit?",
    answers: [
      { text: "Brille mit Zerstreuungslinse", correct: true },
      { text: "Ohren zuhalten", correct: false },
      { text: "Mehr Zucker essen", correct: false }
    ],
  },
  {
    topic: "Reflexion",
    lesson: "Licht wird an glatten Flächen gespiegelt. Ein ebener Spiegel hat Einfallswinkel = Ausfallswinkel.",
    tags: ["Spiegel", "Winkel"],
    question: "Was ist gleich am Spiegel?",
    answers: [
      { text: "Einfalls- und Ausfallswinkel", correct: true },
      { text: "Farbe und Geschmack", correct: false },
      { text: "Lautstärke", correct: false }
    ],
  },
  {
    topic: "Brechung",
    lesson: "Geht Licht in Glas oder Wasser, wird es abgelenkt. Das nennt man Brechung, deshalb wirkt ein Strohhalm geknickt.",
    tags: ["Brechung", "Glas"],
    question: "Warum sieht der Strohhalm geknickt aus?",
    answers: [
      { text: "Wegen Brechung im Wasser", correct: true },
      { text: "Weil er brennt", correct: false },
      { text: "Weil Wasser bunt ist", correct: false }
    ],
  },
  {
    topic: "Farben in der Natur",
    lesson: "Blätter sind grün, weil sie rotes und blaues Licht schlucken, aber grünes reflektieren.",
    tags: ["Natur", "Reflexion"],
    question: "Warum sehen Blätter grün aus?",
    answers: [
      { text: "Sie reflektieren grünes Licht", correct: true },
      { text: "Sie leuchten selbst", correct: false },
      { text: "Sie mögen kein Grün", correct: false }
    ],
  }
];

const scoreEl = document.getElementById("score");
const heartsEl = document.getElementById("hearts");
const topicEl = document.getElementById("topic");
const lessonEl = document.getElementById("lesson");
const tagsEl = document.getElementById("tags");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const storyEl = document.getElementById("story");
const newTaskBtn = document.getElementById("new-task");
const modeBtn = document.getElementById("mix-mode");
const modeLabel = document.getElementById("mode-label");

let score = 0;
let hearts = 3;
let blitzMode = false;
let timerId = null;
let countdown = 15;

function updateHearts() {
  heartsEl.innerHTML = "";
  for (let i = 0; i < hearts; i++) {
    const span = document.createElement("span");
    span.textContent = "❤️";
    heartsEl.appendChild(span);
  }
}

function updateScore() {
  scoreEl.textContent = `⭐ ${score}`;
}

function shuffle(array) {
  return array
    .map((item) => ({ value: item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((obj) => obj.value);
}

function pickLesson() {
  return lessons[Math.floor(Math.random() * lessons.length)];
}

function setStory(lesson) {
  const prompts = [
    `Du erklärst deiner Klasse in Ottakring: ${lesson.topic}.`,
    `Im U-Bahn-Waggon übst du: ${lesson.topic}.`,
    `Beim Würstelstand erzählst du kurz über ${lesson.topic}.`,
  ];
  storyEl.textContent = prompts[Math.floor(Math.random() * prompts.length)];
}

function showLesson(lesson) {
  topicEl.textContent = lesson.topic;
  lessonEl.textContent = lesson.lesson;
  tagsEl.innerHTML = "";
  lesson.tags.forEach((tag) => {
    const pill = document.createElement("span");
    pill.className = "tag";
    pill.textContent = tag;
    tagsEl.appendChild(pill);
  });
  setStory(lesson);
}

function showQuestion(lesson) {
  questionEl.textContent = lesson.question;
  answersEl.innerHTML = "";
  shuffle(lesson.answers).forEach((ans) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = ans.text;
    btn.addEventListener("click", () => handleAnswer(btn, ans.correct));
    answersEl.appendChild(btn);
  });
}

function handleAnswer(button, correct) {
  const buttons = Array.from(document.querySelectorAll(".answer"));
  buttons.forEach((b) => (b.disabled = true));

  if (correct) {
    button.classList.add("correct");
    score += 1;
    updateScore();
  } else {
    button.classList.add("wrong");
    hearts = Math.max(0, hearts - 1);
    updateHearts();
  }

  if (blitzMode) {
    setTimeout(newTask, 600);
  }
}

function startCountdown() {
  stopCountdown();
  countdown = 15;
  modeLabel.textContent = `Modus: Blitzrunde (${countdown}s)`;
  timerId = setInterval(() => {
    countdown -= 1;
    modeLabel.textContent = `Modus: Blitzrunde (${countdown}s)`;
    if (countdown <= 0) {
      hearts = Math.max(0, hearts - 1);
      updateHearts();
      stopCountdown();
      newTask();
    }
  }, 1000);
}

function stopCountdown() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function newTask() {
  const lesson = pickLesson();
  showLesson(lesson);
  showQuestion(lesson);
  if (blitzMode) {
    startCountdown();
  } else {
    stopCountdown();
    modeLabel.textContent = "Modus: Quiz (ruhig)";
  }
}

function toggleMode() {
  blitzMode = !blitzMode;
  if (blitzMode) {
    startCountdown();
  } else {
    stopCountdown();
    modeLabel.textContent = "Modus: Quiz (ruhig)";
  }
}

newTaskBtn.addEventListener("click", newTask);
modeBtn.addEventListener("click", toggleMode);

// Initial render
updateHearts();
updateScore();
newTask();
