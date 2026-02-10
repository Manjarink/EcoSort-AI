# 🌱 EcoSort AI - AI-Powered Waste Segregation Assistant

> **Hackathon Project**: SDG 12 - Responsible Consumption & Production  
> **Powered by**: Google Gemini Vision API

![EcoSort AI Banner](https://img.shields.io/badge/AI-Gemini%20Vision-blue) ![SDG 12](https://img.shields.io/badge/SDG-12-green) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## 🎯 Problem Statement

People often struggle to correctly classify waste items, leading to contamination in recycling streams and improper disposal. **EcoSort AI** provides instant, AI-powered guidance at the moment of decision, promoting environmental awareness and responsible waste management.

## ✨ Features

- 📸 **Camera Capture** - Take photos directly from your device
- 🖼️ **Image Upload** - Upload images of waste items
- 🤖 **AI Identification** - Google Gemini Vision identifies objects
- ♻️ **Smart Classification** - Hybrid rule-based system categorizes waste
- 💡 **Alternative Suggestions** - Actionable tips for better disposal
- 🌍 **Educational Fun Facts** - Learn about environmental impact
- 📊 **Session Stats** - Track items sorted (stored locally)

## 🧠 How the AI Works (Hybrid Approach)

### The Perfect Balance: AI + Rules

**Why Hybrid?**  
Pure AI can be unpredictable for waste classification. Our hybrid approach ensures both intelligence AND accuracy:

1. **AI Identifies** (Gemini Vision API)
   - User uploads/captures image
   - Gemini identifies object (e.g., "plastic bottle", "banana peel")
   - Fast, accurate object recognition

2. **Rules Classify** (Logic-based System)
   - Identified object mapped to waste category
   - Three categories: **Recyclable** ♻️, **Organic** 🌱, **Hazardous** ⚠️
   - Rule database ensures consistent classification

3. **System Educates**
   - Generates awareness message explaining the classification
   - Provides alternative disposal suggestions
   - Shows environmental impact facts

**For Judges**: This demonstrates real AI usage (Google Gemini) while maintaining reliability through intelligent rule mapping.

## 🛠️ Tech Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **AI**: Google Gemini Vision API (gemini-1.5-flash)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Deployment**: Vercel (one-click deploy)
- **Storage**: LocalStorage (session stats only)

**Zero Dependencies** - No frameworks, no databases, just clean code!

## 🚀 Quick Start

### Prerequisites

1. **Get a Free Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key (keep it secure!)

2. **Install Vercel CLI** (for local testing)
   ```bash
   npm install -g vercel
   ```

### Local Development

1. **Clone/Download this project**

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
3. **Add your API key to `.env.local`**
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run locally with Vercel**
   ```bash
   vercel dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment to Vercel

### Option 1: Deploy from CLI

```bash
# Login to Vercel
vercel login

# Deploy (first time - preview)
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy from GitHub (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EcoSort AI"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: `GEMINI_API_KEY`
   - Click "Deploy"

3. **Done!** Your app is live at `your-project.vercel.app`

## 📱 Usage

1. **Open the app**
2. **Choose input method**:
   - Click "Use Camera" to take a photo
   - Click "Upload Image" to select from device
3. **Analyze** - AI identifies and classifies the item
4. **Learn** - Read awareness message, alternatives, and fun fact
5. **Repeat** - Sort more items to increase your stats!

## 🎨 Design Philosophy

**Eco-Friendly + Playful = Engaging**

- **Nature-inspired gradients** (green to blue)
- **Smooth animations** for delightful interactions
- **Glass-morphism effects** for modern aesthetic
- **Playful icons and emojis** for accessibility
- **Mobile-first responsive** design

The UI aims to make waste sorting *fun* and *rewarding*, not a chore!

## 🏆 Hackathon Presentation Talking Points

1. **Real AI Integration**
   - "Uses Google's latest Gemini Vision model"
   - "Processes images in real-time with serverless architecture"

2. **Hybrid Approach = Best of Both Worlds**
   - "AI handles image recognition (its strength)"
   - "Rules ensure accurate waste classification (our expertise)"

3. **SDG 12 Alignment**
   - "Promotes responsible consumption through education"
   - "Reduces waste contamination at source"
   - "Empowers individuals to make better choices"

4. **No Complexity, All Impact**
   - "Zero database, zero authentication"
   - "Deployable in minutes"
   - "Works on any device with a camera"

5. **Scalability**
   - "Serverless = handles any traffic spike"
   - "Can easily add more waste categories"
   - "Future: AR overlay, gamification, community features"

## 📊 Project Structure

```
ecosort-ai/
├── index.html          # Main app structure
├── styles.css          # Eco-friendly styling
├── script.js           # Frontend logic & camera
├── api/
│   └── classify.js     # Vercel serverless function
├── vercel.json         # Vercel configuration
├── .env.example        # Environment template
├── .gitignore          # Git exclusions
└── README.md           # This file
```

## 🔒 Security Note

**For Hackathon Demo**: API key in environment variables is sufficient.

**For Production**: Consider these enhancements:
- Implement rate limiting
- Add user authentication
- Use API key rotation
- Add image validation/sanitization

## 🌍 Environmental Impact

By correctly sorting waste, users can help:
- **Reduce landfill waste** by up to 50%
- **Save energy** through recycling
- **Prevent contamination** of recycling streams
- **Reduce methane emissions** from organic waste

## 📄 License

This project is open-source and available for educational purposes.

## 👥 Credits

**Built for SDG 12 Hackathon**  
Powered by Google Gemini AI

---

**Made with 💚 for a sustainable future**
