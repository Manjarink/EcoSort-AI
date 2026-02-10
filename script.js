// ==========================================
// 🧠 TEACHABLE MACHINE CONFIGURATION
// ==========================================
// ⚠️ REPLACE THIS URL WITH YOUR OWN MODEL URL!
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/fUrWHAxGn/";

let model, maxPredictions;
let isDemoMode = false; // Disable demo mode now that we have a real model

// Load the image model
async function init() {
    console.log("Loading model...");
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        isDemoMode = false;
        console.log("Model loaded successfully!");

        // Show user readiness
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) uploadBtn.innerHTML = '<span class="btn-icon">🖼️</span> Upload Image (Model Ready)';
    } catch (error) {
        console.warn("Model failed to load - switching to DEMO MODE");
        isDemoMode = true;
        // visual indicator for demo mode
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) uploadBtn.innerHTML = '<span class="btn-icon">🧪</span> Upload Image (Demo Mode)';
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);

// ==========================================
// 🖼️ IMAGE HANDLING & PREDICTION
// ==========================================

const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const imagePreview = document.getElementById('imagePreview');
const previewSection = document.getElementById('previewSection');
const cameraBtn = document.getElementById('cameraBtn');
const cameraVideo = document.getElementById('cameraVideo');
const cameraCanvas = document.getElementById('cameraCanvas');
const retakeBtn = document.getElementById('retakeBtn');
const sortAnotherBtn = document.getElementById('sortAnotherBtn');

// Reset Function
function resetApp() {
    window.location.reload();
}

if (retakeBtn) retakeBtn.addEventListener('click', resetApp);
if (sortAnotherBtn) sortAnotherBtn.addEventListener('click', resetApp);

// Trigger file input when clicking upload button
if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        if (fileInput) fileInput.click();
    });
}

// Toggle Camera
if (cameraBtn) {
    cameraBtn.addEventListener('click', async () => {
        // If video is already playing, capture image
        if (cameraVideo.style.display === 'block') {
            const context = cameraCanvas.getContext('2d');
            cameraCanvas.width = cameraVideo.videoWidth;
            cameraCanvas.height = cameraVideo.videoHeight;
            context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);

            // Stop stream
            const stream = cameraVideo.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            cameraVideo.srcObject = null;

            // Show preview
            imagePreview.src = cameraCanvas.toDataURL('image/jpeg');
            cameraVideo.style.display = 'none';
            previewSection.classList.remove('hidden');
            resultsSection.classList.add('hidden');
            imagePreview.dataset.loaded = "true";

            cameraBtn.innerHTML = '<span class="btn-icon">📷</span> Use Camera';
            if (uploadBtn) uploadBtn.style.display = 'inline-flex';

        } else {
            // Start Camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                cameraVideo.srcObject = stream;
                cameraVideo.style.display = 'block';
                cameraVideo.play();

                // Hide other UI
                imagePreview.style.display = 'none';
                previewSection.classList.add('hidden');
                resultsSection.classList.add('hidden');
                if (uploadBtn) uploadBtn.style.display = 'none';

                cameraBtn.innerHTML = '<span class="btn-icon">📸</span> Capture Photo';

            } catch (err) {
                console.error("Camera Error:", err);
                alert("Could not access camera. Please allow camera permissions.");
            }
        }
    });
}

// Handle File Select
if (fileInput) {
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            // Show preview
            imagePreview.src = event.target.result;
            previewSection.classList.remove('hidden');
            resultsSection.classList.add('hidden');

            // Store image for prediction
            imagePreview.dataset.loaded = "true";
        };
        reader.readAsDataURL(file);
    });
}

// Analyze Button Click
if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
        if (!imagePreview.dataset.loaded) return;
        await predict(imagePreview);
    });
}

// Run Prediction
async function predict(imageElement) {
    // Show loading
    loadingSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    // Small delay to allow UI to update (and simulate processing time)
    await new Promise(resolve => setTimeout(resolve, 1500));

    let bestClass = "";
    let highestProb = 0;

    if (isDemoMode) {
        // DEMO MODE: Random prediction
        const demoClasses = ["Recyclable", "Organic", "Hazardous"];
        const randomIndex = Math.floor(Math.random() * demoClasses.length);
        bestClass = demoClasses[randomIndex];
        highestProb = 0.85 + (Math.random() * 0.14); // Random confidence between 85-99%

        console.log(`DEMO PREDICTION: ${bestClass} (${highestProb})`);
        // Add visual warning
        const awarenessMsg = document.getElementById('awarenessMessage');
        const originalColor = awarenessMsg.style.color;

        // We handle the warning in displayResult, but let's log it
    } else {
        // REAL PREDICTION
        if (model) {
            const prediction = await model.predict(imageElement);
            for (let i = 0; i < maxPredictions; i++) {
                if (prediction[i].probability > highestProb) {
                    highestProb = prediction[i].probability;
                    bestClass = prediction[i].className;
                }
            }
        }
    }

    // Display Result
    displayResult(bestClass, highestProb);
}

// ==========================================
// 📊 UI UPDATES
// ==========================================

function displayResult(className, probability) {
    loadingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    const confidence = (probability * 100).toFixed(1);

    // Update basic info
    const objectName = document.getElementById('objectName');
    const categoryName = document.getElementById('categoryName');

    if (isDemoMode) {
        objectName.innerText = `DEMO: ${className} (Simulated)`;
        objectName.style.color = "#ff9800"; // Orange warning
    } else {
        objectName.innerText = `${className} (${confidence}%)`;
        objectName.style.color = ""; // Reset
    }

    categoryName.innerText = className;

    // Display Fun Fact
    const funFactElement = document.getElementById('funFact');
    // Basic fun facts database
    const facts = [
        "Recycling one aluminum can saves enough energy to run a TV for 3 hours!",
        "Plastic bottles take 450 years to decompose in a landfill.",
        "Glass is 100% recyclable and can be recycled endlessly without loss in quality.",
        "Composting organic waste reduces methane emissions from landfills.",
        "Up to 60% of the rubbish that ends up in the dustbin could be recycled.",
        "The energy saved from recycling one glass bottle can power a light bulb for 4 hours.",
        "Cardboard boxes can be recycled at least 7 times.",
        "Every ton of recycled paper saves 17 trees and 7,000 gallons of water."
    ];

    if (funFactElement) {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        funFactElement.innerText = randomFact;
    }

    // Map content based on class name (Case Insensitive)
    const lowerClass = className.toLowerCase();
    const content = getContentForClass(lowerClass);

    const awarenessMessage = document.getElementById('awarenessMessage');

    if (isDemoMode) {
        awarenessMessage.innerHTML = `<strong>⚠️ DEMO MODE ACTIVE:</strong> Using random prediction.<br>To fix: Train your model on Teachable Machine and update script.js.<br><br>${content.message}`;
    } else {
        awarenessMessage.innerText = content.message;
    }


}

// Rich Content Database
function getContentForClass(className) {
    // Default content
    let content = {
        message: "Please dispose of this item responsibly according to local guidelines."
    };

    if (className.includes("recyclable") || className.includes("plastic") || className.includes("paper") || className.includes("cardboard")) {
        content = {
            message: "♻️ This item is Recyclable! Recycling saves energy and resources."
        };
    } else if (className.includes("organic") || className.includes("food") || className.includes("peel") || className.includes("fruit")) {
        content = {
            message: "🌱 This is Organic waste. It can be composted to create nutrient-rich soil!"
        };
    } else if (className.includes("hazardous") || className.includes("battery") || className.includes("e-waste") || className.includes("bulb")) {
        content = {
            message: "⚠️ Warning: Hazardous Waste! Do NOT throw in regular trash."
        };
    }

    return content;
}
