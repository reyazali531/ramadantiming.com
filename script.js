const districtSelect = document.getElementById("district");
const sehriTime = document.getElementById("sehri-time");
const iftarTime = document.getElementById("iftar-time");
const progress = document.getElementById("progress");
const remainingTime = document.getElementById("remaining-time");
const percentageText = document.getElementById("percentage");
const duaText = document.getElementById("dua-text");

// Ramadan calendar data for Srinagar (from March 16, 2025, to March 31, 2025)
const srinagarCalendar = [
  { date: "2025-03-16", sehri: "05:18 AM", iftar: "06:42 PM" },
  { date: "2025-03-17", sehri: "05:16 AM", iftar: "06:42 PM" },
  { date: "2025-03-18", sehri: "05:15 AM", iftar: "06:43 PM" },
  { date: "2025-03-19", sehri: "05:14 AM", iftar: "06:44 PM" },
  { date: "2025-03-20", sehri: "05:12 AM", iftar: "06:45 PM" },
  { date: "2025-03-21", sehri: "05:11 AM", iftar: "06:46 PM" },
  { date: "2025-03-22", sehri: "05:10 AM", iftar: "06:47 PM" },
  { date: "2025-03-23", sehri: "05:08 AM", iftar: "06:48 PM" },
  { date: "2025-03-24", sehri: "05:06 AM", iftar: "06:48 PM" },
  { date: "2025-03-25", sehri: "05:05 AM", iftar: "06:49 PM" },
  { date: "2025-03-26", sehri: "05:04 AM", iftar: "06:50 PM" },
  { date: "2025-03-27", sehri: "05:02 AM", iftar: "06:50 PM" },
  { date: "2025-03-28", sehri: "05:00 AM", iftar: "06:51 PM" },
  { date: "2025-03-29", sehri: "04:58 AM", iftar: "06:52 PM" },
  { date: "2025-03-30", sehri: "04:56 AM", iftar: "06:53 PM" },
  { date: "2025-03-31", sehri: "04:56 AM", iftar: "06:54 PM" },
];

// Adjust timings for Baramulla by adding 1 minute
const baramullaCalendar = srinagarCalendar.map((day) => {
  const sehriTime = new Date(`2025-03-16 ${day.sehri}`);
  sehriTime.setMinutes(sehriTime.getMinutes() + 1);

  const iftarTime = new Date(`2025-03-16 ${day.iftar}`);
  iftarTime.setMinutes(iftarTime.getMinutes() + 1);

  return {
    date: day.date,
    sehri: sehriTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    iftar: iftarTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
});

// Combine calendars for both districts
const ramadanCalendar = {
  Srinagar: srinagarCalendar,
  Baramulla: baramullaCalendar,
};

// Function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Check if today is within the specified period (March 16, 2025, to March 31, 2025)
function isRamadanPeriod() {
  const ramadanStartDate = "2025-03-16"; // Starting date
  const ramadanEndDate = "2025-03-31"; // Ending date
  const todayDate = getTodayDate();

  return todayDate >= ramadanStartDate && todayDate <= ramadanEndDate;
}

// Update timings based on selected district and today's date
function updateTimings() {
  if (!isRamadanPeriod()) {
    
    iftarTime.textContent = "";
    remainingTime.textContent = "";
    percentageText.textContent = "";
    progress.style.width = "0%";
    return;
  }

  const selectedDistrict = districtSelect.value;
  const todayDate = getTodayDate();
  const timings = ramadanCalendar[selectedDistrict].find(
    (day) => day.date === todayDate
  );

  if (timings) {
    sehriTime.textContent = `Sehri: ${timings.sehri}`;
    iftarTime.textContent = `Iftar: ${timings.iftar}`;
    startCountdown(timings.iftar);
  } else {
    sehriTime.textContent = "Sehri: Not available";
    iftarTime.textContent = "Iftar: Not available";
  }
}

// Start countdown for Iftar time
function startCountdown(iftarTimeStr) {
  const iftarTimeDate = new Date(`${new Date().toDateString()} ${iftarTimeStr}`);

  function updateCountdown() {
    const now = new Date();
    const remaining = iftarTimeDate - now;

    if (remaining <= 0) {
      remainingTime.textContent = "Iftar time has passed!";
      progress.style.width = "100%";
      percentageText.textContent = "100%";
      return;
    }

    const totalTime = iftarTimeDate - new Date(`${now.toDateString()} 00:00:00`);
    const elapsedTime = now - new Date(`${now.toDateString()} 00:00:00`);
    const percentage = ((elapsedTime / totalTime) * 100).toFixed(2);

    progress.style.width = `${percentage}%`;
    percentageText.textContent = `${percentage}%`;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    remainingTime.textContent = `Remaining Time: ${hours}h ${minutes}m ${seconds}s`;
  }

  // Update countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Display Sehri Dua
function showSehriDua() {
  duaText.innerHTML = `
    <p><strong>Sehri Dua:</strong></p>
    <p>وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ</p>
    <p><em>Wa bisawmi ghadin nawaitu min shahri Ramadan.</em></p>
    <p>I intend to keep the fast for tomorrow in the month of Ramadan.</p>


  `;
}

// Display Iftar Dua
function showIftarDua() {
  duaText.innerHTML = `
    <p><strong>Iftar Dua:</strong></p>
    <p>اللَّهُمَّ اِنِّى لَكَ صُمْتُ وَبِكَ امنْتُ وَعَليْكَ تَوَكّلتُ وَ عَلى رِزْقِكَ اَفْطَرْتُ</p>
    <p><em>Allahumma inni laka sumtu wa bika aamantu wa alayka tawakkaltu wa ala rizq-ika aftartu.</em></p>
    <p>O Allah! I fasted for You and I believe in You and I break my fast with Your sustenance.</p>

    
  `;
}

// Event listener for district change
districtSelect.addEventListener("change", updateTimings);

// Initialize
updateTimings();