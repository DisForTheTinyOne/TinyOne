onload = () => {
    document.body.classList.remove("container");
    
    // Automatically open the letter after 10 seconds
    setTimeout(() => {
        if (openBtn.style.display !== "none") {
            openBtn.click();
        }
    }, 12000);
};

const wrapper = document.querySelector(".wrapper");
const openBtn = document.getElementById("openBtn");

// Performance-optimized event listeners
openBtn.addEventListener("click", () => {
    // Add sparkle effect to button
    openBtn.classList.add('bursting');
    
    // Create heart burst effect first
    createHeartBurst();
    
    // Disable button to prevent multiple clicks and layout shifts
    setTimeout(() => {
        openBtn.disabled = true;
        openBtn.classList.add('disabled');
        openBtn.classList.remove('bursting');
    }, 600);
    
    // Add animating class and optimize will-change
    const lids = document.querySelectorAll('.lid');
    const letter = document.querySelector('.letter');
    
    lids.forEach(lid => lid.classList.add('animating'));
    letter.classList.add('animating');
    
    wrapper.classList.add("open");
    
    // Clean up will-change after animations complete
    setTimeout(() => {
        lids.forEach(lid => lid.classList.remove('animating'));
        letter.classList.remove('animating');
    }, 1500);
    
    // After the letter opens, expand it to full screen
    setTimeout(() => {
        expandToFullScreen();
    }, 3500 );
});

function createHeartBurst() {
    const button = document.getElementById('openBtn');
    const buttonRect = button.getBoundingClientRect();
    const buttonX = buttonRect.left + buttonRect.width / 2;
    const buttonY = buttonRect.top + buttonRect.height / 2;
    
    // Create 15 hearts for a nice burst effect
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.innerHTML = ['💕', '💖', '💗', '💘', '💝', '❤️', '🧡', '💛', '💚', '💙', '💜'][Math.floor(Math.random() * 11)];
        
        // Position heart at button center
        heart.style.left = buttonX + 'px';
        heart.style.top = buttonY + 'px';
        
        // More random directions and distances
        const angle = Math.random() * Math.PI * 2; // Completely random angle
        const distance = 80 + Math.random() * 1000; // More varied distances
        const endX = buttonX + Math.cos(angle) * distance;
        const endY = buttonY + Math.sin(angle) * distance;
        
        heart.style.setProperty('--end-x', endX + 'px');
        heart.style.setProperty('--end-y', endY + 'px');
        heart.style.setProperty('--rotation', (Math.random() - 0.5) * 720 + 'deg');
        heart.style.setProperty('--delay', (i * 0.05) + 's');
        
        document.body.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
    }
}

// Add event listener for continue button (to go to second page)
document.addEventListener("click", (e) => {
    if (e.target.id === "continueBtn") {
        showSecondPage();
    } else if (e.target.id === "spendTimeBtn") {
        showSpendTimeModal();
    } else if (e.target.id === "confirmSpendTime") {
        handleSpendTimeConfirm();
    } else if (e.target.id === "cancelSpendTime") {
        hideSpendTimeModal();
    } else if (e.target.classList.contains("modal-overlay")) {
        hideSpendTimeModal();
    }
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
                        <div class="video-page">
                            <div class="video-container">
                                <iframe id="youtubeVideo" 
                                        src="https://www.youtube.com/embed/ftGPty-dQR8" 
                                        title="YouTube video player" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                        allowfullscreen>
                                </iframe>
                            </div>
                            <div class="spend-time-section">
                                <button id="spendTimeBtn" class="spend-time-btn">Let's spend time 💕</button>
                            </div>
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
    openBtn.disabled = false;
    openBtn.classList.remove('disabled');
}

function showSpendTimeModal() {
    const modal = document.createElement('div');
    modal.id = 'spendTimeModal';
    modal.className = 'modal-overlay animating';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>💕 Spend Time Together</h3>
            </div>
            <div class="modal-body">
                <p>Are you ready to spend some quality time together?</p>
                <p>This moment is just for us!</p>
            </div>
            <div class="modal-actions">
                <button id="confirmSpendTime" class="confirm-btn">Yes, let's do it! 💕</button>
                <button id="cancelSpendTime" class="cancel-btn">Maybe later</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trigger fade-in animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.add('show');
            
            // Clean up will-change after animation
            setTimeout(() => {
                modal.classList.remove('animating');
            }, 300);
        });
    });
}

function hideSpendTimeModal() {
    const modal = document.getElementById('spendTimeModal');
    if (modal) {
        modal.classList.add('animating');
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

async function handleSpendTimeConfirm() {
    hideSpendTimeModal();
    
    // Disable the spend time button
    const spendTimeBtn = document.getElementById('spendTimeBtn');
    if (spendTimeBtn) {
        spendTimeBtn.disabled = true;
        spendTimeBtn.classList.add('disabled');
        spendTimeBtn.textContent = 'Notification sent 💕';
    }
    
    // Send email notification using EmailJS
    try {
        const templateParams = {
            to_email: 'ilan.mamontov@gmail.com', // Replace with your actual email
            subject: '💕 Valentine Confirmation!',
            message: '💕 AMAZING NEWS! She wants to spend time with you! Your Valentine just confirmed! Time to get ready! 💕',
            from_name: 'Your Valentine Website',
            timestamp: new Date().toLocaleString()
        };
        
        // Send email using EmailJS
        const result = await emailjs.send('service_4lo9jqr', 'template_qe1ks7t', templateParams);
        
        console.log('Email sent successfully!', result.status, result.text);
        
    } catch (error) {
        console.error('Error sending email:', error);
    }
    
    // Show a sweet confirmation message
    const confirmMessage = document.createElement('div');
    confirmMessage.className = 'confirm-message';
    confirmMessage.innerHTML = `
        <div class="message-content">
            <h3>Perfect! 💕</h3>
            <p class="email-status">I have been notified little one, I'm on my way!</p>
            <div class="hearts-animation">💕</div>
        </div>
    `;
    
    document.body.appendChild(confirmMessage);
    
    // Remove message after 12 seconds (even longer to enjoy the sweet message)
    setTimeout(() => {
        confirmMessage.remove();
    }, 12000);
}
  