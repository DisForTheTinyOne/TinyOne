onload = () => {
    document.body.classList.remove("container");
    
    // // Automatically open the letter after 10 seconds
    // setTimeout(() => {
    //     if (openBtn.style.display !== "none") {
    //         openBtn.click();
    //     }
    // }, 12000);
};

// Helper function to check if we're running locally (disable emails during testing)
function isLocalEnvironment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' || 
           window.location.protocol === 'file:' ||
           window.location.hostname === '';
}

// Helper function to send email only in production
async function sendEmailIfProduction(templateParams) {
    if (isLocalEnvironment()) {
        console.log('🚫 Email sending disabled in local environment');
        console.log('📧 Would have sent email with params:', templateParams);
        return { status: 'skipped', text: 'Local environment' };
    }
    
    try {
        const result = await emailjs.send('service_4lo9jqr', 'template_qe1ks7t', templateParams);
        console.log('✅ Email sent successfully!', result.status, result.text);
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}

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
        
        await sendEmailIfProduction(templateParams);
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
    
    // After the letter opens, show daily thoughts page
    setTimeout(() => {
        showDailyThoughtsPage();
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
            
            await sendEmailIfProduction(templateParams);
        } catch (error) {
            console.error('Error sending continue button email:', error);
        }
        
        showSecondPage();
    } else if (e.target.id === "continueToLetter") {
        // Navigate from daily thoughts to main letter
        expandToFullScreen();
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

// Daily thoughts data - easy to add new days (ordered by descending date - newest first)
const dailyThoughts = [
    {
        date: "7/07",
        title: "July 7th",
        text: `hello hello this is day number #2

i am all cozied up in bed now after a rough work day. windows open and it be reallyyyyy cold but im under my blankies butt ass naked so im in a happy state. just ate some mcdonalds which is not good not good, but also kind of soul-healing

i think i am addicted to mcdonalds burgers i switched it up from eating subways. i really got to start getting my steps in tommorrow so tmrw my goal is 30k steps no jokes

anyways i think today im doing better mentally... definitely not better physically. I had to poop 4 times today and the pooping seshs were not looking good - i think it is the mcdonalds diet. im kinda getting hungry now so i might get a burrito from the food truck but im also butt ass naked and putting clothes on might be a bit too much effort. internal conflict is very real

work day kinda sucked today tho, i was paged 11 times throughout the day which isnt unheard of but not a fun experience. also the guy who was on call last week did not wrap up all the on work tasks so when i woke up i already had a bunch on my plate

for lunch i had greek food aka nick the greek wraps they had a 2 for 1 deal. they are really fire i had to ask for no fries in the wraps cause i feel they ruin the wrap. for dinner i had 2 double cheese burgers from mcdonalds. starting tomorrow im going back on the health grind... maybe

i've also redesigned this page a bit during a 30 mins call. im actually proud on how this page turned out to look like feels like im a professional UI designer. i'll prob clean it up a bit more after i have my 5th poop of the day tonight

other than working for 14 hours today, i also did alllll my laundry took 4 whole loads. i also cleaned up a lafufu by hand using a gentle soap. i think the lafufu turned out pretty well, smells good too. fresh laundry and clean lafufu equals peak serotonin

also while browsing tik tok during my 4th poop of the day i got a lot of clips of saturdays block party. apparently audien was such a vibe which makes me sad i missed it. alan walker was also vibe at the end where i missed it as well. fomo is not good

side thought => while working on this lil daily thoughts page i had a few fun ideas i'll prob add in in a few days when my on call days isnt too loaded - it'll be fun i think. my one brain cell having a mini creative spark

so yaaaa today was kinda uneventful the picture of the day is just my love sac filled with clean laundry and a clean lafufu. just wholesome

i really want to watch how to train your dragon so if tomorrow im not overwhelmed with on call, im thinking of going and grabbing chipotle, sneaking in a couple drinks and watching the movie alone. im thinking of doing more solo dates to get out of my house more often. sounds kinda healing tbh

at the same time my friends asked if i was free to game for a few hours tomorrow. i really wanna but same time i dont want to stare at my computer any longer, todays work sesh killed me

okiiiii i think thats it for tonight! im ready to pass out

also the last page is a little messed up on both mobile and desktop imma clean that up at some points

i think i need to automate how this picture upload works. rn i download a picture from my photos album, then i need to manually convert to .jpg and downsize for a smaller size - imma fix this at some point

goodnight everybody`,
        photo: "images/Jul7.jpg" // No photo yet - mentioned love sac with laundry and lafufu
    },
    {
        date: "7/06",
        title: "July 6th",
        text: `okiiiiii so this is my first day of writing
I figured this will be my spot to journal and end my days writing

instead of laying in bed on my phone, instead i'll just write for a bit and just voice my thoughts where i talk to myself in a way

i haven't really decided on how i will design this page but i've spent about 10 minutes on this design so that'll do for day numero uno

where do i start where do i start -- these past couple days i haven't been feeling well
even tho this is a long holiday aka july 4th where people celebrate together with friends and family i felt pretty alone

I usually celebrated canada day which was on monday, and previously celebrated july 4th with my bro, but i havent seen him or my nephews in over a month. mostly because he was travelling and i kinda closed myself off which is not good

i was also supposed to hang out with a couple who invited me for food, but i never made it. i sent money to them via venmo to help them out with the food and drinks but they refunded me early this morning with a not so happy message which made me wake up in a sad state. not only was i late to theyre last hosting by a couple hours, i fully missed this one -- not sure if they'll invite me again at this point oops

yesterday i also went to a block party, never again am i going to one of those alone. block parties are for sure a thing you go as a group -- lesson learned

anyways today wasnt any better. it is 1am right now and i am dreading this upcoming week. i'm so tired and im on call which makes things even harder

the whole plan for today was to clean my apartment to bring it to a state where i feel a bit happy walking around while im dealing with work but i made no progress today

this is my picture of the day -- i ended up ordering chipotle and watching a movie about tetris while my feetsies are in the pocketsies. movie ended up a lot more dramatic than i expected but i at least i felt a bit happy and made me forget about all the work stuff i gotta do next week. Wish i couldve gamed with my friends instead but they were all busy

i was a bit sleepy before i started writing this but i kinda woke myself up. i need to wake up at 630 am for my on call shift so i pretty much have to force myself to sleep

this be day 1 of my thoughts and i'll improve on how i continue with this

oh and also i improved how this looks like on a phone, the copy is not cutoff anymore! and the text takes more space on the page
but i think i might've broken something on the desktop version :( i'll have to fix it later

peace`,
        photo: "images/Jul6.jpg"
    }
    // Add more days here as needed
];

function showDailyThoughtsPage() {
    // Create full-screen overlay for daily thoughts
    const dailyThoughtsOverlay = document.createElement('div');
    dailyThoughtsOverlay.id = 'dailyThoughtsOverlay';
    dailyThoughtsOverlay.classList.add('animating');
    
    // Generate tabs HTML
    const tabsHTML = dailyThoughts.map((day, index) => 
        `<div class="tab-button ${index === 0 ? 'active' : ''}" data-day="${index}">
            (${day.date})
        </div>`
    ).join('');
    
    // Generate tab content HTML
    const tabContentHTML = dailyThoughts.map((day, index) => 
        `<div class="tab-content ${index === 0 ? 'active' : ''}" data-day="${index}">
            <div class="daily-entry">
                <h3>${day.title}</h3>
                <div class="entry-layout ${day.photo ? '' : 'no-photo'}">
                    <div class="entry-text">
                        <div class="text-content">${day.text.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '<br>').join('')}</div>
                    </div>
                    ${day.photo ? `
                    <div class="entry-photo">
                        <img src="${day.photo}" />
                        <p class="photo-caption">A moment from ${day.date} • Click to enlarge</p>
                    </div>` : ''}
                </div>
            </div>
        </div>`
    ).join('');
    
    dailyThoughtsOverlay.innerHTML = `
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
        <div class="full-screen-content animating daily-thoughts-content">
            <div class="daily-thoughts-page">
                <div class="page-header">
                    <h1>Daily Thoughts</h1>
                    <p class="header-subtitle">How am I feeling today?</p>
                </div>
                
                <div class="tabs-container">
                    <p class="tab-instruction">Click on any date tab to read that day's thoughts</p>
                    <div class="tab-buttons">
                        ${tabsHTML}
                    </div>
                    
                    <div class="tab-contents">
                        ${tabContentHTML}
                    </div>
                </div>
                
                <button id="continueToLetter" class="continue-to-letter-btn">Continue to Letter →</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dailyThoughtsOverlay);
    
    // Add event listeners for tabs
    const tabButtons = dailyThoughtsOverlay.querySelectorAll('.tab-button');
    const tabContents = dailyThoughtsOverlay.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dayIndex = button.dataset.day;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const activeContent = dailyThoughtsOverlay.querySelector(`.tab-content[data-day="${dayIndex}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
                
                // Force refresh of scroll containers after tab switch
                setTimeout(() => {
                    const textContent = activeContent.querySelector('.text-content');
                    if (textContent) {
                        textContent.scrollTop = textContent.scrollTop; // Force reflow
                    }
                }, 50);
            }
        });
    });
    
    // Trigger smoother fade-in animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            dailyThoughtsOverlay.classList.add('show');
            
            // Clean up will-change after animation
            setTimeout(() => {
                dailyThoughtsOverlay.classList.remove('animating');
                const content = dailyThoughtsOverlay.querySelector('.full-screen-content');
                if (content) content.classList.remove('animating');
                
                // Force refresh of the initial active tab's scroll container
                const initialActiveTab = dailyThoughtsOverlay.querySelector('.tab-content.active');
                if (initialActiveTab) {
                    const textContent = initialActiveTab.querySelector('.text-content');
                    if (textContent) {
                        textContent.scrollTop = textContent.scrollTop; // Force reflow
                    }
                }
            }, 800);
        });
    });
}

function expandToFullScreen() {
    // Remove daily thoughts overlay first
    const dailyThoughtsOverlay = document.getElementById('dailyThoughtsOverlay');
    if (dailyThoughtsOverlay) {
        dailyThoughtsOverlay.remove();
    }
    
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
                
                <div class="missing-you-section">
                    <h3>Here's a few things I miss about the little one</h3>
                    
                    <div class="missing-item">
                        <p>Our late night facetime calls that can last hours, and how you get eepy eepy and fall asleep on me</p>
                    </div>
                    
                    <div class="missing-item">
                        <p>Feeding the tiny one first thing in the morning in bed while you have the eepy eyes</p>
                    </div>
                    
                    <div class="missing-item">
                        <p>Yapping with you for hours about nothing at all, and not remembering what we yapped about the next day</p>
                    </div>
                    
                    <div class="missing-item">
                        <p>The comfort of your presence just being near you made everything feel okay</p>
                    </div>
                    
                    <div class="missing-item">
                        <p>How we could spend all day together and still not get tired of each other, running errands, working side by side, growing my potato</p>
                    </div>
                    
                    <div class="missing-item">
                        <p>Falling into easy routines together, like binge-watching shows, and feeling completely myself the whole time</p>
                    </div>
                    
                    <div class="missing-item">
                        <p>Obviously texting you every day and not being able to wait to see you, our good morning and goodnight texts</p>
                    </div>
                    
                    <div class="missing-item">
                        <p>Waking up next to you and feeling like we've been together forever cuddling up and falling back asleep</p>
                    </div>
                </div>
                
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
                    <p>Don't worry if you accidentally press it, there's a confirmation button to make sure your fatass fingers didn't hit it by mistake (kidding, kidding, you know I love your chunky little kitten paws)</p>
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
        const result = await sendEmailIfProduction(templateParams);
        
    } catch (error) {
        console.error('Error sending email:', error);
        if (!isLocalEnvironment()) {
            alert('⚠️ Notification failed to send. Please text me instead');
        }
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

// Image Modal Functionality
function createImageModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <img src="" alt="Expanded image">
            <button class="image-modal-close">&times;</button>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function openImageModal(imageSrc, imageAlt = '') {
    let modal = document.querySelector('.image-modal');
    if (!modal) {
        modal = createImageModal();
    }
    
    const modalImg = modal.querySelector('img');
    modalImg.src = imageSrc;
    modalImg.alt = imageAlt;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Add click handlers for images
document.addEventListener('click', (e) => {
    // Handle image clicks
    if (e.target.matches('.entry-photo img, .daily-entry img')) {
        e.preventDefault();
        openImageModal(e.target.src, e.target.alt);
    }
    
    // Handle modal close
    if (e.target.matches('.image-modal-close, .image-modal')) {
        e.preventDefault();
        closeImageModal();
    }
    
    // Prevent modal close when clicking on image content
    if (e.target.matches('.image-modal-content, .image-modal img')) {
        e.stopPropagation();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});
  