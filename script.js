document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.getElementById("bios-text-container");
    const biosScreen = document.getElementById("bios-screen");
    const welcomeScreen = document.getElementById("welcome-screen"); 

    const clickSound = new Audio('assets/mouse-click.mp3');
    clickSound.volume = 0.1;
    
    document.addEventListener('mousedown', () => {
        clickSound.currentTime = 0; 
        clickSound.play().catch(err => console.log("Click sound blocked:", err));
    });

    function setupWindowToggle(iconId, windowId, closeId) {
        const icon = document.getElementById(iconId);
        const win = document.getElementById(windowId);
        const closeBtn = document.getElementById(closeId);

        if (icon && win && closeBtn) {
            icon.addEventListener("click", () => {
                win.style.display = "flex";
                win.classList.add("show");
                
                document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 100);
                win.style.zIndex = 101;
            });

            closeBtn.addEventListener("click", () => {
                win.style.display = "none";
                win.classList.remove("show"); 
            });
        }
    }

    const iconGithub = document.getElementById("icon-github");
    const iconLinkedin = document.getElementById("icon-linkedin");

    if (iconGithub) {
        iconGithub.addEventListener("click", () => {
            window.open("https://github.com/rradeed", "_blank");
        });
    }

    if (iconLinkedin) {
        iconLinkedin.addEventListener("click", () => {
            window.open("https://www.linkedin.com/in/raditya-yuwicaksono", "_blank");
        });
    }

    const iconCv = document.getElementById("icon-cv");

    if (iconCv) {
        iconCv.addEventListener("click", () => {
            window.open("assets/CV.pdf", "_blank");
        });
    }

    setupWindowToggle("icon-about", "window-about", "close-about");
    setupWindowToggle("icon-projects", "window-projects", "close-projects");

    let isDragging = false;
    let dragWindow = null;
    let offsetX, offsetY;

    document.querySelectorAll('.window-titlebar').forEach(titlebar => {
        titlebar.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragWindow = titlebar.parentElement;
            document.body.style.userSelect = "none";
            
            const rect = dragWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 100);
            dragWindow.style.zIndex = 101;
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !dragWindow) return;
        
        dragWindow.style.left = `${e.clientX - offsetX}px`;
        dragWindow.style.top = `${e.clientY - offsetY}px`;
        
        e.preventDefault(); 
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        dragWindow = null;
        document.body.style.userSelect = "";
    });

    function updateClock() {
        const clockEl = document.getElementById('desktop-clock');
        if (clockEl) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const month = now.toLocaleString('en-US', { month: 'short' });
            const day = now.getDate();
            const year = now.getFullYear();
            clockEl.innerHTML = `${timeString} - ${month}, ${day} ${year}`;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
    
    const ambientHum = new Audio('assets/humm.mp3');
    ambientHum.volume = 0.3;
    ambientHum.loop = true; 

    const bootSequence = [
        { text: "RadeedOS (C) 2026", delay: 200 },
        { text: "Bios Version : 2026.xx.xx Release", delay: 100 },
        { text: "Main Processor: Intel 4004", delay: 150 },
        { text: "Memory Testing: <span id='mem-counter'>0</span>K", delay: 400, isMemory: true }, 
        { text: "Battery Pack : 99% <span class='ok-status'>OK</span>", delay: 550 },
        { text: "CMOS Battery : DEAD", delay: 150 },
        { text: "Decrypting user environment...", delay: 150 },
        { text: "Reticulating splines...", delay: 150 },
        { text: "<br>", delay: 100 },
        { text: "Initializing Security Protocols... <span class='ok-status'>OK</span>", delay: 350 },
        { text: "Loading Kernel Modules... <span class='ok-status'>OK</span>", delay: 300 },
        { text: "Mounting File System... <span class='ok-status'>OK</span>", delay: 450 },
        { text: "Ignoring laws of thermodynamics... <span class='ok-status'>OK</span>", delay: 500 },
        { text: "<br>", delay: 100 },
        { text: "Welcome [ REDACTED ] !", delay: 400 },
        { text: "<br>", delay: 50 },
        { text: "<br>", delay: 50 },
        { text: '<span class="blink-prompt">>> Press any key to boot system</span>', delay: 600, isPrompt: true },
        { text: "<br>", delay: 50 },
        { text: "<br>", delay: 50 },
        { text: "<br>", delay: 50 },
        { text: "<br>", delay: 50 },
        { text: "<br>", delay: 50 },
        { text: "<br>", delay: 100 },
        { text: 'Waiting for Input<span class="loading-dots"></span><span class="cursor"></span>', delay: 400 }
    ];

    let accumulatedDelay = 0;

    bootSequence.forEach((line) => {
        accumulatedDelay += line.delay;
        
        setTimeout(() => {
            const p = document.createElement("p");
            p.innerHTML = line.text;
            textContainer.appendChild(p);
            
            if (line.isMemory) {
                let mem = 0;
                const counter = p.querySelector("#mem-counter");
                const interval = setInterval(() => {
                    mem += 2184; 
                    if (mem >= 65536) {
                        mem = 65536;
                        clearInterval(interval);
                        p.innerHTML = `Memory Testing: 65536K <span class='ok-status'>OK</span>`;
                    } else {
                        if (counter) counter.innerText = mem;
                    }
                }, 65);
            }

            if (line.isPrompt) {
                document.addEventListener("keydown", function startOS(event) {
                    document.removeEventListener("keydown", startOS);
                    ambientHum.play().catch(err => console.log("Audio blocked by browser:", err));
                    biosScreen.style.display = "none";
                    welcomeScreen.style.display = "flex";

                    setTimeout(() => {
                        welcomeScreen.style.display = "none";
                        document.getElementById("desktop-screen").style.display = "flex";
                    }, 4000);
                });
            }
        }, accumulatedDelay);
    });
});