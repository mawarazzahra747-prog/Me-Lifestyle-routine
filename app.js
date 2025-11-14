// LOGIN
function login() {
    const userEl = document.getElementById("username");
    const passEl = document.getElementById("password");
    const user = userEl ? userEl.value.trim() : "";
    const pass = passEl ? passEl.value.trim() : "";

    if (user && pass) {
        // sembunyikan halaman login dan tampilkan dashboard
        const loginPage = document.getElementById("loginPage");
        const dashboard = document.getElementById("dashboard");
        if (loginPage) loginPage.style.display = "none";
        if (dashboard) dashboard.style.display = "block";

        // bersihkan indikator dan tombol
        const btn = document.getElementById('showLoginBtn');
        if (btn) {
            btn.classList.remove('menu-clicked');
            btn.textContent = 'Masuk';
            btn.setAttribute('aria-expanded', 'false');
        }
        if (userEl) {
            userEl.classList.remove('input-clicked');
        }
        if (passEl) {
            passEl.classList.remove('input-clicked');
        }
        const uStatus = document.getElementById('usernameStatus');
        const pStatus = document.getElementById('passwordStatus');
        if (uStatus) uStatus.textContent = '';
        if (pStatus) pStatus.textContent = '';

        // reset timer display
        resetTimer();
    } else {
        alert("Isi username & password dulu!");
    }
}

// OPEN ROUTINE PAGE
function openRoutine(routineName) {
    const dashboard = document.getElementById("dashboard");
    const routinePage = document.getElementById("routinePage");
    if (dashboard) dashboard.style.display = "none";
    if (routinePage) routinePage.style.display = "block";

    const titleEl = document.getElementById("routineTitle");
    if (titleEl) titleEl.innerText = routineName || "";

    // hide all sections safely
    const todoSection = document.getElementById("todoSection");
    const notesSection = document.getElementById("notesSection");
    const timerEl = document.getElementById("timer"); // id exists
    const timerControls = document.querySelector(".timer-controls");

    if (todoSection) todoSection.style.display = "none";
    if (notesSection) notesSection.style.display = "none";
    if (timerEl) timerEl.style.display = "none";
    if (timerControls) timerControls.style.display = "none";

    if (routineName === "To-Do List") {
        if (todoSection) todoSection.style.display = "block";
    } else if (routineName === "Daily Notes") {
        if (notesSection) {
            notesSection.style.display = "block";
            loadNotes();
        }
    } else {
        if (timerEl) timerEl.style.display = "block";
        if (timerControls) timerControls.style.display = "block";
    }
}

// BACK
function backToDashboard() {
    const routinePage = document.getElementById("routinePage");
    const dashboard = document.getElementById("dashboard");
    if (routinePage) routinePage.style.display = "none";
    if (dashboard) dashboard.style.display = "block";
    resetTimer();
}

/* TIMER */
let timer = null;
let seconds = 0;
let running = false;

function updateDisplay() {
    const timerEl = document.getElementById("timer");
    let m = String(Math.floor(seconds / 60)).padStart(2, "0");
    let s = String(seconds % 60).padStart(2, "0");
    if (timerEl) timerEl.innerText = `${m}:${s}`;
}

function startTimer() {
    if (running) return;
    running = true;
    timer = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    running = false;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function resetTimer() {
    running = false;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    seconds = 0;
    updateDisplay();
}

/* DARK MODE toggle (updated) */
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');

    // toggle card class
    let cards = document.querySelectorAll(".menu-card");
    cards.forEach(c => c.classList.toggle("dark-card"));

    // update button text
    const btn = document.querySelector('.toggle-theme-btn');
    if (btn) btn.textContent = isDark ? '☀️ Light Mode' : '🌗 Dark Mode';

    // persist preference
    try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) { /* ignore */ }
}

/* initialize theme on load */
function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) { /* ignore */ }

    if (!saved) {
        // use OS preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            saved = 'dark';
        } else {
            saved = 'light';
        }
    }

    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelectorAll(".menu-card").forEach(c => c.classList.add("dark-card"));
        const btn = document.querySelector('.toggle-theme-btn');
        if (btn) btn.textContent = '☀️ Light Mode';
    } else {
        const btn = document.querySelector('.toggle-theme-btn');
        if (btn) btn.textContent = '🌗 Dark Mode';
    }
}

document.addEventListener('DOMContentLoaded', initTheme);

/* TO-DO LIST */
function addTodo() {
    let input = document.getElementById("todoInput");
    if (!input) return;
    let task = input.value.trim();

    if (!task) return;

    let li = document.createElement("li");
    li.innerHTML = `${escapeHtml(task)} <button onclick="this.parentElement.remove()">❌</button>`;
    const list = document.getElementById("todoList");
    if (list) list.appendChild(li);

    input.value = "";
}

/* DAILY NOTES */
function saveNotes() {
    let notesEl = document.getElementById("dailyNotes");
    if (!notesEl) return;
    let notes = notesEl.value;
    try {
        localStorage.setItem("dailyNotes", notes);
        alert("Catatan Disimpan!");
    } catch (e) {
        console.warn("Gagal menyimpan catatan:", e);
        alert("Gagal menyimpan catatan.");
    }
}

function loadNotes() {
    let notesEl = document.getElementById("dailyNotes");
    if (!notesEl) return;
    try {
        let saved = localStorage.getItem("dailyNotes");
        if (saved !== null) notesEl.value = saved;
    } catch (e) {
        console.warn("Gagal memuat catatan:", e);
    }
}

/* UTILS */
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[m];
    });
}

/* Menampilkan field login dan memberi tanda pada tombol Menu (toggle) */
function showLoginFields() {
    const fields = document.getElementById('loginFields');
    const btn = document.getElementById('showLoginBtn');
    if (!fields || !btn) return;

    const isVisible = fields.style.display === 'block';
    if (isVisible) {
        fields.style.display = 'none';
        btn.classList.remove('menu-clicked');
        btn.textContent = 'Masuk';
        btn.setAttribute('aria-expanded', 'false');
    } else {
        fields.style.display = 'block';
        btn.classList.add('menu-clicked');
        btn.textContent = 'Masuk •';
        btn.setAttribute('aria-expanded', 'true');

        // fokus ke username jika ada
        const uname = document.getElementById('username');
        if (uname) uname.focus();
    }
}

/* Saat input di-focus beri tanda visual dan status aktif */
function markClicked(id) {
    const input = document.getElementById(id);
    const status = document.getElementById(id + 'Status');
    if (input) input.classList.add('input-clicked');
    if (status) {
        status.textContent = '●';
        status.classList.add('active');
    }
}

/* Hilangkan tanda saat blur (tetap tampil jika ada isi) */
function unmarkClicked(id) {
    const input = document.getElementById(id);
    const status = document.getElementById(id + 'Status');
    if (input) input.classList.remove('input-clicked');
    if (status) {
        if (input && input.value.trim() !== '') {
            status.textContent = '●';
            status.classList.add('active');
        } else {
            status.textContent = '';
            status.classList.remove('active');
        }
    }
}
