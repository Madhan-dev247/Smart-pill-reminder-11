// Navigation
const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("nav button");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    screens.forEach(s => s.classList.remove("active"));
    document.getElementById(btn.id.replace("Btn", "")).classList.add("active");
  });
});

// Medicine handling
const medicineList = document.getElementById("medicineList");
const historyList = document.getElementById("historyList");
const saveBtn = document.getElementById("saveMedicine");

// 🧠 Preloaded medicine names (100+ common)
const allMedicines = [
  "Paracetamol", "Amoxicillin", "Azithromycin", "Ibuprofen", "Metformin",
  "Amlodipine", "Atorvastatin", "Pantoprazole", "Omeprazole", "Cetrizine",
  "Dolo 650", "Crocin", "Levothyroxine", "Losartan", "Telmisartan",
  "Metoprolol", "Aspirin", "Clopidogrel", "Insulin", "Calcium Tablet",
  "Vitamin D3", "Folic Acid", "Iron Tablet", "B Complex", "Cough Syrup",
  "Diclofenac", "Ranitidine", "Domperidone", "Ondansetron", "Ciprofloxacin",
  "Amoxiclav", "Erythromycin", "Loratadine", "Montelukast", "Salbutamol",
  "Cetirizine", "Prednisolone", "Hydrocortisone", "Betadine", "Zinc Tablet",
  "Vitamin C", "Vitamin B12", "Multivitamin", "Sucralfate", "Sodium Bicarbonate",
  "ORS Solution", "Cough Lozenges", "Pain Balm", "Insulin Injection",
  "Paracetamol Syrup", "Dextromethorphan", "Ambroxol", "Chlorpheniramine",
  "Rifampicin", "Isoniazid", "Ethambutol", "Pyrazinamide", "Hydroxychloroquine",
  "Ferrous Sulfate", "Atenolol", "Carvedilol", "Bisoprolol", "Nifedipine",
  "Lisinopril", "Ramipril", "Furosemide", "Hydrochlorothiazide", "Spironolactone",
  "Tamsulosin", "Finasteride", "Levocetirizine", "Fluticasone", "Beclomethasone",
  "Amiodarone", "Warfarin", "Enoxaparin", "Heparin", "Omnacortil",
  "Sodium Chloride", "Guaifenesin", "Mefenamic Acid", "Naproxen", "Ketorolac",
  "Benzocaine", "Clotrimazole", "Ketoconazole", "Nystatin", "Fluconazole",
  "Amphotericin B", "Ranitidine", "Famotidine", "Sucral", "Lactulose",
  "Bisacodyl", "Dulcolax", "Probiotic Capsule", "ORS Powder", "Rehydration Salt"
];

// Load suggestions
const datalist = document.getElementById("medicineNames");
allMedicines.forEach(name => {
  const option = document.createElement("option");
  option.value = name;
  datalist.appendChild(option);
});

// Main app data
let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

function renderMedicines() {
  medicineList.innerHTML = "";
  medicines.forEach((med, index) => {
    const li = document.createElement("li");
    li.textContent = `${med.name} at ${med.time}`;
    const takeBtn = document.createElement("button");
    takeBtn.textContent = "Taken";
    takeBtn.onclick = () => markTaken(index);
    li.appendChild(takeBtn);
    medicineList.appendChild(li);
  });
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} taken at ${entry.time}`;
    historyList.appendChild(li);
  });
}

saveBtn.addEventListener("click", () => {
  const name = document.getElementById("medicineName").value;
  const time = document.getElementById("medicineTime").value;

  if (name && time) {
    medicines.push({ name, time });
    localStorage.setItem("medicines", JSON.stringify(medicines));
    renderMedicines();
    alert("Medicine added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
});

function markTaken(index) {
  const med = medicines[index];
  history.push({
    name: med.name,
    time: new Date().toLocaleTimeString()
  });

  // vibrate for 500ms when marked as taken
  if ("vibrate" in navigator) navigator.vibrate(500);

  medicines.splice(index, 1);
  localStorage.setItem("medicines", JSON.stringify(medicines));
  localStorage.setItem("history", JSON.stringify(history));

  renderMedicines();
  renderHistory();
}

renderMedicines();
renderHistory();

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
// 🎤 Voice Recognition feature
const voiceBtn = document.getElementById("voiceBtn");
const medicineInput = document.getElementById("medicineName");

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN"; // Indian English
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    recognition.start();
    voiceBtn.textContent = "🎙️ Listening...";
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    medicineInput.value = transcript;
    voiceBtn.textContent = "🎤";
  };

  recognition.onerror = () => {
    alert("Could not recognize voice. Try again!");
    voiceBtn.textContent = "🎤";
  };

  recognition.onend = () => {
    voiceBtn.textContent = "🎤";
  };
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = "Voice recognition not supported on this device";
                       }
