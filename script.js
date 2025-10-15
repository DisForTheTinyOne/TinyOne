onload = () => {
    document.body.classList.remove("container");
    
    // Set random flower colors based on today's date
    setDailyFlowerColors();
    
    // // Automatically open the letter after 10 seconds
    // setTimeout(() => {
    //     if (openBtn.style.display !== "none") {
    //         openBtn.click();
    //     }
    // }, 12000);
};

// Function to generate seeded random numbers (same day = same colors)
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Function to set daily flower colors
function setDailyFlowerColors() {
    // Create a date seed (same for entire day)
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
        seed += dateString.charCodeAt(i);
    }
    
    // Light, cute color palette
    const lightColors = [
        // Light pinks
        { main: '#f9a8d4', gradient: '#ec4899' }, // soft pink
        { main: '#fbbf24', gradient: '#f59e0b' }, // light yellow
        { main: '#fb7185', gradient: '#e11d48' }, // light coral
        
        // Light blues
        { main: '#93c5fd', gradient: '#60a5fa' }, // sky blue
        { main: '#67e8f9', gradient: '#06b6d4' }, // light cyan
        { main: '#a7f3d0', gradient: '#10b981' }, // light mint
        
        // Light purples
        { main: '#c4b5fd', gradient: '#a855f7' }, // lavender
        { main: '#d8b4fe', gradient: '#c084fc' }, // light purple
        { main: '#fda4af', gradient: '#f43f5e' }, // light rose
        
        // Light greens
        { main: '#bbf7d0', gradient: '#22c55e' }, // light green
        { main: '#fed7aa', gradient: '#fb923c' }, // light peach
        { main: '#fef3c7', gradient: '#fbbf24' }, // light cream
    ];
    
    // Select 3 different colors using seeded random
    const selectedColors = [];
    const usedIndices = [];
    
    for (let i = 0; i < 3; i++) {
        let colorIndex;
        do {
            seed = (seed * 9301 + 49297) % 233280; // Linear congruential generator
            colorIndex = Math.floor(seededRandom(seed) * lightColors.length);
        } while (usedIndices.includes(colorIndex));
        
        usedIndices.push(colorIndex);
        selectedColors.push(lightColors[colorIndex]);
    }
    
    // Apply colors to each flower via CSS custom properties
    const root = document.documentElement;
    
    selectedColors.forEach((color, index) => {
        const flowerNum = index + 1;
        root.style.setProperty(`--flower-${flowerNum}-main`, color.main);
        root.style.setProperty(`--flower-${flowerNum}-gradient`, color.gradient);
    });
}

// Helper function to check if we're running locally (disable emails during testing)
function isLocalEnvironment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' || 
           window.location.protocol === 'file:' ||
           window.location.hostname === '';
}

// Helper function to get comprehensive device information (no permissions required)
function getDeviceInfo() {
    const nav = navigator;
    const screen = window.screen;
    const deviceInfo = {
        // Browser & Engine Info
        userAgent: nav.userAgent,
        vendor: nav.vendor || 'Unknown',
        platform: nav.platform,
        language: nav.language,
        languages: nav.languages ? nav.languages.join(', ') : 'Unknown',
        cookieEnabled: nav.cookieEnabled,
        onLine: nav.onLine,
        
        // Screen & Display Info
        screenWidth: screen.width,
        screenHeight: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        pixelRatio: window.devicePixelRatio || 1,
        
        // Window & Viewport Info
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        
        // Hardware Info (if available)
        hardwareConcurrency: nav.hardwareConcurrency || 'Unknown',
        maxTouchPoints: nav.maxTouchPoints || 0,
        
        // Connection Info (if available)
        connection: nav.connection ? {
            effectiveType: nav.connection.effectiveType,
            downlink: nav.connection.downlink,
            rtt: nav.connection.rtt,
            saveData: nav.connection.saveData
        } : 'Not available',
        
        // Memory Info (if available)
        deviceMemory: nav.deviceMemory || 'Unknown',
        
        // Timezone & Time Info
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        
        // Battery (if available - usually not without permission)
        batteryAPI: 'getBattery' in nav ? 'Available' : 'Not available',
        
        // Touch & Input
        touchSupport: 'ontouchstart' in window || nav.maxTouchPoints > 0,
        
        // WebGL Info
        webglSupport: (() => {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    return {
                        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
                        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
                    };
                }
                return 'Not supported';
            } catch (e) {
                return 'Error detecting WebGL';
            }
        })(),
        
        // Permissions API
        permissionsAPI: 'permissions' in nav ? 'Available' : 'Not available',
        
        // Service Worker
        serviceWorkerSupport: 'serviceWorker' in nav ? 'Available' : 'Not available',
        
        // Storage
        localStorage: (() => {
            try {
                return typeof(Storage) !== "undefined" ? 'Available' : 'Not available';
            } catch (e) {
                return 'Error checking localStorage';
            }
        })(),
        
        // Performance
        performanceAPI: 'performance' in window ? 'Available' : 'Not available',
        performanceTiming: window.performance && window.performance.timing ? {
            pageLoadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
            domReadyTime: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart,
            connectTime: window.performance.timing.connectEnd - window.performance.timing.connectStart
        } : 'Not available'
    };
    
    return deviceInfo;
}

// Helper function to format device info for email
function formatDeviceInfoForEmail(deviceInfo) {
    let formatted = '\n📱 DEVICE & SYSTEM INFORMATION:\n';
    formatted += `═══════════════════════════════════\n`;
    
    // Browser Info
    formatted += `🌐 BROWSER INFO:\n`;
    formatted += `  • User Agent: ${deviceInfo.userAgent}\n`;
    formatted += `  • Vendor: ${deviceInfo.vendor}\n`;
    formatted += `  • Platform: ${deviceInfo.platform}\n`;
    formatted += `  • Language: ${deviceInfo.language}\n`;
    formatted += `  • All Languages: ${deviceInfo.languages}\n`;
    formatted += `  • Cookies Enabled: ${deviceInfo.cookieEnabled}\n`;
    formatted += `  • Online Status: ${deviceInfo.onLine}\n\n`;
    
    // Screen Info
    formatted += `🖥️ SCREEN & DISPLAY:\n`;
    formatted += `  • Screen Resolution: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}\n`;
    formatted += `  • Available Screen: ${deviceInfo.availWidth}x${deviceInfo.availHeight}\n`;
    formatted += `  • Window Size: ${deviceInfo.windowWidth}x${deviceInfo.windowHeight}\n`;
    formatted += `  • Outer Window: ${deviceInfo.outerWidth}x${deviceInfo.outerHeight}\n`;
    formatted += `  • Color Depth: ${deviceInfo.colorDepth} bits\n`;
    formatted += `  • Pixel Depth: ${deviceInfo.pixelDepth} bits\n`;
    formatted += `  • Device Pixel Ratio: ${deviceInfo.pixelRatio}x\n\n`;
    
    // Hardware Info
    formatted += `⚡ HARDWARE INFO:\n`;
    formatted += `  • CPU Cores: ${deviceInfo.hardwareConcurrency}\n`;
    formatted += `  • Device Memory: ${deviceInfo.deviceMemory}GB\n`;
    formatted += `  • Touch Points: ${deviceInfo.maxTouchPoints}\n`;
    formatted += `  • Touch Support: ${deviceInfo.touchSupport}\n\n`;
    
    // Network Info
    if (deviceInfo.connection && typeof deviceInfo.connection === 'object') {
        formatted += `📡 NETWORK INFO:\n`;
        formatted += `  • Connection Type: ${deviceInfo.connection.effectiveType}\n`;
        formatted += `  • Downlink Speed: ${deviceInfo.connection.downlink} Mbps\n`;
        formatted += `  • Round Trip Time: ${deviceInfo.connection.rtt}ms\n`;
        formatted += `  • Data Saver: ${deviceInfo.connection.saveData}\n\n`;
    }
    
    // Time & Location Info
    formatted += `🕐 TIME & LOCATION:\n`;
    formatted += `  • Timezone: ${deviceInfo.timezone}\n`;
    formatted += `  • UTC Offset: ${deviceInfo.timezoneOffset} minutes\n\n`;
    
    // Graphics Info
    if (deviceInfo.webglSupport && typeof deviceInfo.webglSupport === 'object') {
        formatted += `🎮 GRAPHICS INFO:\n`;
        formatted += `  • GPU Vendor: ${deviceInfo.webglSupport.vendor}\n`;
        formatted += `  • GPU Renderer: ${deviceInfo.webglSupport.renderer}\n\n`;
    }
    
    // Performance Info
    if (deviceInfo.performanceTiming && typeof deviceInfo.performanceTiming === 'object') {
        formatted += `⚡ PERFORMANCE:\n`;
        formatted += `  • Page Load Time: ${deviceInfo.performanceTiming.pageLoadTime}ms\n`;
        formatted += `  • DOM Ready Time: ${deviceInfo.performanceTiming.domReadyTime}ms\n`;
        formatted += `  • Connection Time: ${deviceInfo.performanceTiming.connectTime}ms\n\n`;
    }
    
    // Feature Support
    formatted += `🔧 FEATURE SUPPORT:\n`;
    formatted += `  • Service Worker: ${deviceInfo.serviceWorkerSupport}\n`;
    formatted += `  • Local Storage: ${deviceInfo.localStorage}\n`;
    formatted += `  • Performance API: ${deviceInfo.performanceAPI}\n`;
    formatted += `  • Permissions API: ${deviceInfo.permissionsAPI}\n`;
    formatted += `  • Battery API: ${deviceInfo.batteryAPI}\n`;
    
    return formatted;
}

// Helper function to get IP-based location (no permission required)
async function getIPLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.city && data.region && data.country_name) {
            let locationInfo = `📍 LOCATION INFORMATION:\n`;
            locationInfo += `═══════════════════════════════════\n`;
            locationInfo += `🌍 GEOLOCATION (IP-based):\n`;
            locationInfo += `  • City: ${data.city}\n`;
            locationInfo += `  • Region/State: ${data.region}\n`;
            locationInfo += `  • Country: ${data.country_name} (${data.country_code})\n`;
            locationInfo += `  • Coordinates: ${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}\n`;
            locationInfo += `  • IP Address: ${data.ip}\n`;
            locationInfo += `  • ISP: ${data.org || 'Unknown'}\n`;
            locationInfo += `  • Postal Code: ${data.postal || 'Unknown'}\n`;
            locationInfo += `  • Currency: ${data.currency || 'Unknown'}\n`;
            locationInfo += `  • Timezone: ${data.timezone || 'Unknown'}\n`;
            locationInfo += `  • Calling Code: ${data.country_calling_code || 'Unknown'}\n`;
            
            return locationInfo;
        } else {
            return `📍 IP location failed: ${data.reason || 'Unknown error'}`;
        }
    } catch (error) {
        return `📍 IP location error: ${error.message}`;
    }
}

// Helper function to get comprehensive user information (no permission required)
async function getComprehensiveUserInfo() {
    // Get device info (synchronous)
    const deviceInfo = getDeviceInfo();
    
    // Get location info (asynchronous)
    const locationInfo = await getIPLocation();
    
    // Format device info for email
    const formattedDeviceInfo = formatDeviceInfoForEmail(deviceInfo);
    
    // Combine all information
    return {
        deviceInfo,
        locationInfo,
        formattedDeviceInfo,
        fullInfo: locationInfo + formattedDeviceInfo
    };
}

// Helper function to send email only in production
async function sendEmailIfProduction(templateParams) {
    if (isLocalEnvironment()) {
        console.log('🚫 Email sending disabled in local environment');
        console.log('📧 Would have sent email with params:', templateParams);
        return { status: 'skipped', text: 'Local environment' };
    }
    
    try {
        // Get comprehensive user information before sending email
        const userInfo = await getComprehensiveUserInfo();
        
        // Add comprehensive info to the message
        if (templateParams.message) {
            // Add original simple format at the top
            let simpleLocation = 'Location unknown';
            try {
                // Extract basic location info from the comprehensive data
                const deviceInfo = userInfo.deviceInfo;
                if (deviceInfo && deviceInfo.screenWidth) {
                    // Try to parse location from the detailed info
                    const locationLines = userInfo.locationInfo.split('\n');
                    let city = '', region = '', country = '';
                    
                    for (const line of locationLines) {
                        if (line.includes('• City: ')) {
                            city = line.split('• City: ')[1];
                        } else if (line.includes('• Region/State: ')) {
                            region = line.split('• Region/State: ')[1];
                        } else if (line.includes('• Country: ')) {
                            country = line.split('• Country: ')[1].split(' (')[0]; // Remove country code
                        }
                    }
                    
                    if (city && region && country) {
                        simpleLocation = `${city}, ${region}, ${country}`;
                    } else if (city && country) {
                        simpleLocation = `${city}, ${country}`;
                    } else if (country) {
                        simpleLocation = country;
                    }
                }
            } catch (error) {
                console.log('Error parsing simple location:', error);
            }
            
            const originalFormat = `\nLocation: ${simpleLocation}\nScreen width: ${window.innerWidth}px`;
            
            // Add timestamp info
            const now = new Date();
            const timeInfo = `\n\n⏰ TIMESTAMP INFORMATION:\n`;
            const timeFormatted = timeInfo + 
                `═══════════════════════════════════\n` +
                `  • Local Time: ${now.toLocaleString()}\n` +
                `  • UTC Time: ${now.toUTCString()}\n` +
                `  • ISO String: ${now.toISOString()}\n` +
                `  • Unix Timestamp: ${now.getTime()}\n` +
                `  • Day of Week: ${now.toLocaleDateString('en-US', { weekday: 'long' })}\n` +
                `  • Time Since Page Load: ${performance.now ? Math.round(performance.now()) + 'ms' : 'Unknown'}\n`;
            
            // Add referrer and page info
            const pageInfo = `\n📄 PAGE INFORMATION:\n`;
            const pageFormatted = pageInfo +
                `═══════════════════════════════════\n` +
                `  • Current URL: ${window.location.href}\n` +
                `  • Page Title: ${document.title}\n` +
                `  • Referrer: ${document.referrer || 'Direct visit'}\n` +
                `  • Document Ready State: ${document.readyState}\n` +
                `  • Page Visibility: ${document.visibilityState || 'Unknown'}\n` +
                `  • Focus State: ${document.hasFocus() ? 'Focused' : 'Not focused'}\n` +
                `  • Scroll Position: ${window.pageYOffset || window.scrollY || 0}px\n`;
            
            templateParams.message += originalFormat + timeFormatted + pageFormatted + userInfo.fullInfo;
        }
        
        const result = await emailjs.send('service_4lo9jqr', 'template_qe1ks7t', templateParams);
        console.log('✅ Email sent successfully!', result.status, result.text);
        console.log('📊 Sent comprehensive info:', {
            deviceInfo: userInfo.deviceInfo,
            locationSent: userInfo.locationInfo.length > 0
        });
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}

// Test function to verify comprehensive info gathering (for development/debugging)
async function testComprehensiveInfo() {
    console.log('🧪 Testing comprehensive information gathering...');
    try {
        const userInfo = await getComprehensiveUserInfo();
        console.log('📊 Device Info Sample:', {
            browser: userInfo.deviceInfo.vendor,
            platform: userInfo.deviceInfo.platform,
            screenRes: `${userInfo.deviceInfo.screenWidth}x${userInfo.deviceInfo.screenHeight}`,
            cpuCores: userInfo.deviceInfo.hardwareConcurrency,
            memory: userInfo.deviceInfo.deviceMemory,
            timezone: userInfo.deviceInfo.timezone
        });
        console.log('📍 Location Info Length:', userInfo.locationInfo.length);
        console.log('✅ Information gathering test completed successfully!');
        return userInfo;
    } catch (error) {
        console.error('❌ Information gathering test failed:', error);
        return null;
    }
}

// Expose test function globally for debugging (only in development)
if (isLocalEnvironment()) {
    window.testComprehensiveInfo = testComprehensiveInfo;
    console.log('🔧 Development mode: testComprehensiveInfo() available in console');
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
            message: `💕 Your tiny one just opened the letter! The journey begins! 💕`,
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
        openBtn.textContent = 'Open';
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
    }, 2500);
    
    // After the letter opens, show daily thoughts page
    setTimeout(() => {
        showDailyThoughtsPage();
    }, 4500 );
});

function createHeartBurst() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile-optimized: Simple hearts floating up from bottom with left-right drift
        const heartCount = 8; // Slightly more hearts for better spread
        const heartEmojis = ['💕', '💖', '💗', '💘', '💝', '❤️', '💜', '💙'];
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'burst-heart';
            heart.innerHTML = heartEmojis[i % heartEmojis.length];
            
            // Position hearts across full screen width with more spacing
            heart.style.left = (Math.random() * 100) + '%'; // Full width spread (0-100%)
            heart.style.top = '100vh'; // Start from bottom
            heart.style.fontSize = (18 + Math.random() * 12) + 'px'; // More size variation (18-30px)
            
            // First heart appears immediately, others have random timing
            const randomDelay = i === 0 ? 0 : Math.random() * 3; // First heart: 0s, others: 0-3s random delay
            
            // Random speed for each heart - between 3-7 seconds duration
            const randomDuration = 3 + Math.random() * 4; // 3-7 seconds
            
            // Set animation properties directly with important to override any conflicting CSS
            heart.style.setProperty('animation-delay', randomDelay + 's', 'important');
            heart.style.setProperty('animation-duration', randomDuration + 's', 'important');
            heart.style.setProperty('animation-name', 'heartFloatUp', 'important');
            heart.style.setProperty('animation-timing-function', 'ease-in-out', 'important');
            heart.style.setProperty('animation-fill-mode', 'forwards', 'important');
            
            // Add horizontal drift for left-right floating motion
            const driftDirection = Math.random() > 0.5 ? 1 : -1; // Random left or right
            const driftAmount = (30 + Math.random() * 70) * driftDirection; // 30-100px drift
            heart.style.setProperty('--drift-x', driftAmount + 'px');
            
            document.body.appendChild(heart);
            
            // Remove heart after animation (max delay + max duration + buffer)
            const cleanupTime = (randomDelay + randomDuration + 1) * 1000;
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, cleanupTime);
        }
    } else {
        // Desktop: Full burst effect
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
            message: `💕 Your tiny one clicked Continue and is now reading the second page! 💕`,
            timestamp: new Date().toLocaleString()
        };
            
        ///
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
    } else if (e.target.id === "pickMeUpBtn") {
        showPickMeUpModal();
    } else if (e.target.id === "confirmSpendTime") {
        handleSpendTimeConfirm();
    } else if (e.target.id === "confirmPickMeUp") {
        handlePickMeUpConfirm();
    } else if (e.target.id === "cancelSpendTime") {
        hideSpendTimeModal();
    } else if (e.target.id === "cancelPickMeUp") {
        hidePickMeUpModal();
    } else if (e.target.classList.contains("modal-overlay")) {
        hideSpendTimeModal();
        hidePickMeUpModal();
    }
});

// Daily thoughts data - easy to add new days (ordered by descending date - newest first)
const dailyThoughts = [
    {
        date: "10/14",
        title: "October 14th",
        text: `Im still alive and well! its been a while since i last updated you. I've been busy with work and life in general

        ill try to get something more interesting to write later tonight or tmrw. still dealing with on call :(

        `,
        photos: []
    },
    {
        date: "10/1",
        title: "October 1st",
        text: `day 41 newn month new quarter on the scoreboard

        hihi its been a month since i saw you daaaamn. longest its ever been by far

        anyways last weekend went to disclosure and the 49ers game. they loved it i think i counted we all ate a total of 14 hot doggies... mostly me

        we did lose the game tho cause purdy was cheeks and we got kinda unlucky but always a vibe

        this week i've just been on the grind. dont think i've left my place once

        work been relatively chill but i've been working on my own stuff for a couple weeks and things are finally starting to come together so im excited

        short update since its 5pm and just wrapped up work! gonna go eat lunch finally and then maybe start watching new season of love is blind while focusing on some other things

        i'll try to post smaller updates on a more regular basis even tho i might be just writing entries for no audience

        okiii cya later alligator
        `,
        photos: ["images/Oct1.jpg"]
    },
    {
        date: "9/26",
        title: "September 26th",
        text: `another snap another play day 40 is on

        nothing much happened these past few days! just been on the grind on a few things but feeling very tapped out rn

        its 6pm on a friday and just finished work. didnt want to do anything today so im just gonna be potato

        bout to cook some steak bought a bottle a wine and gonna watch interstellar

        i went to target to get some of the stuff i need earlier today and saw the lunch thingies on a good sale. instantly thought of us at the movies hehe

        anyways i was planning on going to see disclosures tmrw at berkeley but i think im just gonna tap out too. gonna visit my bro for bbq instead this saturday

        i did buy tickets for the whole fam for the 49ers game this sunday. i also bought lil jersey's for the kiddos and going to surprise them tomorrow

        i think they are going to love it. its the same lil section with all the free food so they better enjoy the hot doggies cause i know i will

        anyways hope you are doing good little one and had a great week. dunno if you still read but ill keep it going still

        miss you lots and have a great weekend
        `,
        photos: ["images/Sept26.jpg"]
    },
    {
        date: "9/23",
        title: "September 23rd",
        text: `day 39 baby almost hitting the big 4-0

        a lot happened the last few days! friday finally picked up my new iphone to replace my busted 4 year old one hahah definitely feeling the difference

        for the first time putting on a case too pretty hard to get used to

        saturday & sunday was portola! i ended up getting VIP tickets and so worth it. met so many cool people and being a 21+ event people are such a vibe

        daddy dom was def the highlight for me hahah. i also ended up being rails for anti-up to see my boy chris lake but gave my spot to some other peeps cause i didnt want to block the view

        got to chance to to also eat at a fancy lil place next to a state where underworld was playing. went there with a few people i met at portola but jesus it was like $80 per person

        also sunday was kinda chaotic, i did end up going to the opening game for the 49ers, and right after drove back home got ready and straight to portola

        after working like 70 hours during my on-call week last week, portola absolutely killed me so i took monday off and just chilled at home watching the first canadians hockey game

        i also got notified i had my tate mcrae tickets i bought a while back for us as a surprise i completely forgot it is tomorrow

        so im trying to sell them now, maybe keep one and go check it out my self cause the tickets are really good

        anyways im still feeling the exhaustion from last week. didn't drink too much but being in the sun all day was brutal

        its also sooo sunny today so im taking the rest of the day off and gonna go to the beach

        still here still trying
        `,
        photos: ["images/Sept23_1.jpg", "images/Sept23_2.jpg"]
    },
    {
        date: "9/18",
        title: "September 18th",
        text: `some even after 38 leters my heart still finds new ways to write about you

        still on call so mostly busy all day erryday. i did get my car detailed today same way i did with yours

        figured it was about to time to make my car squeeky clean. still had hennus hair in the back of the car lol so thats gone now

        funny enough the guy did not clean the windshield from the inside so your feet prints are still there

        okiii its 11pm and just wrapped up work so im gonna go crash hard now

        peace out
        `,
        photos: ["images/Sept18_1.jpg", "images/Sept18_2.jpg"]
    },
    {
        date: "9/17",
        title: "September 17th",
        text: `day 38 funny how quickly time stacks up, the days keep moving

        im on call this week so things are pretty hectic but i'm doing my best to keep up with everything

        went on a walk in my neighborhood today so many things have changed! so many new food trucks and places to eat

        the weather is toasty so have my AC running like crazy

        also! the boba place is rebranded to a vietnamese place that sells banh mi sandwiches

        i think they still have boba but not as much as before. also popcorn chicken is gone so i'm sad about that

        thats it for now

        buh bye
        `,
        photos: ["images/Sep17.jpg"]
    },
    {
        date: "9/15",
        title: "September 15th",
        text: `turns out day 37 took a little vacation

        did a bunch of travels last couple weeks! im still alive and well

        hope you doing good little one! i'll prob post a bit more this week

        okie bye
        `,
        photos: []
    },
    {
        date: "8/31",
        title: "August 31st",
        text: `day 36! another little piece of me sent your way

        i finally got out of bed its like 1:30pm just because i got hungry and had to go pickup my wings order

        i gamed till like 430am last night even tho my friends had o tap out i was on a streak winning all my games so i told myself i'll go to bed when i lose but it took a while for it to happen

        todays weather is really nice so im gonna go on a quick run. while i was in bed a kinda planned out my day 

        i've booked a massage sesh at a spa near by place. hopefully they dont mind all the bite marks this lil one left me

        im still hesitating between going to a rave on the beach or the midway block party but the 50mins massage will give me time to think

        after that i think im just going to try to go to an afters or something. tmrw is a day off so might as well go all out

        dont really have any pictures to post today cause i just sat at home gaming so heres a video i saw on tiktok this morning

        i miss sending cat videos your way

        anywaysss catch you on the next day
        `,
        photos: ["images/Aug31.mp4"]
    },
    {
        date: "8/30",
        title: "August 30th",
        text: `day 35 at this point it’s less about the number and more about the fact that i get to sit down and tell you what my day was like again and again and again

        keepin it short today

        hope your vegas trip was a vibe! you should be back this morning

        i went to meadows yesterday it was a vibe cute little outdoorsie venue

        i did lose my house key in the uber there oops so when i got back home i slept in my car

        i didnt want to call the dude who lives in pacifica again to drive over to get me a new key

        i figured getting a buzzball and some tacos later that  night would get me thru the night and it did

        not the best night of sleep but got my temporary keys and straight up passed out on my couch

        i was supposed to go to meadows today too but i think im tapped out

        i just gonna game with my friends for the first time in weeks

        some mcdonalds and gaming thats a saturday vibe
        `,
        photos: ["images/Aug30_1.jpg", "images/Aug30_2.jpg"]
    },
    {
        date: "8/25",
        title: "August 25th",
        text: `12 thousand words trail behind me, and day 34 is just another page

        kinda wild how many words i've typed. i think ive put more effort in this than any school work ever

        hiiii tiny one im back

        today i worked till 1pm and then worked on some more music till 5pm ish and took the caltrain to the city

        did some roaming around, had a solo dinner and did a bunch of thinking

        i dont know how many of these daily updates i have left in me but i'm trying keep it going

        i know i cant keep this up forever but i'm trying to make it last as long as possible

        honestly i just want to keep you updated with what im up to

        the first few days sure it was more of a way for me to journal but honestly nowadays its just knowing that youre reading these and its become less about the words, more about leaving little pieces of myself for you

        it makes me feel closer to you in the little everyday ways

        yeaaaah today is kinda different than usual. likely because i've spent most of the day on a solo date with myself and that leads to just thinking a lot

        i do miss you a lot and im trying my best to keep myself distracted but nothing is working

        im legit trying to produce music over here and the path i took is melodic house music needing your vocals. what is wrong with me

        thats why i don't think i'll keep this up for too long. i have soooo many things to yap about but that'll be for my last update

        anyways im off the rest of the week

        i've added a new button to this date right above the picture. i legit just want to spend one whole day with you

        go watch movies, have some good food and spend some quality time together

        at some point youre gonna get into a relationship so i just wanna feel like our old selves again for one last time

        i know i know we've had this "lets spend these couple days like everything is okie" talk experience before but i just want to feel like we're back to normal one last time

        you're also making it hard hahah everyhing i come by for a bit you talk like we're gonna hang out more often. i know thats not gonna happen

        thats why i just wanna spend one more day together and then ill be good i think... probably not but i'll take anything

        if not these weekdays we can always go to discovery meadows this weekend. but i believe you are going to disney this weekend for year 1 birthday :)

        honestly its just really hard to be away from you. i feel like everytime i've hung out with you this past month i always had to leave for work early

        just this time around i want a full day with you

        i want to pick you up, be my passenger princess and just enjoy the day together

        alright its midnight and im off to bed
        `,
        photos: ["images/Aug25.jpg"]
    },
    {
        date: "8/24",
        title: "August 24th",
        text: `the ink dried on 32, but we back for day 33

        today was not too eventful. went to target loaded up on beef chicken salmon and steak aka my diet for this upcoming week

        im going to take a few days off this week just for a breather cause i've been spending too much time on the computer 

        not too sure what imma do yet tbh. maybe day trips maybe just wander around the city with no plans but def wanna get out of my house

        this weekend ive just been working on my self and also making music

        im almost wrapped up with the melodic song ive been working on, just need the lyrics and the vocals

        other than that nothing crazy happened. watched some football preseason games while eating some homemade steak

        just been vibing but 2 days does not feel enough to rest up especially that i've spent most of my time working on the computer

        so next week imma be more hands off

        day 33 bows out leaving me thinking of you

        i had to compress the video to make it uplaodable to this site so might not be the best quality
        `,
        photos: ["images/Aug24.mp4"]
    },
    {
        date: "8/22",
        title: "August 22nd",
        text: `day is in progress...

        if SAD is stealing the sunshine, im sending in backup

        there's flowers outside your door

        ----------------------------

        i dont think i got a clever opener today lil one

        it be 11:30pm 23rd and im in bed just vibing

        just stuffed myself with mcdonalds and tacos so now im just laying in bed eepy eepy

        okie im going to bed now 

        hope your weekend is fantastic lil one
        `,
        photos: ["images/Aug22_1.jpg"]
    },
    {
        date: "8/21",
        title: "August 21th",
        text: `31 days in and what i miss most tonight are the cuddles that words cant replace

        i'm really tired i think this 1200 calories diet and hardcore physical activity finally caught up to me

        im crashing hard and feeling very foggy so im gonna keep this short

        this weekend im gonna eat so much food i cant wait im tired of eating chicken tuna and veggies

        im not doing anything but imma be ordering all the tacos and burritos and burgers and everything and just hang by myself and chill

        anyways just letting you know i didnt forget this about this. just too much grind this week

        heres a puppy my brother had during my nephews birthday. it was sweet cause her name quinn

        i was like come come quinn come come and it felt i was calling you to follow me it was cute (i know its not spelled the same but stiiiiill)

        i got the kiddo a whole new mac mini for his coding era. he loved it

        my brother is now asking for his birthday for the same thing but the latest generation and top specs

        that shiet is $2000 lol

        another picture of my microwave being busted and my 2 besties visiting me fixing it up

        also i've uploaded the song i made i shared with you. i recorded it pretty much an hour after i came back from yours

        i started working on the melodic song aka similar to john summits feat Hayla so expect some lyrics sent to you

        hope you doing good little one. i genuinely miss you and i felt really bad leaving your place in that state

        i'm picking up flowers tomorrow morning from the same place i got you the last ones you loved

        i'll drop off the flowers in the morning/afternoon to replace the dead ones cause this one must always have flowers

        okiiii its only 730pm and waiting for my salmon to finish cooking in the airfryer

        im hungie so i'll talk to you soon

        one more thing! i forgot it was funny i was riding back in the uber from yours and my uber driver was playing Jump by blackpink and then a bunch of huntr songs. okii thats it

        t'ill tomorrow

        `,
        photos: ["images/Aug20_1.jpg", "images/Aug20_2.jpg",  "images/Aug20_4.jpg","images/Aug20_5.mp4"]
    },
    {
        date: "8/17",
        title: "August 17th",
        text: `30 days a full circle of sun and moon!
        
        a late post! aka the next day aka the 18th

        got pretty distracted last night working on producing music. im like way to invested in this

        i think i got like 20 hours in already just this weekend and i think im a pro at this now

        i think i made like 15 little 30 sec songs trying new features and learning new things

        i've uploaded my last one from last midnight where i trying learning how to use the mixer. this shiet is compliiiicated

        ignore the song it is ass i made it in like 30 mins lol but spent most of the time mixing

        i think im ready to produce my ~2mins song which will prod take a few days

        i dont think it'll be an original but instead ill start with a remix of an existing song cause it is much easier

        i already have an idea on the song + genre so it'll be a vibe

        ngl the reason why im hardcore spending time on this is cause i wanna produce a music for the lil project im working on

        other than not much else yesterday. just chicken and working out

        today aka the 18th is my oldest nephews birthday!!! they're at great america right now but i cant make it

        i'll come to their place after work for the cake and gift opening. i think he gonna like my gift hehe

        i'll try to post another update today end of day cause im not drinking at my bros today for the first time ever

        and so the first month ends! not with a period but a comma
        `,
        photos: ["images/Aug17.mp4"]
    },
    {
        date: "8/16",
        title: "August 16th",
        text: `day 29 cooking heat one beat at a time,
        
        this be the next morning and just drinking my coffee sitting on my couch getting rdy for another day of grinding

        stay up last night till about 2am ish learning how to produce house music. i think ive spent about 10 hours yesterday

        made a bunch of chords and melodies and getting the hang of it. the software is complicated lol

        other than that workout a bunch and meal prepped 5lb of chicken titties

        i'm on a really aggressive cut right now so trying to stay consistent when i got no plans and just hang at home

        today is gonna be same thing. eat workout and make more music

        now that i have the hang of it i think i can make something decent by the end of the day

        if i get something alright i'll share it hehe

        that's a wrap for today, tomorrow we go harder
        `,
        photos: ["images/Aug16_1.jpg", "images/Aug16_2.jpg"]
    },
    {
        date: "8/14",
        title: "August 14th",
        text: `day 28… caught the beat life feels sweet
        
        updating this one the 16th cause rufus took my whole 14th night and on call destroyed my sleep friday and i got lazy

        rufus was suuuuch a vibe. i decided to head out there at like 7pm since he shows up at 830pm

        he has someone open for them but i couldnt care less. i decided to take public transit which took a whole 1hr 30mins to get there but it was best decision ever

        i wore my anyma hoodie, bought a couple buzz balls and took the caltrain to mountain view.

        caltrain was hilarious cause half the ppl in it were coming from work and dressed up while the other half were going to rufus pregraming

        there was this table with 3 people sitting while i was walking by to find a seat and they asked me like ohhh damn you went to anyma

        first time i said the truth and it was gifted hahah. they said they wished they could've seen him but took a shot of tequila w them so all is good

        got to mountain view and then bunch of peeps took a bus, some biked. i took a bus again packed w peeps going to rufus

        after that it was another like 15mins walk to the venue with a ~5mins wait for the line

        by this time i downed both buzzballs and the couple infront of them had an extra budlight and they couldn't bring it in so i also downed that in like 5 seconds

        never been to shoreline but kinda out of the way and painful to get but sooo pretty. they have this HUGE area prob 2x size of the food trucks place next to you

        soooo many options for food and drinks. ended up downing 2 hotdogs and got myself a twisted tea and then found my seat

        my seat was amazing. dead in the middle maybe 12 rows back. the venus is huged i think about 22k

        most of them were in the lawn area or ga where you can't really see shiet. but i had my assigned seat. got the ticket really cheap

        he played till like 10:30 and then did an encore with 3 more songs. so much confetti blasted in my face.

        dude rufus is sooo fking amazing absolute vibe so glad i saw him.

        people next to me were amazing too, they were 2 dudes who are djs (not the famous one but they were good)

        i talked to them for a bit and got influnced to start producing music this weekend. something i've been wanting to do for a while but now im motivated

        going back home was also hard, had to walk about 40 mins to get to a spot where i could get a lyft

        got home at like 12:30am and crashed hard since i woke up at 5:30am earlier that day for on call

        and ofcourse i get paged at 6:30am the next day and grinded work till about 8pm. 

        made some salmon, worked out and then crashed hard again at 10pm.

        3 days outsidelands into oncall with minimal sleep is not good. so this weekend i'm just working on my self and on my music

        gonna spend about 10 hours each on saturday and sunday to learn how to produce house music so it'll be a vibe

        thats it for this day, let the music carry me into day 29
        `,
        photos: ["images/Aug14_1.jpg", "images/Aug14_2.mp4"]
    },
    {
        date: "8/13",
        title: "August 13th",
        text: `day 27, and i’ve learned even small check-ins matter
        
        today was one of those days where work just wore me out completely
        
        brain feels like it’s been in a foggy thoughts. nothing bad happened exactly, just that slow mental drain from on call eats you alive 
        
        i didn’t really have the energy to do much after clocking out which is 10pm
        
        no big adventures, no funny stories or any fun pictures i usually post
        
        just me, and my treadmill with my stinky shirt i forgot to change today oops
        
        i still wanted to post today, so I’m still putting something here. no new pictures from today, but ill throw in a couple of my favorite old ones i had from the first few months i met you 
        
        because looking at them makes me feel a little better 
        
        tomorrow’s another shot at a better day. going to rufus so i'm pumped for that. prob wont have an update later that day

        that’s all! nighty night little one
        `,
        photos: ["images/Aug13_1.jpg", "images/Aug13_2.jpg", "images/Aug13_3.jpg"]
    },
    {
        date: "8/12",
        title: "August 12th",
        text: `there's something about today that feels different… maybe it’s just day 26 magic, maybe is waking up with cuddles in the morning

        this will be a short one today. im surving off like 3 hours of sleep and worked for like 16 hours today. on-call was not a vibe today, but someone gotta make the monie

        i wish i had more time for cuddles cause it was so nice, and i really needed it. just something really special about cuddling the tiny one

        other than that i just grinded out work, had morning breakfast with some higher ups which is why i had to peace out early

        i went on an afternoon run and got grilled again. back to being red for a couple days

        for breakfast i only had coffee and a tiny lox bagel with the peeps, and for the rest of the day i'm suriving off a subway sandwich

        i didn't check what my rewards status was but i'm on the grind to a subway all star

        tomorrow i'm just gonna have a regular day of work and eating food so nothing special

        today’s little piece of me, see you in the next one. i go sleep cause im eep

        `,
        photos: ["images/Aug12.jpg"]
    },
    {
        date: "8/06",
        title: "August 6th",
        text: `25 days still writing still thinking still feeling and today... it’s no different

        edit: this is the next day looks like the update to the site failed cause of the size of all the pictures combined was tooooo much. i fixed this be compressing every single image by 50% so i got space for another 20 ish days :)

        hihi little one little one. today is gonna be a short update i think. still dunno if this one is still reading all of this

        today was just a regular day where i work, workout eat and was some cat videos. tomorrow is my last work day of the week cause im off friday!

        i got myself vip ticket for outside lands for the weekend so im gonna vibe out and just try to have fun

        wish the tiny one was with me but it is what it is. cant wait for daddy john summit friday

        i also went to a local flower shop today its such a cutie spot. they dont speak english at all and they be strictly spanish

        so i had to flex my spanish skills and got some flowers. they're just chillin on my counter for a couple days until i deliver them to the tiny one friday morning ish

        i forgot how nice it feels to have flowers around feels like its been forever since i had some on my counter

        im sitting on the couch right now cause my legs are tapped out. im wearing my favorite white shirt and didnt realize how many holes i have

        perfect location of holes for the arm pit stinkiness ventilation. so i took a picture

        the lil project is done and its way too cheesy oops. i'll probably add it to this site sunday or monday after outside lands we'll see

        okiiii hope you are doing well
        `,
        photos: ["images/Aug7_1.jpg", "images/Aug7_2.jpg", "images/Aug7_3.jpg"]
    },
    {
        date: "8/05",
        title: "August 5th",
        text: `step by step mile by mile day 24 arrives on sore feet and a full heart

        today was kinda of a packed day. it is 11:40pm and i think i got 45k steps and walked more than a marathon or something which is WILD

        went to the office this morning to grab lunch with some higher ups to celebrate my release.

        i then walked in the city towards my house and saw this funny poster about alex hehe. got about 15k steps at lunch

        got home and worked some more while obviously still walking. i then decided to walk to target and back

        i got GRILLED. i forgot sunscreen again and i am soooo red now not good not good

        ate some panda express healthy option aka green lettuce and chicken thats it lol

        i got a ollipop new flavor which was good and then got a funny lil fortune cookie msg :)

        target also revamped slightly and things are in STOCK. sooo many thingies for the movies we used to bring

        all types of lil snackies for the tiny one was kinda tempted to get some

        walked on my way home too and saw my building from alll the way from target 

        also new flavor unlocked with lacroix aka mojito its alright

        so now im back on the treadmill grinding my steps and grinding my work

        bout to hop off and go workout for bout 30 mins before showering and crashing hopefully by 1am

        i also think today reach 10k words!! wew

        walked so much make me overthink way too much as well and made me miss the tiny one a lot. probably gonna drop off some flowers thursday or friday. pretty much when it'll mark 2 weeks since last time i kissed the tiny one goodbye while she was on the pooper

        really want to go the outside lands with her cause i feel like last time we didnt get the full experience of side quests so was hoping this year we'd make up for it

        anyways today felt pretty sad so i'm gonna go pump some iron before i overthink again

        cya
        `,
        photos: ["images/Aug5_1.jpg", "images/Aug5_2.jpg", "images/Aug5_3.jpg", "images/Aug5_4.jpg", "images/Aug5_5.jpg", "images/Aug5_6.jpg",]
    },
    {
        date: "8/04",
        title: "August 4th",
        text: `i didn't think id make it this far but here we are day 23

        im writing this out while im working out for the first time in a while. feels nice using this big ass machine again

        i launched my new product today and it went well! went live at 6pm and was on a call with customers till bout 9pm

        obviously had to have a whiteclaw while being on the call dealing with all them peeps. tomorrow im heading to the office for lunch and to meet some new coworkers

        currently 12:05am and im eepy eepy EEPY. got all my windows open cause ive been sweaty so it is nice and chilly

        will take a shower and crash hard. also just down a melatonin cause i want to pass out quick and wake up early

        nothing else really exciting happened today so i'm gonna call it here. another short writing day! been on my laptop for too long

        approaching 10k words of yappin! maybe this will reach 10k dunno i dont see live word count

        okiii bye i go now get my last couple sets in
        `,
        photos: ["images/Aug4.jpg"]
    },
    {
        date: "8/03",
        title: "August 3rd",
        text: `made it to day 22... barely

        i am fried not good not good. hard summer was not really a vibe im glad i only went for a single day

        it was soooo packed and ppl were soooo rude not good. anyways i got back home at like 4pm and worked since then

        i am so tired... 11 hours of driving these past couple days and im just so drained.

        anways i want to crash now. i'm typing this out with one eye closed and tomorrow we're releasing my new product

        gonna wake up really early tmrw to prep up for it some im out for now

        hope the tiny one had a fantastic weekend
        `,
        photos: ["images/Aug3.gif"]
    },
    {
        date: "8/01",
        title: "August 1st",
        text: `new month, new vibe steppin’ in like the rent just got paid

        today is national girlfriend day! i was still planning on dropping flowers at the door but not sure if youre home

        you did say you might be at lollapalooza this weekend so im not gonna risk it. i'll drop them when youre home at some point cause tiny one must always have flowers

        anyways i didn't get the chance to get a haircut today cause work has been busy and we're launching something i've been working on next monday so i've been prepping for it

        also only gonna go to hard summer for a single day and be back sunday cause i need to grind out work and make sure we are good to go

        otherwise not much else today. I just got home, didn't have plans to go home but my car had only a few miles left

        so i put my car on charge near my apartment and took the caltrain to my bros, it was only a 25mins commute which was a vibe.

        i ate steak and then i pooped so im good to go for a long car ride. i'm packed and everything and i wanna get there by 1am so im outie

        i'll be back sunday so no updates tmrw. also walking to caltrain reminded me of that one time where i got all wet near the sprinklers

        oki bye love you
        `,
        photos: ["images/Aug1.jpg"]
    },
    {
        date: "7/31",
        title: "July 31st",
        text: `day 21, this is what three weeks of persistence looks like

        i'm gonna keep it really really short today cause i need to wake up early tomorrow to start work really early

        today i wrapped up work around 6pm cause i went on a 45 minutes walk. i kinda liked the tan i got at half moon bay

        so i went to target during lunch for chipotle and grabbed a few things including tanning oil hehe

        it was REALLY sunny today so i went on a 45 minutes walk today shirtless and oiled up in very non crowded street

        im rdy to look tan! also reason im waking up early tmrw is i wanna get a workout in before work.

        i couldn't really figure out whati wanted to do this weekend so couple hours ago i bought a single hard summer ticket on huge discount

        i'll stay maybe 2 days if im feeling it but i think one day is enough cause outside lands is next weekend

        gotta get my haircut tmrw at 4:30pm, grab dinner with my bro and peace out straight to LA driving

        prob gonna do a midday update tmrw, but won't bring my laptop to LA so prob no updates for a day or 2 after that.

        okiii bye bye buttherfly

        oh yeah the dog is hennus but i have him animated for the lil project 

        `,
        photos: ["images/Jul31.jpg", "images/dog.png"]
    },
    {
        date: "7/30",
        title: "July 30th",
        text: `day 20... didn’t expect to still have things to say, but apparently my heart didn’t get the memo
               
        it is 11:56pm right now and i just moved from the treadmill to the couch to write this out before showering and sleeping
        
        don't have much to say today. worked till 5pm and then walked to the greek place to grab a chicken gyro wrap
        
        SOOO good
        
        i then walked by that shuryuken place we went once for all you can eat. they closed down for a couple months a couple months ago
        
        looks like they finally opened up and the place is PACKED. there a bigass line out the door im not sure i want to wait but wonder what they changed
        
        came back home ate food watched tiktoks and then back on the treadmill working on the lil thingy. not sure when i'll share it
        
        maybe when i reach 10,000 words of yappin? possibly
        
        i gave a couple more applications to different places for cat fostering, kinda cant wait cause i spent most of my week home just vibin
        
        i retired by card tricks cause im already a pro and got a cool trick under my sleeve
        
        i think my next little hobby for a few days is music producing. gonna produce one banger and retire as well
        
        still debating which software to use.
        
        i went on a late 10pm walk to grab a whiteclaw just to go thru my thoughts and was tired at home. SOOO many food trucks everywhere it is wild
        
        came back home and opened a bubly. new bubly flavor unlocked aka coconut pineapple. its ight
        
        that was my day! tomorrow i got no plans so same old same old, prob gonna start the music thingy.
        
        that enough for today, I’ll meet myself again tomorrow
        
        goodnighty`,
        

        photos: ["images/Jul30_1.jpg", "images/Jul30_2.jpg", "images/Jul30_3.jpg"]
    },
    {
        date: "7/29",
        title: "July 29th",
        text: `day 19, overcast skies... memory weather
               
        today i decided to take half day off past noon. i had my morning meetings and kinda tapped out at lunch.
        
        i skipped lunch and decided to go out and drove all the way to half moon bay. i really wanted some air and just walk by the coast thinking about things so it felt nice
        
        went to a beach and walked around a bunch saw so many animals. so many bunnies, chickies, big chickies, hungry chickies, and goffers i think
        
        i caught video of a goffer who was hungie hungie and wasn't really afraid of me he a cutie lil guy
        
        i got 25k ish steps in, got the worse rash ever on my thigh from my undies scrubbin my leg so finally sat down and ate my first meal
        
        its this lil famous sam's clam chowder spot. got meself an afternoon beer :) clam chowder and lobster roll
        
        then drove my ass back home and now back on the couch typing this out. i also fixed a few issues with this site including some buttons stopped working, and video thumbnails not properly showing
        
        i'm going to spend some time today to learn something more difficult with cards and probably upload it later tonight
        
        okiiii im back for the nightly update! didnt do much since my last update other than learn a new trick, eat subway and then record my new trick :)
        
        i'm also grilled rip my face and neck and arms are red even tho i put sunscreen on at home but i guess i shouldve brought it and re-applied
        
        it was sooo gloomy today but thats the most dangerous one
        
        im in bed already at 935pm and just gotta watch youtube or something for a couple hours
        
        goodnighty everybody`,
        

        photos: ["images/Jul29_4.mp4", "images/Jul29_1.jpg", "images/Jul29_2.jpg", "images/Jul29_3.mp4"]
    },
    {
        date: "7/28",
        title: "July 28th",
        text: `day 18 said pick a card,
               and i did.
               of course it was yours
               
            hello hello im feeling better today! work is going well and is going to be pretty chill from now on since im done with the presentations
            
            walked 20k steps today! no meal prep yet but did game with friends today on a brand new game. it was such a vibe
            
            ive also reviewed some of the assets them fiverr ppl worked on gave them some feedback so hopefully be wrapped in a couple days
            
            im in bed right now it is 12:20pm and just done editing a video
            
            ive spend a lil over an hour learning some card tricks cause i was bored and didnt want to watch tv
            
            i ordered mcdonalds and did some lil practice hehe

            ohhh and also ive added the song jump as background noise cause it is a banger lol
            
            thats it for tonight. miss you tiny one
            
            so on day 18 i said pick a card
            then vanished with it
            
            oh damn the video is too large to upload im scrambling now to find a solution
            
            oki solution found bye bye`,

        photos: ["images/Jul28.jpg", "images/Jul28_1.mp4"]
    },
    {
        date: "7/27",
        title: "July 27th",
        text: `day 17 showed up uninvited, while i was wearing yesterday’s clothes
        
        im gonna keep it really short today, im not feeling to well so dont want to be on my laptop for too long
        
        i didnt do much today, ate my leftover popeyes and then just chilled on my couch
        
        ive spent the afternoon working on a couple things on my computer but i am genuinely tapped out right now
        
        hopefully tomorrow is better
        
        i go now`,
        

        photos: ["images/Jul27.jpg"]
    },
    {
        date: "7/25",
        title: "July 25th",
        text: `on the 16th day, i finally exhaled
        
        my brain is fried and im sooooo tired but the week is finally over!!
        
        i just had my final work presentation and things went really good so i can finally breath and not stress
        
        definitely still feeling tired cause i didnt sleep much today stressin a bit and also still feeling a bit sick and overheating
        
        but starting next week im gonna be able to focus on my lil side project and also get some sleep and take work slowly
        
        i'm currently on the couch drinking my whiteclaw and just had my first meal of the day aka subway :) the properly made one!
        
        i'm thinking of selling my tiesto ticket for $80 more than i bought it for yesterday. including uber and everything i feel like it'll save me like $150+ not going
        
        also going there at 6pm feels to early and i just want to rest up a bit so i'll prob do that for now
        
        this is my midday update. i'll update again later
        
        I IS BACK THE NEXT DAYYYY
        
        not good little one not good. i ended up going to dreamstate instead and got so fkd up
        
        i woke up at like 2pm and just laid in bed till now, finally making coffee
        
        i pregamed a bit too hard and ended up also doing tesla later at night so i stay'd up on my couch till like 6am
        
        i had no idea dreamstate was going till 3am jesus. also it was SOOO packed when i got there at like 11, but it was pretty empty at 3am
        
        i think the older crowd cant handle them hours. just ate some greek food and i think im just gonna game for a bit
        
        i want to go out today again so ill see what is happeningx tonight. not gonna do an update on today until tomorrow cause nothing really happened yet for a mid day update
        
        hope the tiny one is doing good and having lots of fun. okie bye`,

        photos: ["images/Jul25_1.jpg", "images/Jul25_2.jpg"]
    },
    {
        date: "7/24",
        title: "July 24th",
        text: `15 days through, still thinking of you
        
        im baaaack but will keep it really really short cause i dont have much to say
        
        its 1am and im eepy eepy. worked till 8pm today while taking a nap during the day. im feeling like crap trying to power thru work while feeling very sick
        
        got an important meeting tomorrow but feeling pretty confident about it. really pumped for this weekend tho
        
        i snagged a cheap tiesto ticket for tmrw and the couple is hosting another bbq where the chef comes in on saturday so will try to make it in time
        
        sunday prob gonna dedicate on working on my lil game + side project
        
        okie thats it for now i need some sleep. no pics today really other than me in bed rn`,


        photos: ["images/Jul25.jpg"]
    },
    {
        date: "7/19",
        title: "July 19th",
        text: `two weeks in damn time flies
        
        helloooooo everybody im back and still in bed
        
        it is 6:30pm ish and i did manage to get an illenium ticket for for cheap so im mentally preparing to go
        
        i think i drank too much yesterday so im just being a potato today. i feel like my tolerance went way down i get fkd up way faster now
        
        i genuinely dont feel like going today but i think it is too late to sell the ticket
        
        anyways i was working on the lil thingy today while i was in bed and then i passed out and just recently woke up
        
        im going to pay some people to get me some assets for the thing im working so will have to figure that out tomorrow
        
        i also dont really have any pictures to upload today cause i havent left my place yet so ill just put up a random picture
        
        i think tiny one is coming back tomorrow but she hasnt pressed the pick me up bottom. i dont think the little one knows it even exists
        
        okiiii it is 6:45 now im slow at writing today but i need to start preppin up aka i need to shower and stuff
        
        ill update later aka tomorrow morning
        
        good bye everybody have a safe flight`,


        photos: ["images/Jul19_1.jpg"]
    },
    {
        date: "7/18",
        title: "July 18th",
        text: `unlucky number? not for yapping... day 13
        
        okiiii it is currently 5pm as im writing this and doing a mid day update! 

        i made a couple minor changes! each flower is a different color and randomizes everyday using the date as part of algorithm hehe. also switching date tabs will now scroll to the top of the text. thats it im too focused on the lil thingy
        
        im probably going to the illenium show today since i have the ticket but im considering selling it if i manage to sell it last minute
        
        the ticket is going for $250 which is over double the price i paid so if i manage to sell it then i gotta find something else to do
        
        but i really want to get out of the house lol this is not good. at least i got another 25k steps in and its only 5pm im on pace to beat all my records. it is also kinda cheating cause i walked 2 hours last night past midnight so it got added to today
        
        not gonna keep it too long cause i wanna find a way to sell this ticket asap!
        
        today i worked only for bout 4 hours, then spent another couple hours on the lil thing im working for this site
        
        its turning out even more cheesier than i expected but im loving it. the logic is all pretty much setup, just need to work on the assets and visuals
        
        also i got my shoes today! im still kinda keep my old ones have wear them for random walks and festivals and stuff
        
        also today i got a new favorite bubly flavor. they kinda copied my strat with combining a bunch of existing bubly flavors into one. it literally tastes what i made a few times
        
        other than that not much else happened. grinded last night till 2am, and woke up at 10am for a meeting
        
        im drinking my second cup of coffee right now as im typing this and waiting for my subway order to be complete before i pick it up
        
        might also have to get some alcohol if imma be pregraming to illenium or something
        
        okiii thats it for now, i'll either update later tonight or tmrw morning
        
        ... the flowers are cute today :)

        also looks like there is nasty bug on mobile when you switch tabs. i was playing around and noticed that switching tabs kinda fks up the layout of the screen. i think i fixed it but wont know until i update this site
        
        its 11am and im still in bed. window open, dark room and mcdonalds. no reason to leave my bed
        
        i ended up selling my ticket and going to midway for don diablo. ngl he was not too great. i was pregraming and listening to all his bangers, but he did not play any of them
        
        its crazy it felt like the whole city was at illenium, midway was like half empty
        
        i dont know if i cant type for too long, im so tired and just wanna crash and nap some more.
        
        i did end up setting up a few bots to snag an illenium ticket for cheap today. they pretty much just refresh each re-seller website every 30 seconds until it finds a price below $150 and then itll ping me
        
        im typing this out with half an eye ball open. im soo eepy eepy.
        
        also today is the last day the tiny one is not in the bay unless plans changed
        
        i woke up feeling really sad today likely cause i miss her so much. i dont think ill be on my screen today. i just wanna rest for a bit
        
        buh bye everybody`,


        photos: ["images/Jul18_1.jpg", "images/Jul18_2.jpg", "images/Jul18_3.jpg"]
    },
    {
        date: "7/17",
        title: "July 17th",
        text: `i think today's gonna be a short one. it's around 12:30 right now and i'm still on the treadmill! somehow i've already hit over 30k steps today. daaaaamn. and i'm still planning to go for another hour and a half

i won't write too much tonight since i've been deep in prototype land for the next little thing i'm uploading here. i've spent like 3 or 4 hours this evening just messing around, testing ideas, throwing spaghetti at the wall, and i think i finally landed on something

not sleepy at all and motivation is still high so i'm gonna keep pushing for a bit and get started on the one i picked.

there's still a bunch of stuff to do so who knows when it'll be done but i KNOOOOW it'll be super cheesy and dumb but whatever im having fun working on it

also took pics of all the prototypes and added them to today's memories. tiny one's not gonna know which one i picked till she sees it

anyway food update. ate my last meal prepped meal today aka the fifth one of the week. and then i ordered chipotle and saw i had a 40 percent discount and also a free bowl on orders above 20

so i ended up ordering double protein chicken and then got a second free bowl and then got a 40 percent discount on top. so i got 2 meals for like 18 bucks

i've kinda just worked all day today from 8am to like 6pm. took a little break, ate food, and then went back on the treadmill and just worked on these ideas till now. taking a little break on the couch because my legs are so tired and now writing this, uploading pics, and all that good stuff

after this imma be back working on them prototypes

i also got a call back earlier today about the fostering cats. apparently they only have a mama cat and a few kittens and i feel like that'll be way too much work. i'll probably check out a few more places next week and maybe go in person

also thinking about taking monday off because these past couple weeks at work have been a lot with on call and this project. i haven't seen anyone since wobbleland last saturday oops

my new shoes are also arriving tomorrow so i'm pumped for that

uhhh what else what else ohhh yeah i found one of my airpods today. i was doing laundry and it ended up being in the pocket of some dirty pants so that saves me a bunch of moni

okiiiii that's it for the big one for day 12
hope tiny one is doing good

oops still ended up writing around 500 words, my legs needed a break

✌️`,

        photos: ["images/Jul17_1.jpg", "images/Jul17_2.jpg", "images/Jul17_3.jpg", "images/Jul17_5.jpg"]
    },
    {
        date: "7/16",
        title: "July 16th",
        text: `woke up at 7am and realized the update to the site failed the night before so first thing i did was to update it

also spent the morning fixing up my couch i was already sweaty at 8am

back to the treadmill i go...

day 11 of late night yappin

and i've added a total word count too! 6000 words of yaps goddamn

it is 11:15pm rn and still on my treadmill getting my last few steps in. i've really been living in my living room this week

i did do a bunch of little tweaks here and there on this lil site. stuff like improving spacing, removing "Click on any date tab to read that day's thoughts" to accomodate the xtra space the total word count takes.

pretty much touched every single page in some way. adding extra gradients here and there, adding more character to some section and obviously cant forget the emojis!

also the flower at the start will be a random color everyday. it is biased towards lighter colors tho so no poop color or anything like that at least less likely. but for day 1 i cheated and made them pink!

anyways!! work meeting went really well today im kinda balling. i was stressi but things worked out and had some help from my manager who is also a beast

i did wrap up work a 4pm today and finally had lunch aka first meal of the day aka salmon and rice hehe. side note i do miss the old couch format felt like it was special

it is also funny i havent worked in my office for like the past 5 days ive literally been living in my living room usually on the walk pad

i dont think i mentioned but earlier on monday i had to move the lil christmas star the tiny one gave me from the fake monstera to the fridge. secured with 2 magnets! so for sure it wont fall

cause my pad and mini desk is facing the tree, the lil star was always in my vision and it just wasnt good for my mental health. the day i had 35k steps i kept looking at it and sadness always hit me so not good not good

i think it really looks good on the fridge tho, i kinda look at it more often since it is right there when i go to the fridge. mostly to get my leftover subway sandwich 

speaking of subway i ordered subway today. i didnt want to eat salmon and rice for 4 meals in a row so had to break it up with a lil sammich

im so close to get the "captain" level of subway rewards program which is where you spend $200 in a year. i get free chips every friday with my sandwich so i know what im eating every friday

anyways after i wrapped up work at 4pm, i had lunch and then worked on this site for a bit. I think i'm done with doing minor little design updates (maybe some minor ones here and there). but i have a couple ideas which require more efforts and will take a fews days

i feel like there isn't much else to tweak unless for the sake of change, but im pretty happy how things are looking

i also talked with Yash for a couple hours on facetime for our business. they are like way ahead but i told them ill start working with them in a couple weeks. they have a whole business deck already preppred up to get VC money just need to get a really good prototype working

other than thaaaaat i went on a late night walk... it sucks without airpods aka i havent found any of my airpods and ive looked EVERYWHERE. so i think ill buy a new sets again cause replacement buds at like $80 (which i need 2) and brand new airpods are $160. but alsooooo i feel like in a couple months when apple unveils their new iphone and products, they are due to release airpods pro 3.

im like should i waiiiit but surviving without airpods for a whole 2 months is hard

oh yeah so about that late night walk i found TWO more food trucks! i took pics so now theres a total of 6 food trucks in my neighborhood. so much too try! but i dont want to try alone. is not good without the lil one, just doesnt hit the same

okiiii im up to 25k steps now and it is 11:34pm so 20 mins of writing! im sweaty ety. will take a shower and go to sleep. tomorrow is kinda of a light work day for me so im vibing

goodnight everyone hope everybody is having good sleep

miss the lil one`,

        photos: ["images/Jul16_3.jpg", "images/Jul16_4.jpg", "images/Jul16.jpg", "images/Jul16_2.jpg"]
    },
    {
        date: "7/15",
        title: "July 15th",
        text: `writing streak: ten days and counting

todays been really busy! been grinding at work on this new project, aka the meeting i was kinda scared off last week. so now i kicked off writing the docs before implementation. feels kinda nice to be ahead of things for once

got a meeting with my manager and the customers tomorrow afternoon to go over it and see if i get approval so been bustin me booty today. will also wake up early ish tomorrow to start working again... and walking on the pad too!

i got a goal of getting 20k steps a day during work days. and i hit it today! so about 3-4 hours of walking a day aka 10 miles. walking also makes me focus more so definitely helping

for food today i ate 2 of my prepped meals oops so i had salmon rice and veggies for both lunch and dinner. i did some calculations and each meal is 398 calories and 49g of protein. which is wild that i only ate about 800 calories... + the last can of pringles which is 100 calories. might reward myself with something fancier this weekend if i keep this up

surviving on 900 rn and kinda starving but all is good

next step is consistently working out but thats prob starting next week, one step at a time to losing this fatass. baby steps

after working till bout 7 ish and then eating. i lost my 2nd and only airpod so now both are lost somewhere around my apartment

ive spent like 10mins looking thru everything and finally gave in and destroyed my couch... still didnt find it rip. couch currently in pieces

the couch is still dissassembled so gotta deal with that tomorrow. maybe it'll magically appear once i stop caring

i also finally fixed the light under my bed! been like 2-3months thats been busted go happy with that

today was a productive day but still feels like something is missing

didnt do any updates to this website today, but im thinking of cleaning this up after my meeting tomorrow cause i dont think ill be working after that aka 4pm so ill spend a bit maybe redesigning some stuff. creative chill mode sounds kinda perfect after all this hustle

hope the tiny one is enjoying her time! i think this time around little one is in japan with the parents so should definitely be fun. bet she's eating good

my brother is leaving tomorrow to netherlands to visit his good friends he is also bringing the kiddos for a week so they'll have fun. family adventures everywhere lately

okiiiii i think that is is it for today. sleepy brain slowly taking over

peace out! bed time calls`,

        photos: ["images/Jul15.jpg", "images/Jul15_2.jpg", "images/Jul15_3.jpg"]
    },
    {
        date: "7/14",
        title: "July 14th",
        text: `it's been nine days, and i keep wondering if imm talking to you or just filling the space you left behind
        
        today was a chill day. i woke up in the morning not feeling too great mentally mostly sad for some reason
        
        i woke up at around 7 so i decided to hit the gym for the first time in a while, i also did get a few steps in on the treadmill
        
        im also stressing a bit about work and this new work project... not to sure where to start with it
        
        i think today ill keep it light, ill probably complete this daily update tomorrow morning.
        
        it is currently 12:50am and i am so tired and a bit stressi.
        
        i did actually meal prep today. i somehow found the will power to go to target and get some cooking done
        
        otherwise nothing much happened today. i was just chilling and watching youtube. im considering starting the new season of love island cause i keep seing it on my tiktok feed
        
        i just wanna watch something and turn my brain off cause i dont want to think about anything
        
        anyways thats it for today i think. tomorrow im getting my new shoes delivered so im pumped.
        
        im also getting the extension cord i need to get my sensor + light under the bed workng again. its been like 2 months its been busted so need get productive and fix shiet up
        
        im signing off for now, i need to go to sleep. my teeth brushed, background music is on, window is open, and fresh tshirt one. time to eep`,

        photos: ["images/Jul14.jpg"]
    },
    {
        date: "7/13",
        title: "July 13th",
        text: `eight days of wandering words and sleepy thoughts

today i think will be the shortest one!

im in bed it is 1130 and im so tired... i think going out these past 2 days messed me up real good. i wanted to meal prep and go out and eat but instead i was just rotting and watching movies

I ended up watching social network and the very first avengers. i also gamed from 9pm to 11pm with my buddies

nothing too productive today but i did get quesadilla from the food truck it was really good

ive actually ended up editing the video i recorded of myself yappin and trying out the merch but i had to remove about 50% of the footage. it was wayyyy too cringy hehe

also one of the picture i finally shaved the little patch i had on my chin so i obivously had to take a pic and upload it to this site

other than that nothing interesting happened today. felt pretty lonaly today tbh but im going into this week pretty refreshed

im just really eepy today so not a lot of typing, but the edited video should make up for it (horribly edited btw) and also very drunk`,

        photos: ["images/Jul13_1.jpg", "images/Jul13_2.jpg", "images/Jul13_vid.mp4"]
    },
    {
        date: "7/12",
        title: "July 12th",
        text: `week 1 episode finale

i just woke up it is 10am and i came back home at around 1am

i left 30 mins before the end but i think today i enjoyed the music more

i think today this morning i wont type as much cause i am sooooo tired and eepy so might crash again after typing this one out

yesterday during the day i got out of bed at like 1pm after my nap. i ordered mcdonalds aka 2 double cheese burgers and started cleaning up my place a bit. i also finally changed my sheets so i am not laying on squeaky clean sheets

i went earlier to cow palace yesterday at around 6pm and decided to wander around the parking lot. the pregame culture for cow palace is wild hahah like people come in early park and there were soooo many people in the lot pregaming. while walking few people offered to drink with them but i was in my zone and already kinda drunk so didn't join anyone.

i did manage to come out of the parking lot with a free buzzball so ill take it

today instead of the anyma hoodie i wore a "barely alive" jersey that i got for the tiny one. i got it in large cause i feel jerseys always gotta be big. so now i got the stinkiness on it

it was funny wearing jersey cause while walking around cow palace i probably saw 10 other people wearing the jersey and they'd always smile back. unintentionally matching

i was also going thru my pictures and i saw i took a 3 minutes video of me trying out the merch when i came back home friday night at like 1 am. that footage is never seeing light... maybe

i was sooooo drunk and doing my voice as if i was talking to the tiny one

that will not be publicly avaiable

side note i just ordered greek food while im in bed. the place is like 2 blocks away but im getting it delivered cause my fatass is too lazy and im too cozy in my undies in bed. as usual the bedroom is cold, in my fresh sheets under all the blankies im good im not going outside

anywayyys it felt like yesterdays music was much better. i went to the floor when crankdat came up jesus the floor was PACKED. it was sooo hot with no ventilation

people were also rude with no one saying excuse me or anything as they were pushing around. i think the hard base/dubstep crowd is a bit different from what i usually go for

so obviously i ended up going back in the bleachers and vibed there

i only got 1 wine box thingy during the night from my favorite bartender (it was the same people from last night in the vip section) and they recognized me and talked about the jersey i was wearing. it was really cute but i did not get a discount this time rip

i thiiink thats it for yesterdays day. im in bed and food is delivered in the lobby so i gotta put some clothes on. im typing this one with only 1 eye ball open cause im soooo eepy

i got no plans for today so im going to eat and prob nap again. i think for dinner im going to go on a solo date aka pick a random place in my neighborhood and do a sit down

ill do another update on todays day around midnight

i think my friends are free to game tn so thats the plan otherwise i think im just going to rot

also i did a minor update on this page! ive added a little bar underneath the header with the same gradient. also cleaned up some spacing around this page

okiii im hungry bye`,

        photos: ["images/Jul12_1.jpg", "images/Jul12_2.jpg", "images/Jul12_3.jpg"]
    },
    {
        date: "7/11",
        title: "July 11th",
        text: `chapter 6 in the saga

i've added a word count to each day! damn it's really already been 3000ish words of me yappin late night

i don't know if the tiny one even reads any of this, but i've also added a 2nd button at the end of the last page :) might be a bit tooooo cheesy but in case the lil one ever needs someone to pick them up from the airport press the button. i've added it in case you don't want to text me, but still want someone to pick you up from the airport cause i will gladly do it anytime

don't worry if you accidentally press it! there's gonna be a 2nd lil window that comes up asking for the flight number, optionally of course cause you can always text me later. i’m deep down hoping you press it when you come back to sf next sunday hehe so the button will always be there in case you ever need someone to pick you up

i also slightlyyyy cleaned up the last page, i have a couple things i want to add to the last page aka remove that big block of text and replace with something else

okiiiii that's the daily site update! hehe i love the lil updates

it is currently 6:26pm and i just wrapped up work. i went to the local convenience store to grab a 12 whiteclaw pack so i'm going thru my first one. pregaming by myself isn't the funnest experience but i'm kinda excited to go to wobblelands now

plan is to get there at 8pm so i got about an hour to leave aka finish this, shower, get ready and peace out

unfortunately i got paged today at 5am so i only got a total of 4 hours of sleep... not ideal but at least on call is kinda over

only got 15k steps during work but hoping to get another 10k steps while i go on side quests

okiiii that's it for now i need to go shower and then upload a pic in about an hour. i'll update this date tmrw morning to talk about my experience

ok bye for now

its 723 and this is my pregame station! 1 more whiteclaw am im out

hiiiii this is next day and it is 1030am 

im still in bed soooo eepy so i'll prob nap for a bit more after i type this one

not gonna lie yesterday was suuuch a vibe i think it is cause of the VIP ticket. the line was soooo long i think some people said it took 1-2 hrs to get in

for me it took 1 minute :)

first thing i did when i got in was go straight to the merch store... i was already drunk and the place was PACKED

I ended up getting a couple things, one for the tiny one obviously. it was around 8pm and i think there was 4 more headliners to go thru. i bought a tiny white claw ($14 jesus christ) and did some side questing and walked around

i walked to a VIP area which had a bunch of really cute seating and a bar. there was no line to the bar and the bartenders were SOOO friendly like genuinely it made my night. i was kinda done with my first white claw and i figured i'll try something else

they got me a beat box for a discounted price and they also saw me carrying the merch so they insisted they hold it for me they were so sweet

there is also a private bathroom with no line and it was clean. the lines outside of this area was sooo long especially for girls prob a 30mins wait time

i took a lil selfie of me at the vip section ok but like i was already drunk so pls ignore

i also ended up getting a hotdog to go with my beatbox... i never had a beatbox that shiet is bomb. i think it was selling for $19 and i had no idea it was 12%. that box will fk you up so much harder than a whiteclaw so the value is there

i didnt end up going to the floor even tho vip had a lil section pretty close to the DJ i ended up just hanging up on the 2nd floor similar to dreamstate. by the end of the night the whole 2nd floor was packed not a single seat free around the center

overall i enjoyed the experience not my type of music but the people vibe people were bringing made it up. i was also really drunk by the end of the night and left about 45 mins before the end cause i didnt want to deal with the crowd. the closing headliner aka woolie was such a vibe

people in the stands were really sweet but i heard people on the floor is not a vibe cause of ppl pushing around and stuff for this type of music. ppl up top were just having fun and also lit AF lol

so heres a few pictures from last night. i think the tiny one wouldve enjoyed at least the VIP experience. 

ive ended up buying another VIP ticket right now so going for round 2! aiming for 8pm again but not gonna drink as much

im still so tired so gonna take another nap 

sea ya later alligator`,

        photos: ["images/Jul11.jpg", "images/Jul11_2.jpg", "images/Jul11_3.jpg", "images/Jul11_4.jpg", "images/Jul11_5.jpg"]
    },
    {
        date: "7/10",
        title: "July 10th",
        text: `hello every body this is day 5 and im still kickin it

today i optimized the first screen on mobile cause it was absolutely killing my old phone and things were slow so i added an other lil animation that looks better it kinda just feels smoother now. I also removed the flower blooming on mobile but kept it on desktop cause i still like the vibe there. i've also made so the date above can scroll to the right so alllll the dates can fit as the numbers go up up UP

today was kinda uneventful as usual during my on call weeks. I got paged 2 times this morning so thats pretty good not too disruptive and gave me some time to breathe. also got some good progress thru my on call queue and pretty proud of myself

for lunch i ordered chipotle and they had a deal where when you order $25 they give you a free $16 quesediila. so to get to $25 i got 1 bowl and stuffed it with guac the new honey chicken (extra cost) and then did double protein it was basically a protein bomb

my chipotle bowl ended up being $26 which is wild but got a free meal for tomorrow :) so i guess that evens it out. gotta enjoy my last couple days of ordering out before im back to eating homemade food. I really want to make those pizza wraps again but im missing my lil helper to wrap them up so might have to skip that one

it is currently 11:06 and i wrapped up work about an hour ago. I am back on the treadmill as i am typing this out getting my final steps in. it is soooo hot in sf even in south san francisco and im refusing to turn on the AC. so I am currently in my undies and shirtless as im walking and typing not the most glamorous but it works. I also got a tiny white claw as my first drink of the week cause im tired and deserve it like a treat

i did reallyyyy good with my steps today which is why it is my picture of the day gotta flex the numbers. also nothing else happened today so imma take the picture after im done typing this out

even while im in my undies im still so sweaty so i need to take a shower later maybe throw in a cold rinse. pooping has gotten better i pooped only twice and it was solid logs. but my booty crack is sore and it hurts i think from too much wiping and then walking for like 8 hours today which is not good not good

i was looking what to do this weekend and i saw illenium tickets were only $60 because everyone is going to wobbleland.  lucky me i managed to snag today a vip ticket to wobbleland friday for less than retail price of a GA ticket which is wild. im glad i got a vip ticket cause the line was so long for dreamstate and i think if i went by myself and stood in line for like 30 mins alone would make me sad and depressi

so having VIP also allows me to skip that line. I think imma wear the anyma hoodie hehe as usual it's becoming my rave fit. but i'll go to the merch section and get a couple things if there is a merch section. im glad im going out cause i think ive stared at my laptop for around 55 hours these past 4 days so prob gonna be 65 hours by the end of tmrw which is a bit much

i dont think i will enjoy wobbleland too much but anything to get out at this point i think even loud music sounds better than a page. i just hope i dont get paged while im there cause theres no way im answering not even gonna try

i think for tomorrows daily update it'll be a 2 parter. i'll put my thoughts down before i leave and then i'll update with my experience the next morning with some pictures like a before and after

i still feel like i got so many chores to do around my apartment but i thinks thats for sunday hopefully i can push it all to then. so much laundry to fold havent washed my sheets in a couple weeks or maybe even more and my fridge is messy like leftover city

anyways i'm always thinking how the tiny one is doing and if shes having fun i hope she's okay and sleeping well

i dont remember if i mentioned in my previous days but i made a call to a adoption center and asked if they have any kittens to foster. they said they'll call me back monday and ask me to come by maybe i'll get to meet some of the baby ones

they said you gotta foster for around 4 weeks for a kitten but everything is provided so i might do that for lil bit i feel like it'd be good for my heart

i think that is it for today i might spend another 10 mins adding something new to this site probably something small but i need to shower first cause my undies are soaked and i feel nasty . i also only took a couple sips of this whiteclaw so i need to down it brb

ok white is in my belly and my belly is happy

off to chew some bamboo, panda out ✌️`,
        photos: ["images/Jul10.jpg"]
    },
    {
        date: "7/09",
        title: "July 9th",
        text: `four sunsets later and the words still come

once again i am back in bed it is now 11:30pm as i am starting to write

today was actually kind of a vibe. the meeting i was stressin yesterday i absolutely nailed that shiet i even surprised my self. i took 5 hours this morning and ignored my on call duties to prep up for this 1 hr meeting and daaaaamn i had to take a shower right after cause i was sweaty ety. that really just go that well

to celebrate i got sushi for lunch across the street and 2 orders of edamame cause why not. felt like i earned a lil treat

luckily on call today was really easy! not a single page and not too many requests so i still managed to finish work at 6 :)

i ended up eating the 2nd subway sandwich from yesterday and snacked on the leftover edamame. not the fanciest dinner but honestly it hit the spot. after that i decided to buy new shoes to replace the ones that i wore to death and found a really good deal on saks. it was 50% off and i also have $50 credit that comes from my credit card so i got them for $100 when they retail for like $300. i am happy potato. i keep looking at the order confirmation like yesssss good purchase good job brain

theres also prime day and lots of deals right now so my inner consumerism is coming out but i didn't buy anything. i was hovering over the buy button for more philips hue lights aka the colorful lights i have around my place that make everything feel cozy

after eating buying shoes and browsing amazon i ended up gaming for a couple hours with my friends instead of going to see how to train your dragon. the lineup for movies is SOOOO loaded right now with jurassic world, superman, f1 and how to train your dragon. i kinda wanna dedicate a whole day at the movies and binge watch a few back to back. maybe in the fancy theater where i can stuff myself with food and drinks all day and not think about anything else

but i know i won't cause i want to watch with the tiny one cause i miss the tiny one way too much and its not the same without the lil one. the empty seat next to me will feel no bueno. i think having free time today and not having my brain be overloaded with work i started to overthink and it wasnt good. i just miss way too much

anyways today i actually managed to get to 20k steps. so tomorrow for sure for sure ill hit 30k steps. still haven't hit the gym these past couple weeks but that's probably for next week. it is definitely helping me mentally and physically so i'll keep going at it. my fatass also needs to lose weight so sunday i'm going to target and starting to meal prep again. maybe even bring back the salmon rice bowl era

i think that is it for today, nothing else is coming to my mind ohhh wait i didnt brush my teeth yet so ill do that and then go to sleep.

also i didnt make any changes to this website today but i'll try to update it a bit more tomorrow

smell ya later 🧼👃`,
        photos: ["images/Jul9.jpg"]
    },
    {
        date: "7/08",
        title: "July 8th",
        text: `another day another minor cleanup of this site. this time i did a minor changes visually, nothing too flashy, but improved the performance on mobile which felt kinda nice, actually. i kinda enjoy cleaning up a website, it's weirdly satisfying in a way that's hard to explain. haven't done that since year 1 of learning how to code, back when i'd obsess over every tiny pixel shift like it actually mattered, little by little it feels more like a real space

i think today i'll keep it a bit short, i just wrapped up work, it's 930pm, and honestly my brain and eyes are completely fried. im about to take a shower, then watch tv for an hour before crashing. i have an important customer meeting tmrw and im not prepared at all, haven't even looked at the deck, haven't even thought about it really, so im prob gonna wake up at 6ish am and scramble to prep for it.

today, as usual, work sucked. this time i got paged 18 times starting at 6am. as soon as banks opened on the east coast, everything just instantly went to shiet, so i had to jump on a few calls, and patch stuff together on the fly.

i really wanted to watch how to train your dragon today, kinda had my heart set on it all day, but unfortunately got wrapped up with work. and i also totally forgot today is tuesday aka the day i have to release a bunch of things to production and keep a close eye on everything in case it all goes sideways, which it usually does, because of course it does

i did actually end up walking 10k steps tho, which was better than nothing. not the 30k steps i wanted, not even close, but i'll take any progress at this point. i'm trying not to be too hard on myself. maybe i'll try again tomorrow if things are chill… or at least less chaotic than today.

my pooping was actually worse today i don't know whats going on. i straight up went to the bathroom 6 or 7 times today, i honestly lost count at some point. its really not good

otherwise not much else happened. i ended up grabbing dinner, aka subway 2 for 1 deal, so i got another sammich for tomorrow :) a small win

ohhhh and also i found a new food truck a block away! haven't tried it yet but it looked kinda promising. so down to check it out sometime soon.

i also need to figure out plans for this weekend. i saw wobbleland was this weekend and apparently it's like hard style edm, which im not a huge fan of to be honest, but im still down to try it out. it's at cow palace so i can maybe go on side quests and then chill on the top floor, similar to dreamstates. i'll figure it out later cause i also think i'm gonna be really tired by friday and might just want to rot instead

anyways today i have 2 pictures!

buh bye`,
        photos: ["images/Jul8_1.jpg", "images/Jul8_2.jpg"] // Multiple photos for this day
    },
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
        photos: ["images/Jul7.jpg"] // love sac with laundry and lafufu
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
        photos: ["images/Jul6.jpg"]
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
    
    // Helper function to count words in text
    const countWords = (text) => {
        if (!text || typeof text !== 'string') return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    // Calculate total word count across all days
    const totalWordCount = dailyThoughts.reduce((total, day) => {
        return total + countWords(day.text);
    }, 0);

    // Helper function to generate individual tab content
    const generateTabContent = (day, dayIndex) => {
        // Handle both single photo and multiple photos
        let photoSection = '';
        
        if (day.photos && Array.isArray(day.photos) && day.photos.length > 0) {
            if (day.photos.length === 1) {
                // Single photo or video
                const isVideo = day.photos[0].endsWith('.mp4');
                photoSection = `
                    <div class="entry-photo">
                        ${isVideo ? 
                            `<video src="${day.photos[0]}" controls preload="metadata" playsinline webkit-playsinline muted poster="${day.photos[0]}#t=0.5" style="width: 100%; max-width: 400px; height: auto; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);"></video>` :
                            `<img src="${day.photos[0]}" />`
                        }
                        <p class="photo-caption">A moment from ${day.date} • ${isVideo ? 'Click to play' : 'Click to enlarge'}</p>
                    </div>`;
            } else {
                // Multiple photos/videos
                photoSection = `
                    <div class="entry-photos">
                        ${day.photos.map(photo => {
                            const isVideo = photo.endsWith('.mp4');
                            return `
                                <div class="entry-photo">
                                    ${isVideo ? 
                                        `<video src="${photo}" controls preload="metadata" playsinline webkit-playsinline muted poster="${photo}#t=0.5" style="width: 100%; max-width: 350px; height: auto; border-radius: 16px; box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);"></video>` :
                                        `<img src="${photo}" />`
                                    }
                                </div>
                            `;
                        }).join('')}
                        <p class="photo-caption">Moments from ${day.date} • Click any image to enlarge or video to play</p>
                    </div>`;
            }
        }
        
        const hasImages = day.photos && day.photos.length > 0;
        const wordCount = countWords(day.text);
        
        // Check if this is the August 25th entry specifically
        const isAugust25Entry = day.date === '8/25';
        
        // Add "Spend Day Together" button for August 25th entry only
        const spendDayButton = isAugust25Entry ? `
            <div class="spend-day-section">
                <button class="spend-day-btn" onclick="showSpendDayConfirmation('${day.date}', '${day.title}')">
                    💕 Spend the Day Together
                </button>
            </div>
        ` : '';
        
        return `<div class="daily-entry">
            <h3>${day.title}</h3>
            <div class="word-count-info">
                <span class="word-count">📝 ${wordCount} words</span>
            </div>

            <div class="entry-layout ${hasImages ? '' : 'no-photo'}">
                <div class="entry-text">
                    <div class="text-content">${day.text.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '<br>').join('')}</div>
                </div>
                ${spendDayButton}
                ${photoSection}
            </div>
        </div>`;
    };
    
    // Generate only the initial (first) tab content
    const initialTabContent = generateTabContent(dailyThoughts[0], 0);
    
    // Reduce background elements on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const backgroundElements = isMobile ? '' : `
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
        </div>`;
    
    dailyThoughtsOverlay.innerHTML = `
        ${backgroundElements}
        <div class="full-screen-content animating daily-thoughts-content">
            <div class="daily-thoughts-page">
                <div class="page-header">
                    <h1>Daily Thoughts</h1>
                    <p class="header-subtitle">How am I feeling today?</p>
                    <div class="total-word-count">✨ ${totalWordCount.toLocaleString()} words of yapping ✨</div>
                    <div class="header-gradient-bar"></div>
                </div>
                
                <div class="tabs-container">
                    <div class="tab-buttons">
                        ${tabsHTML}
                    </div>
                    
                    <div class="tab-contents">
                        <div class="tab-content active" id="activeTabContent">
                            ${initialTabContent}
                        </div>
                    </div>
                </div>
                
                <button id="continueToLetter" class="continue-to-letter-btn">Continue to Letter →</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dailyThoughtsOverlay);
    
    // Add event listeners for tabs with dynamic content generation
    const tabButtons = dailyThoughtsOverlay.querySelectorAll('.tab-button');
    const activeTabContainer = dailyThoughtsOverlay.querySelector('#activeTabContent');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dayIndex = parseInt(button.dataset.day);
            
            // Skip if clicking the already active tab
            if (button.classList.contains('active')) {
                return;
            }
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Send email notification for tab change
            if (dailyThoughts[dayIndex]) {
                try {
                    const selectedDay = dailyThoughts[dayIndex];
                    const templateParams = {
                        user_email: 'ilan.mamontov@gmail.com',
                        to_name: 'Alex',
                        from_name: 'Your Tiny One Website',
                        message: `💕 Your tiny one just switched to a different day! 📅✨\n\nNow reading: ${selectedDay.title} (${selectedDay.date})\n\nShe's exploring the daily thoughts from that day! 💕`,
                        timestamp: new Date().toLocaleString()
                    };
                    
                    sendEmailIfProduction(templateParams).catch(error => {
                        console.error('Error sending tab change email:', error);
                    });
                } catch (error) {
                    console.error('Error preparing tab change email:', error);
                }
            }
            
            // Generate and replace content for the selected day
            if (dailyThoughts[dayIndex]) {
                const newContent = generateTabContent(dailyThoughts[dayIndex], dayIndex);
                activeTabContainer.innerHTML = newContent;
                
                // Immediate scroll to top with offset for daily-entry gradient bar
                const activeTabContent = document.querySelector('.tab-content.active');
                if (activeTabContent) {
                    // Simple scroll to top with small offset for the gradient bar
                    activeTabContent.scrollTop = 0;
                }
                
                // Force refresh and ensure clean scroll position after tab switch
                setTimeout(() => {
                    // Reset all scroll containers to top
                    const containers = [
                        document.querySelector('.tab-content.active'),
                        activeTabContainer.querySelector('.daily-entry'),
                        activeTabContainer.querySelector('.text-content')
                    ];
                    
                    containers.forEach(container => {
                        if (container) {
                            container.scrollTop = 0;
                        }
                    });
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
                const initialActiveTab = dailyThoughtsOverlay.querySelector('#activeTabContent');
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
    
    // Reduce background elements on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const backgroundElements = isMobile ? '' : `
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
        </div>`;
    
    fullScreenOverlay.innerHTML = `
        ${backgroundElements}
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
                // Clean design without background distractions
                fullScreenOverlay.innerHTML = `
                    <div class="full-screen-content fade-in animating">
                        <div class="video-page clean-design">
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
                                <h3 class="section-title">What would you like to do? ✨</h3>
                                <button id="spendTimeBtn" class="spend-time-btn">Let's spend time 💕</button>
                                <button id="pickMeUpBtn" class="pick-me-up-btn">Pick me up!</button>
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
                <div class="work-disclaimer">
                    <p><em>⚠️ Just a heads up: I can't skip work this week, but evenings and weekends are all yours! 💕</em></p>
                </div>
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
            message: `💕 AMAZING NEWS! She wants to spend time with you! Your tiny one just confirmed! Time to get ready! 💕`,
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

function showPickMeUpModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay pick-me-up-modal animating';
    modalOverlay.id = 'pickMeUpModal';
    
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Pick me up! ✈️</h3>
            </div>
            <div class="modal-body">
                <p>Please share your flight details so I can pick you up!</p>
                <div class="flight-input-section">
                    <label for="flightNumber">Flight Number (optional):</label>
                    <input type="text" id="flightNumber" placeholder="e.g. AA123, UA456..." />
                    <small>You can also just text me the details instead 📱</small>
                </div>
            </div>
            <div class="modal-actions">
                <button id="confirmPickMeUp" class="confirm-btn">Submit</button>
                <button id="cancelPickMeUp" class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Trigger animation
    requestAnimationFrame(() => {
        modalOverlay.classList.add('show');
        setTimeout(() => {
            modalOverlay.classList.remove('animating');
        }, 300);
    });
    
    // Focus on input
    setTimeout(() => {
        const flightInput = document.getElementById('flightNumber');
        if (flightInput) flightInput.focus();
    }, 100);
}

function hidePickMeUpModal() {
    const modalOverlay = document.querySelector('.pick-me-up-modal');
    if (modalOverlay) {
        modalOverlay.classList.add('animating');
        modalOverlay.classList.remove('show');
        
        setTimeout(() => {
            if (modalOverlay.parentNode) {
                modalOverlay.parentNode.removeChild(modalOverlay);
            }
        }, 300);
    }
}

async function handlePickMeUpConfirm() {
    const flightNumber = document.getElementById('flightNumber').value.trim();
    
    hidePickMeUpModal();
    
    // Disable the pick me up button
    const pickMeUpBtn = document.getElementById('pickMeUpBtn');
    if (pickMeUpBtn) {
        pickMeUpBtn.disabled = true;
        pickMeUpBtn.classList.add('disabled');
        pickMeUpBtn.textContent = 'Pickup request sent ✈️';
    }
    
    // Send email notification
    try {
        const templateParams = {
            user_email: 'ilan.mamontov@gmail.com',
            to_name: 'Alex',
            from_name: 'Your Tiny One Website',
            message: `✈️ PICK UP THE LITTLE ONE! ✈️\n\nYour tiny one needs a pickup! Time to be her airport hero! 💕\n\nFlight Details: ${flightNumber || 'She will text you the details'}`,
            timestamp: new Date().toLocaleString()
        };
        
        await sendEmailIfProduction(templateParams);
        
    } catch (error) {
        console.error('Error sending pickup email:', error);
        if (!isLocalEnvironment()) {
            alert('⚠️ Pickup request failed to send. Please text me instead');
        }
    }
    
    // Show confirmation message
    const confirmMessage = document.createElement('div');
    confirmMessage.className = 'confirm-message';
    confirmMessage.innerHTML = `
        <div class="message-content">
            <h3>I will see you Sunday!</h3>
            <p class="email-status">Alex has been notified and will pick you up!</p>
        </div>
    `;
    
    document.body.appendChild(confirmMessage);
    
    // Trigger show animation
    requestAnimationFrame(() => {
        confirmMessage.classList.add('show');
    });
    
    // Remove message after 8 seconds
    setTimeout(() => {
        confirmMessage.classList.remove('show');
        // Remove from DOM after fade out
        setTimeout(() => {
            confirmMessage.remove();
        }, 300);
    }, 8000);
}

// New function for showing spend day confirmation modal for August entries
function showSpendDayConfirmation(date, title) {
    const modal = document.createElement('div');
    modal.id = 'spendDayConfirmationModal';
    modal.className = 'modal-overlay animating';
    
    modal.innerHTML = `
        <div class="modal-content spend-day-modal">
            <div class="modal-header">
                <h3>💕 Spend the Day Together</h3>
            </div>
            <div class="modal-body">
                <div class="romantic-message">
                    <p>✨ Would you like to spend a day with me? ✨</p>
            <div class="modal-actions">
                <button id="confirmSpendDay" class="confirm-btn">Yes, let's spend the day together! 💕</button>
                <button id="cancelSpendDay" class="cancel-btn">Maybe another time</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for the modal
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'confirmSpendDay') {
            handleSpendDayConfirm(date, title);
        } else if (e.target.id === 'cancelSpendDay' || e.target === modal) {
            hideSpendDayModal();
        }
    });
    
    // Show modal with animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
        
        // Auto-focus on confirm button
        setTimeout(() => {
            const confirmBtn = document.getElementById('confirmSpendDay');
            if (confirmBtn) confirmBtn.focus();
        }, 300);
    });
}

function hideSpendDayModal() {
    const modal = document.getElementById('spendDayConfirmationModal');
    if (modal) {
        modal.classList.add('animating');
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

async function handleSpendDayConfirm(date, title) {
    hideSpendDayModal();
    
    // Send email notification
    try {
        const templateParams = {
            user_email: 'ilan.mamontov@gmail.com',
            to_name: 'Alex',
            from_name: 'Your Tiny One Website',
            message: `💕 SPEND THE DAY TOGETHER REQUEST! 💕\n\nYour tiny one wants to spend the day with you! Time to plan something beautiful! ✨\n\nRequested from: ${title} (${date})\n\nShe's ready for:\n☕ Morning coffee & cuddles\n🌸 A romantic walk together\n🍽️ Cooking dinner together\n🌙 Stargazing in the evening`,
            timestamp: new Date().toLocaleString()
        };
        
        await sendEmailIfProduction(templateParams);
        
    } catch (error) {
        console.error('Error sending spend day email:', error);
        if (!isLocalEnvironment()) {
            alert('⚠️ Request failed to send. Please text me instead');
        }
    }
    
    // Show confirmation message
    const confirmMessage = document.createElement('div');
    confirmMessage.className = 'confirm-message';
    confirmMessage.innerHTML = `
        <div class="message-content">
            <h3>💕 Day together requested!</h3>
            <p class="email-status">Alex has been notified and will plan something special! ✨</p>
            <div class="hearts-animation">
                <span class="floating-heart">💕</span>
                <span class="floating-heart">💖</span>
                <span class="floating-heart">✨</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmMessage);
    
    // Trigger show animation
    requestAnimationFrame(() => {
        confirmMessage.classList.add('show');
    });
    
    // Remove message after 8 seconds
    setTimeout(() => {
        confirmMessage.classList.remove('show');
        // Remove from DOM after fade out
        setTimeout(() => {
            confirmMessage.remove();
        }, 300);
    }, 8000);
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

async function openImageModal(imageSrc, imageAlt = '', clickedElement = null) {
    let modal = document.querySelector('.image-modal');
    if (!modal) {
        modal = createImageModal();
    }
    
    const modalImg = modal.querySelector('img');
    modalImg.src = imageSrc;
    modalImg.alt = imageAlt;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Get the active tab date and send email notification
    try {
        const activeTab = document.querySelector('.tab-button.active');
        let activeDate = 'Unknown';
        let activeTitle = 'Unknown';
        let mediaIndex = 'Unknown';
        let totalMedia = 'Unknown';
        
        if (activeTab) {
            const dayIndex = activeTab.dataset.day;
            if (dayIndex !== undefined && dailyThoughts[dayIndex]) {
                activeDate = dailyThoughts[dayIndex].date;
                activeTitle = dailyThoughts[dayIndex].title;
                totalMedia = dailyThoughts[dayIndex].photos ? dailyThoughts[dayIndex].photos.length : 0;
            }
        }
        
        // Calculate media index if element is provided
        if (clickedElement) {
            const entryContainer = clickedElement.closest('.daily-entry');
            if (entryContainer) {
                const allMedia = entryContainer.querySelectorAll('img, video');
                const clickedIndex = Array.from(allMedia).indexOf(clickedElement);
                mediaIndex = clickedIndex !== -1 ? (clickedIndex + 1) : 'Unknown';
            }
        }
        
        const templateParams = {
            user_email: 'ilan.mamontov@gmail.com',
            to_name: 'Alex',
            from_name: 'Your Tiny One Website',
            message: `💕 Your tiny one just enlarged a picture! 📸✨\n\nActive tab: ${activeTitle} (${activeDate})\nMedia: ${mediaIndex} of ${totalMedia}\n\nShe's looking at the memories from that day! 💕`,
            timestamp: new Date().toLocaleString()
        };
        
        await sendEmailIfProduction(templateParams);
    } catch (error) {
        console.error('Error sending image enlargement email:', error);
    }
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Add click handlers for images and videos
document.addEventListener('click', async (e) => {
    // Handle image clicks
    if (e.target.matches('.entry-photo img, .daily-entry img')) {
        e.preventDefault();
        await openImageModal(e.target.src, e.target.alt, e.target);
    }
    
    // Handle video clicks
    if (e.target.matches('.entry-photo video, .daily-entry video')) {
        // Send email notification for video play
        try {
            const activeTab = document.querySelector('.tab-button.active');
            let activeDate = 'Unknown';
            let activeTitle = 'Unknown';
            let mediaIndex = 'Unknown';
            let totalMedia = 'Unknown';
            
            if (activeTab) {
                const dayIndex = activeTab.dataset.day;
                if (dayIndex !== undefined && dailyThoughts[dayIndex]) {
                    activeDate = dailyThoughts[dayIndex].date;
                    activeTitle = dailyThoughts[dayIndex].title;
                    totalMedia = dailyThoughts[dayIndex].photos ? dailyThoughts[dayIndex].photos.length : 0;
                }
            }
            
            // Calculate media index
            const entryContainer = e.target.closest('.daily-entry');
            if (entryContainer) {
                const allMedia = entryContainer.querySelectorAll('img, video');
                const clickedIndex = Array.from(allMedia).indexOf(e.target);
                mediaIndex = clickedIndex !== -1 ? (clickedIndex + 1) : 'Unknown';
            }
            
            const templateParams = {
                user_email: 'ilan.mamontov@gmail.com',
                to_name: 'Alex',
                from_name: 'Your Tiny One Website',
                message: `💕 Your tiny one just played a video! 🎬✨\n\nActive tab: ${activeTitle} (${activeDate})\nMedia: ${mediaIndex} of ${totalMedia}\n\nShe's watching the memories from that day! 💕`,
                timestamp: new Date().toLocaleString()
            };
            
            await sendEmailIfProduction(templateParams);
        } catch (error) {
            console.error('Error sending video play email:', error);
        }
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
  