onload = () => {
    document.body.classList.remove("container");
    
    // Automatically open the letter after 10 seconds
    setTimeout(() => {
        if (openBtn.style.display !== "none") {
            openBtn.click();
        }
    }, 10000);
};

const wrapper = document.querySelector(".wrapper");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

openBtn.addEventListener("click", () => {
    wrapper.classList.add("open");
    openBtn.style.display = "none";
    closeBtn.style.display = "inline-block";
    
    // After the letter opens, expand it to full screen
    setTimeout(() => {
        expandToFullScreen();
    }, 800); // Slightly faster timing for smoother experience
});

closeBtn.addEventListener("click", () => {
    collapseFromFullScreen();
});

function expandToFullScreen() {
    // Create full-screen overlay with blank content
    const fullScreenOverlay = document.createElement('div');
    fullScreenOverlay.id = 'fullScreenOverlay';
    fullScreenOverlay.innerHTML = `
        <div class="full-screen-content">
            <!-- Blank page - add your content here -->
        </div>
    `;
    
    document.body.appendChild(fullScreenOverlay);
    
    // Trigger smoother animation
    requestAnimationFrame(() => {
        fullScreenOverlay.classList.add('show');
    });
}

function collapseFromFullScreen() {
    const fullScreenOverlay = document.getElementById('fullScreenOverlay');
    if (fullScreenOverlay) {
        fullScreenOverlay.classList.remove('show');
        setTimeout(() => {
            fullScreenOverlay.remove();
        }, 600); // Longer timeout for smoother exit
    }
    
    // Reset the original letter state
    wrapper.classList.remove("open");
    closeBtn.style.display = "none";
    openBtn.style.display = "inline-block";
}
  