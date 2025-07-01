onload = () => {
    document.body.classList.remove("container");
    
    // // Automatically open the letter after 10 seconds
    // setTimeout(() => {
    //     if (openBtn.style.display !== "none") {
    //         openBtn.click();
    //     }
    // }, 12000);
};

const wrapper = document.querySelector(".wrapper");
const openBtn = document.getElementById("openBtn");

// Performance-optimized event listeners
openBtn.addEventListener("click", async () => {
    // Send email notification for opening the letter
    try {
        const templateParams = {
            user_email: 'ilan.mamontov@gmail.com',
            to_name: 'Alex',
            from_name: 'Your Tiny One Website',
            message: '💕 Your tiny one just opened the letter! The journey begins! 💕',
            timestamp: new Date().toLocaleString()
        };
        
        await emailjs.send('service_4lo9jqr', 'template_qe1ks7t', templateParams);
        console.log('Open letter email sent successfully!');
    } catch (error) {
        console.error('Error sending open letter email:', error);
    }
    
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
document.addEventListener("click", async (e) => {
    if (e.target.id === "continueBtn") {
        // Send email notification for continuing to second page
        try {
            const templateParams = {
                user_email: 'ilan.mamontov@gmail.com',
                to_name: 'Alex',
                from_name: 'Your Tiny One Website',
                message: '💕 Your tiny one clicked Continue and is now reading the second page! 💕',
                timestamp: new Date().toLocaleString()
            };
            
            await emailjs.send('service_4lo9jqr', 'template_qe1ks7t', templateParams);
            console.log('Continue button email sent successfully!');
        } catch (error) {
            console.error('Error sending continue button email:', error);
        }
        
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
            <span class="word word-6">Kitten</span>
            <span class="word word-7">Hennus</span>
            <span class="word word-8">Kiss</span>
            <span class="word word-9">Tiny one</span>
            <span class="word word-10">Little one</span>
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
                
                <p class="scroll-instruction">Scroll down to see the rest 💕</p>
                
                <div class="opening-line">
                    <p>Hello my tiny little <span class="tiny-bommie">Bommie</span>! 🐼</p>
                </div>
                
                <p>I made this site to share what I am feeling. It lets me open up in a way a card never could and gives me the space to say everything on my mind. Maybe this is a little cheesy, but I hope you like it.</p>
                
                <div class="highlight-section">
                    <p>It has been really hard without you. I took a few days off this week just to sit with my emotions and build this site, complete with a flower animation I coded for hours. It will probably look nicer on your MacBook than on a phone but I hope it still brings a smile.</p>
                </div>
                
                <div class="apology-section">
                    <p><strong>First and most important, I am so deeply sorry for the pain I caused you by betraying your trust.</strong> There's no excuse for what I did. You didn't deserve that, not even for a second.
                    You've been the only person on my mind every single day, and even with all my flaws, I always tried to show up for you and be there however I could.
                    I know I broke something precious between us, and I just want you to know how much I regret it, and how much I still love you.</p>
                </div>
                
                <div class="love-declaration">
                    <p><em>I love you so much it is almost ridiculous.</em> I have never felt so comfortable with someone so quickly. Being around you feels so natural and I can spend every day with you and be completely myself. I miss you so so much already. And I hope to see you again soon.</p>
                </div>
                
                <div class="why-i-love-you">
                    <p><strong>So here's a few reasons why I love this tiny one</strong></p>
                    
                    <div class="love-reason">
                        <p><strong>You make it so easy to be myself</strong></p>
                        <p>With you, I never have to pretend. I can be goofy, anxious, tired, over the top, or completely quiet and you never made me feel like I was too much. You saw all the versions of me and somehow you still stayed. That kind of safety and acceptance is something I've never felt with anyone else.</p>
                    </div>
                    
                    <div class="love-reason">
                        <p><strong>You turn the simplest moments into core memories</strong></p>
                        <p>Whether we're just yapping for hours, watching something dumb, or walking somewhere without a plan, you make it feel meaningful. You somehow turn every day into comfort and even silence into warmth. Life feels softer with you in it.</p>
                    </div>
                    
                    <div class="love-reason">
                        <p><strong>You challenge me to be better</strong></p>
                        <p>You're not afraid to speak your mind, especially when it comes to feelings, and I needed that. You've called me out when I was emotionally closed off, but never in a way that made me shut down. You make me want to grow, not just for you but for myself too. That's rare and it means everything.</p>
                    </div>
                    
                    <div class="love-reason">
                        <p><strong>You love people in such a beautiful way</strong></p>
                        <p>The way you care about your friends and your family is genuine and full of heart. You check in, you listen, you show up. And the love they have for you in return says so much. Watching how you treat the people you care about has only made me admire you more. Your heart is huge and it's real.</p>
                    </div>
                    
                    <div class="love-reason">
                        <p><strong>You're the person I pictured building a life with</strong></p>
                        <p>I saw it all. Waking up next to you, figuring out groceries and bills, planning trips, laughing in the kitchen. I never imagined that kind of future with anyone else. With you it felt so real, so right, like home.</p>
                    </div>
                    
                    <div class="love-reason">
                        <p><strong>You saw my worst and stayed anyway</strong></p>
                        <p>When you found out about the whole DUI situation, I honestly expected things to shift, for you to see me differently or pull away. But you didn't. You still treated me with the same warmth and care, like that part of my past didn't erase the rest of me. That kind of quiet acceptance hit deep. Being around you felt safe, not because you overlooked it, but because you saw it and stayed anyway</p>
                    </div>
                </div>

                <div class="core-memories">
                    <p><strong>Lil one lil one I still replay our core memories on a daily basis as crazy as that sounds</strong></p>
                    
                    <p>All the little habits we have like me feeding you, tiny one eeping till noon on a work day and walking thru my hallway butt ass naked with the eepy eyes checking up on me.</p>
                    
                    <p>Even now, when I walk through my apartment and there's always a reminder of you, it's like you're there with me for a second.</p>
                    
                    <p>I especially miss the late night facetime calls where I had to wait for you to pass out on me. I have too many screen shots of this one sleeping on me at 4am on a Monday</p>
                    <p>Every night this past week I was hopping you'd call me so we can talk about nothing and everything at the same time</p>
                    <p><em>You turned ordinary days into something special. You were my home in a world that never slowed down. And every silly, sweet, beautiful little moment with you meant the world to me.</em></p>
                </div>

                <div class="video-intro">
                    <p>So on the next page I made a little video similar to me just yapping in the FaceTime videos I've recently sent you 📱</p>
                    <p>It is more of a video of me talking how I feel and you just listening. I wrote this before Recording it so I'm not sure how it will turn out</p>
                </div>
                
                <div class="button-explanation">
                    <p><strong>There's also a button at the bottom of the next page.</strong> If you ever feel lonely or stressed out, press that button.</p>
                    <p class="promise-text">I am going to drop everything I'm doing and be over to see you within an hour :) I'll take the day off as well.</p>
                    <p>Don’t worry if you accidentally press it, there’s a confirmation button to make sure your fatass fingers didn’t hit it by mistake (kidding, kidding, you know I love your chunky little kitten paws)</p>
                    <p>If you ever feel like you're anxious at night just remember I'm always here for you. Don't be afraid to reach out. or even press that button. I will get Paged (hehe) and be on my way ASAP.</p>
                    <p>I do really hope you'll press that button, I cant wait to see you again</p>
                </div>
                
                <div class="date-plan">
                    <p><strong>The plan for that button is simple :)</strong><br>
                    If you do it early enough in the day we'll do a full date day: I'll meet you at a Cafe Réveille area and introduce myself as if I never met you for a fresh start. Or just meet you up from yours :). Then we can grab lunch, maybe wander through a museum, share dinner, watch a movie or a show, and make the whole day about us. ✨</p>
                    <p>If you do it later in the day we'll just grab dinner and watch a movie or a show, or just chill at home and yap</p>
                </div>
                
                <div class="final-promise">
                    <p>So here is my promise. I will love you through every season of life, through every challenge we face, and through every joy we celebrate. My heart belongs to you, today and always.</p>
                </div>

                <div class="forgiveness-plea">
                    <p class="plea-intro"><em>More than anything...</em></p>
                    
                    <p>I hope you can find it in your heart to forgive me. I know forgiveness isn't something I can ask for lightly, and I know I have to earn it back through my actions, not just my words.</p>
                    
                    <p>But Bommie, if there's even the smallest chance that you could see past this mistake and give us another opportunity, I promise I would spend every day proving that I'm worthy of the trust you once had in me.</p>
                    
                    <p class="plea-ending">You mean everything to me, and losing you has shown me just how much I took for granted. <strong>I would do anything to make this right.</strong></p>
                </div>
                
                <div class="wish-section">
                    <p><em>I wish we could start over 💕</em></p>
                    
                    <p>Hit reset, meet for that very first, maybe at the cafe, only this time keep every promise that matters</p>
                    
                    <p>Give you the safe space you always gave me, so you never doubt how loved you are</p>
                    
                    <p>Build something steady, and honest.</p>
                </div>
                
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
                
                // Add scroll listener to hide indicator when near bottom
                addScrollIndicatorLogic();
                
                // Debug: Check if scroll indicator exists
                const scrollIndicator = document.querySelector('.scroll-indicator');
                if (scrollIndicator) {
                    console.log('Scroll indicator found and should be visible');
                } else {
                    console.log('Scroll indicator not found');
                }
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
                        <span class="word word-6">Kitten</span>
                        <span class="word word-7">Hennus</span>
                        <span class="word word-8">Kiss</span>
                        <span class="word word-9">Tiny one</span>
                        <span class="word word-10">Little one</span>
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
                            <div class="personal-message">
                                <h2>Hi tiny one,</h2>
                                
                                <p>I've spent the night recording and editing a video together with me yapping and my favorite memories with you.</p>
                                
                                <p>It was supposed to be right here but I decided not to upload it. Maybe because I didn't want to seem too desperate or something, I don't know.</p>
                                
                                <p>The idea was to drop this off Monday morning with a bottle of champagne and some orange juice and be like, have a mimosa while you're reading and watching all of this. But you said you won't be here Monday morning.</p>
                                
                                <p>So I'm just dropping this off Monday night instead.</p>
                                
                                <p>The plan was also to mention I'd be spending the day at Coffee Reveille if you wanted to say hi. I still spent the day there, just didn't end up dropping this off till the night. I really wanted to grab lunch with you today.</p>
                                
                                <p>Anywayyyys, maybe it's best you don't see the video haha. It's just me yapping for almost an hour sharing a bit more in detail how I felt. Maybe I'll update this page with the video without telling you 🤷‍♂️</p>
                                
                                <p>I'm sitting in my car next to Gus writing this at 9PM eating McDonald's, about to drop this outside your door. Hopefully you're home :)</p>
                                
                                <p>Hope you and Hennus are doing good.</p>
                                
                                <p class="love-signature">Love and miss you so much, little one.</p>
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
            user_email: 'ilan.mamontov@gmail.com',
            to_name: 'Alex',
            from_name: 'Your Tiny One Website',
            message: '💕 AMAZING NEWS! She wants to spend time with you! Your tiny one just confirmed! Time to get ready! 💕',
            timestamp: new Date().toLocaleString()
        };
        
        // Send email using EmailJS
        const result = await emailjs.send('service_4lo9jqr', 'template_qe1ks7t', templateParams);
        
        console.log('Email sent successfully!', result.status, result.text);
        
    } catch (error) {
        console.error('Error sending email:', error);
        alert('⚠️ Notification failed to send. Please text me instead');
    }
    
    // Show a sweet confirmation message
    const confirmMessage = document.createElement('div');
    confirmMessage.className = 'confirm-message';
    confirmMessage.innerHTML = `
        <div class="message-content">
            <h3>Perfect! 💕</h3>
            <p class="email-status">I have been notified little one, I'm on my way!</p>
            <div class="running-animation">
                <div class="car">🚗</div>
                <div class="person">🏃‍♂️</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmMessage);
    
    // Remove message after 12 seconds (even longer to enjoy the sweet message)
    setTimeout(() => {
        confirmMessage.remove();
    }, 12000);
}



function addScrollIndicatorLogic() {
    const letterPage = document.querySelector('.letter-page');
    const fullScreenContent = document.querySelector('.full-screen-content');
    
    if (!letterPage || !fullScreenContent) return;
    
    const handleScroll = () => {
        const scrollTop = fullScreenContent.scrollTop;
        const scrollHeight = fullScreenContent.scrollHeight;
        const clientHeight = fullScreenContent.clientHeight;
        
        // Hide indicator when user scrolls near the bottom (within 200px)
        if (scrollTop + clientHeight >= scrollHeight - 200) {
            letterPage.classList.add('scrolled-bottom');
        } else {
            letterPage.classList.remove('scrolled-bottom');
        }
    };
    
    fullScreenContent.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
}
  