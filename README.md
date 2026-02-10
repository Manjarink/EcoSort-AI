# 🌱 EcoSort AI - Smart Waste Segregation

> **Hackathon Project**: SDG 12 - Responsible Consumption & Production  
> **Powered by**: Teachable Machine & TensorFlow.js

![EcoSort AI Banner](https://img.shields.io/badge/AI-TensorFlow.js-orange) ![SDG 12](https://img.shields.io/badge/SDG-12-green) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## 🎯 Problem Statement

People often struggle to correctly classify waste items, leading to contamination in recycling streams and improper disposal. **EcoSort AI** provides instant, AI-powered guidance directly in your browser, promoting environmental awareness and responsible waste management.

## ✨ Features

- 📸 **Camera Capture** - Take photos directly from your device
- 🖼️ **Image Upload** - Upload images of waste items
- 🧠 **Smart AI** - Custom Teachable Machine model identifies waste
- ⚡ **Instant Results** - 100% Client-side inference (no server lag)
- 🌍 **Educational Fun Facts** - Learn about environmental impact
- 🔒 **Privacy First** - Images are processed locally and never uploaded

## 🧠 How It Works (Client-Side AI)

**EcoSort AI** runs entirely in your browser using **TensorFlow.js**:

1. **Model Loading**
   - Loads a custom-trained neural network from Teachable Machine.
   - Distinct classes: **Recyclable** ♻️, **Organic** 🌱, **Hazardous** ⚠️

2. **Instant Inference**
   - The camera feed is analyzed in real-time.
   - No data is sent to any server (except the initial webpage load).

3. **System Educates**
   - Generates awareness message explaining the classification.
   - Shows environmental impact facts.

## 🛠️ Tech Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **AI Engine**: TensorFlow.js
- **Model Training**: Teachable Machine (Google)
- **Deployment**: Vercel (Static Site)

**Zero Backend** - No servers, no databases, just clean code!

## 🚀 Quick Start

### Local Development

1. **Clone/Download this project**

2. **Open `index.html`** in your browser
   - That's it! It works out of the box.

### Deployment

1. **Push to GitHub**
2. **Import to Vercel**
3. **Deploy** (No environment variables needed!)

## 📱 Usage

1. **Open the app**
2. **Choose input method**:
   - Click "Use Camera" to take a photo
   - Click "Upload Image" to select from device
3. **Analyze** - AI identifies and classifies the item
4. **Learn** - Read awareness message and fun fact

## 📂 Project Structure

```
ecosort-ai/
├── index.html          # Main app structure + TF.js import
├── styles.css          # Eco-friendly styling
├── script.js           # Model logic & camera handling
├── README.md           # This file
└── .gitignore          # Git exclusions
```

## 🌍 Environmental Impact

By correctly sorting waste, users can help:
- **Reduce landfill waste** by up to 50%
- **Save energy** through recycling
- **Prevent contamination** of recycling streams
- **Reduce methane emissions** from organic waste

## 👥 Credits

**Built for SDG 12 Hackathon**

---

**Made with 💚 for a sustainable future**
