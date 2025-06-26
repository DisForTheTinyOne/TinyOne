onload = () => {
    document.body.classList.remove("container");
    
    // Automatically open the letter after 10 seconds
    setTimeout(() => {
        if (openBtn.style.display !== "none") {
            openBtn.click();
        }
    }, 9000);
};

const wrapper = document.querySelector(".wrapper");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

// Performance-optimized event listeners
openBtn.addEventListener("click", () => {
    // Add animating class and optimize will-change
    const lids = document.querySelectorAll('.lid');
    const letter = document.querySelector('.letter');
    
    lids.forEach(lid => lid.classList.add('animating'));
    letter.classList.add('animating');
    
    wrapper.classList.add("open");
    openBtn.style.display = "none";
    closeBtn.style.display = "inline-block";
    
    // Clean up will-change after animations complete
    setTimeout(() => {
        lids.forEach(lid => lid.classList.remove('animating'));
        letter.classList.remove('animating');
    }, 1000);
    
    // After the letter opens, expand it to full screen
    setTimeout(() => {
        expandToFullScreen();
    }, 2000 );
});

// Add event listener for continue button (to go to second page)
document.addEventListener("click", (e) => {
    if (e.target.id === "continueBtn") {
        showSecondPage();
    }
});

closeBtn.addEventListener("click", () => {
    collapseFromFullScreen();
});

function expandToFullScreen() {
    // Create full-screen overlay with background words
    const fullScreenOverlay = document.createElement('div');
    fullScreenOverlay.id = 'fullScreenOverlay';
    fullScreenOverlay.classList.add('animating');
    
    fullScreenOverlay.innerHTML = `
        <div class="background-words">
            <span class="word word-1">Love</span>
            <span class="word word-2">Forever</span>
            <span class="word word-3">Always</span>
            <span class="word word-4">Together</span>
            <span class="word word-5">Heart</span>
            <span class="word word-6">Soul</span>
            <span class="word word-7">Dream</span>
            <span class="word word-8">Kiss</span>
            <span class="word word-9">Embrace</span>
            <span class="word word-10">Eternity</span>
        </div>
        <div class="background-hearts">
            <span class="heart heart-1">♥</span>
            <span class="heart heart-2">♥</span>
            <span class="heart heart-3">♥</span>
            <span class="heart heart-4">♥</span>
            <span class="heart heart-5">♥</span>
            <span class="heart heart-6">♥</span>
            <span class="heart heart-7">♥</span>
            <span class="heart heart-8">♥</span>
            <span class="heart heart-9">♥</span>
            <span class="heart heart-10">♥</span>
            <span class="heart heart-11">♥</span>
            <span class="heart heart-12">♥</span>
        </div>
        <div class="full-screen-content animating">
            <div class="letter-page">
                <h1>...Because You Are My Everything</h1>
                
                <p>In a world full of chaos and uncertainty, you are my peace. When storms rage around us, you are my shelter. When the path ahead seems unclear, you are my guiding light.</p>
                
                <p>I love the way you laugh at my silly jokes, even when they're not funny. I love how you scrunch your nose when you're thinking hard about something. I love the way you hold my hand like you never want to let go.</p>
                
                <p>Every morning I wake up grateful for another day to love you. Every sunset reminds me of the beautiful moments we've shared. Every star in the night sky pales in comparison to the sparkle in your eyes.</p>
                
                <p>You've shown me what it means to love without limits, to trust without fear, and to hope without doubt. With you, I've found not just love, but home.</p>
                
                <p>So here's my promise to you: I will love you through every season of life, through every challenge we face, and through every joy we celebrate. My heart belongs to you, today and always.</p>
                
                <div class="signature">
                    <p>Forever yours,</p>
                    <p class="name">Alex ♥</p>
                </div>
                
                <button id="continueBtn" class="continue-btn-fullscreen">Continue →</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(fullScreenOverlay);
    
    // Trigger smoother fade-in animation with RAF for 60fps
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fullScreenOverlay.classList.add('show');
            
            // Clean up will-change after animation
            setTimeout(() => {
                fullScreenOverlay.classList.remove('animating');
                const content = fullScreenOverlay.querySelector('.full-screen-content');
                if (content) content.classList.remove('animating');
            }, 800);
        });
    });
}

function showSecondPage() {
    const fullScreenContent = document.querySelector('.full-screen-content');
    if (fullScreenContent) {
        // Add animating class for will-change optimization
        fullScreenContent.classList.add('animating', 'fade-out');
        
        setTimeout(() => {
            const fullScreenOverlay = document.getElementById('fullScreenOverlay');
            if (fullScreenOverlay) {
                fullScreenOverlay.innerHTML = `
                    <div class="background-words">
                        <span class="word word-1">Love</span>
                        <span class="word word-2">Forever</span>
                        <span class="word word-3">Always</span>
                        <span class="word word-4">Together</span>
                        <span class="word word-5">Heart</span>
                        <span class="word word-6">Soul</span>
                        <span class="word word-7">Dream</span>
                        <span class="word word-8">Kiss</span>
                        <span class="word word-9">Embrace</span>
                        <span class="word word-10">Eternity</span>
                    </div>
                    <div class="background-hearts">
                        <span class="heart heart-1">♥</span>
                        <span class="heart heart-2">♥</span>
                        <span class="heart heart-3">♥</span>
                        <span class="heart heart-4">♥</span>
                        <span class="heart heart-5">♥</span>
                        <span class="heart heart-6">♥</span>
                        <span class="heart heart-7">♥</span>
                        <span class="heart heart-8">♥</span>
                        <span class="heart heart-9">♥</span>
                        <span class="heart heart-10">♥</span>
                        <span class="heart heart-11">♥</span>
                        <span class="heart heart-12">♥</span>
                    </div>
                    <div class="full-screen-content fade-in animating">
                        <div class="blank-page">
                            <!-- Blank page for your content -->
                        </div>
                    </div>
                `;
                
                // Trigger fade-in animation with proper cleanup
                requestAnimationFrame(() => {
                    const newContent = document.querySelector('.full-screen-content');
                    if (newContent) {
                        newContent.classList.remove('fade-in');
                        
                        // Clean up will-change
                        setTimeout(() => {
                            newContent.classList.remove('animating');
                        }, 500);
                    }
                });
            }
        }, 300); // Wait for fade-out to complete
    }
}

function collapseFromFullScreen() {
    const fullScreenOverlay = document.getElementById('fullScreenOverlay');
    if (fullScreenOverlay) {
        fullScreenOverlay.classList.add('animating');
        fullScreenOverlay.classList.remove('show');
        
        setTimeout(() => {
            fullScreenOverlay.remove();
        }, 600);
    }
    
    // Reset the original letter state
    wrapper.classList.remove("open");
    closeBtn.style.display = "none";
    openBtn.style.display = "inline-block";
}
  