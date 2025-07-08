# 💕 Tiny One's Letter Website

A beautiful, interactive letter website for your tiny one with email notifications via EmailJS.

## Features

- 🌹 Beautiful animated envelope opening
- 💕 Heart burst effects
- 📺 YouTube video integration
- 📧 Email notifications when she confirms to hang out
- 🎨 Baby blue theme with romantic animations
- 📱 Mobile-optimized design
- 🚀 Works with GitHub Pages!

## Setup Instructions

### 1. Set up EmailJS (FREE)

1. Create an [EmailJS account](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your Public Key, Service ID, and Template ID

### 2. Configure the Code

Edit these files with your EmailJS credentials:

**In `index.html`:**
```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual public key
```

**In `script.js`:**
```javascript
to_email: 'your-email@example.com', // Replace with your actual email
```

```javascript
const result = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
```

### 3. Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select source branch (main/master)
4. Your site will be live at `https://yourusername.github.io/repository-name`

## How It Works

1. **Letter Opens**: Beautiful envelope animation with heart bursts
2. **First Page**: Romantic letter content with continue button
3. **Second Page**: YouTube video + "Let's spend time" button
4. **Email Magic**: When she clicks "Yes, let's do it!" → You get an instant email! 📧💕

## Email Message

When she confirms, you'll receive:
> **Subject:** 💕 Tiny One Confirmation!
> 
> 💕 AMAZING NEWS! She wants to spend time with you! Your tiny one just confirmed! Time to get ready! 💕

## Customization

- **Video**: Change the YouTube video ID in `script.js`
- **Email Message**: Modify the message in the `handleSpendTimeConfirm()` function
- **Colors**: Update the CSS variables for different themes
- **Content**: Edit the letter text in `script.js`

## Deployment Options

- **GitHub Pages**: Free and easy (recommended)
- **Netlify**: Free with custom domain support
- **Vercel**: Free with great performance
- **Any static hosting**: Just upload the files!

## Troubleshooting

- **Email not sending**: Check your EmailJS credentials and template setup
- **Video not loading**: Verify the YouTube video ID is correct
- **GitHub Pages not updating**: Wait a few minutes or check the Actions tab

---

Made with 💕 for your tiny one!

