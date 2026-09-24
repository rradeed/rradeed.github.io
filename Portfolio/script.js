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

    const iconAbout = document.getElementById("icon-about");
    const windowAbout = document.getElementById("window-about");
    const closeAbout = document.getElementById("close-about");
    const titlebar = windowAbout.querySelector(".window-titlebar");

    if (iconAbout) {
        iconAbout.addEventListener("click", () => {
            windowAbout.style.display = "flex";
            windowAbout.classList.add("show");
        });
    }

    if (closeAbout) {
        closeAbout.addEventListener("click", () => {
            windowAbout.style.display = "none";
            windowAbout.classList.remove("show"); 
        });
    }

    let isDragging = false;
    let offsetX, offsetY;

    titlebar.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.style.userSelect = "none";
        
        const rect = windowAbout.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        windowAbout.style.left = `${e.clientX - offsetX}px`;
        windowAbout.style.top = `${e.clientY - offsetY}px`;
        
        e.preventDefault(); 
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
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
    { text: "Memory Testing: 65536K <span class='ok-status'>OK</span>", delay: 400 }, 
    { text: "Battery Pack : 99% <span class='ok-status'>OK</span>", delay: 150 },
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

            if (line.isPrompt) {
                document.addEventListener("keydown", function startOS(event) {
                    
                    document.removeEventListener("keydown", startOS);
                    
                    ambientHum.play().catch(err => console.log("Audio blocked by browser:", err));
                    
                    biosScreen.style.display = "none";
                    welcomeScreen.style.display = "flex";

                    setTimeout(() => {
                        welcomeScreen.style.display = "none";
                        document.getElementById("desktop-screen").style.display = "flex";
                    }, 4500);
                });
            }
        }, accumulatedDelay);
    });
});