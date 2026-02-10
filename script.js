// ============================================
// STATE MANAGEMENT
// ============================================
let currentImageData = null;
let itemsSorted = parseInt(localStorage.getItem('ecosort_items_sorted') || '0');
let cameraStream = null;

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Sections
    uploadSection: document.getElementById('uploadSection'),
    previewSection: document.getElementById('previewSection'),
    loadingSection: document.getElementById('loadingSection'),
    resultsSection: document.getElementById('resultsSection'),
    
    // Buttons
    cameraBtn: document.getElementById('cameraBtn'),
    uploadBtn: document.getElementById('uploadBtn'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    retakeBtn: document.getElementById('retakeBtn'),
    sortAnotherBtn: document.getElementById('sortAnotherBtn'),
    
    // Inputs
    fileInput: document.getElementById('fileInput'),
    cameraVideo: document.getElementById('cameraVideo'),
    cameraCanvas: document.getElementById('cameraCanvas'),
    
    // Display elements
    imagePreview: document.getElementById('imagePreview'),
    itemCount: document.getElementById('itemCount'),
    objectName: document.getElementById('objectName'),
    categoryCard: document.getElementById('categoryCard'),
    categoryIcon: document.getElementById('categoryIcon'),
    categoryName: document.getElementById('categoryName'),
    awarenessMessage: document.getElementById('awarenessMessage'),
    alternativesList: document.getElementById('alternativesList'),
    funFact: document.getElementById('funFact')
};

// ============================================
// FUN FACTS DATABASE
// ============================================
const funFacts = [
    "Recycling one aluminum can saves enough energy to power a laptop for 3 hours!",
    "It takes 450 years for a plastic bottle to decompose in the ocean.",
    "Composting food waste reduces methane emissions by up to 50%.",
    "Glass can be recycled endlessly without losing quality or purity.",
    "Every ton of recycled paper saves 17 trees and 7,000 gallons of water.",
    "A single recycled plastic bottle can save enough energy to power a 60W light bulb for 6 hours.",
    "Food waste in landfills produces methane, a greenhouse gas 25x more potent than CO2.",
    "Recycling steel saves 60% of the energy needed to make new steel from raw materials.",
    "Organic waste makes up about 30% of what we throw away but can become valuable compost.",
    "Improper disposal of batteries can leak toxic chemicals into soil and water sources."
];

// ============================================
// INITIALIZATION
// ============================================
function init() {
    updateStatsDisplay();
    attachEventListeners();
}

function attachEventListeners() {
    elements.cameraBtn.addEventListener('click', handleCameraClick);
    elements.uploadBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileUpload);
    elements.analyzeBtn.addEventListener('click', analyzeImage);
    elements.retakeBtn.addEventListener('click', resetToUpload);
    elements.sortAnotherBtn.addEventListener('click', resetToUpload);
}

// ============================================
// STATS MANAGEMENT
// ============================================
function updateStatsDisplay() {
    elements.itemCount.textContent = itemsSorted;
}

function incrementStats() {
    itemsSorted++;
    localStorage.setItem('ecosort_items_sorted', itemsSorted.toString());
    updateStatsDisplay();
}

// ============================================
// CAMERA FUNCTIONALITY
// ============================================
async function handleCameraClick() {
    try {
        // Request camera access
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } // Use back camera on mobile
        });
        
        // Show video preview
        elements.cameraVideo.srcObject = cameraStream;
        elements.cameraVideo.style.display = 'block';
        
        // Change button to capture
        elements.cameraBtn.innerHTML = '<span class="btn-icon">📸</span> Capture Photo';
        elements.cameraBtn.onclick = capturePhoto;
        elements.uploadBtn.disabled = true;
        elements.uploadBtn.style.opacity = '0.5';
        
    } catch (error) {
        console.error('Camera error:', error);
        alert('Unable to access camera. Please check permissions or use the upload option.');
    }
}

function capturePhoto() {
    const video = elements.cameraVideo;
    const canvas = elements.cameraCanvas;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0);
    
    // Convert to base64
    currentImageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Stop camera stream
    stopCamera();
    
    // Show preview
    showPreview(currentImageData);
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    elements.cameraVideo.style.display = 'none';
    elements.cameraVideo.srcObject = null;
    
    // Reset button
    elements.cameraBtn.innerHTML = '<span class="btn-icon">📷</span> Use Camera';
    elements.cameraBtn.onclick = handleCameraClick;
    elements.uploadBtn.disabled = false;
    elements.uploadBtn.style.opacity = '1';
}

// ============================================
// FILE UPLOAD FUNCTIONALITY
// ============================================
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }
    
    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageData = e.target.result;
        showPreview(currentImageData);
    };
    reader.readAsDataURL(file);
}

// ============================================
// UI STATE MANAGEMENT
// ============================================
function showSection(sectionToShow) {
    // Hide all sections
    elements.uploadSection.classList.add('hidden');
    elements.previewSection.classList.add('hidden');
    elements.loadingSection.classList.add('hidden');
    elements.resultsSection.classList.add('hidden');
    
    // Show requested section
    sectionToShow.classList.remove('hidden');
}

function showPreview(imageData) {
    elements.imagePreview.src = imageData;
    showSection(elements.previewSection);
}

function resetToUpload() {
    currentImageData = null;
    elements.fileInput.value = '';
    stopCamera();
    showSection(elements.uploadSection);
}

// ============================================
// AI CLASSIFICATION
// ============================================
async function analyzeImage() {
    if (!currentImageData) {
        alert('No image to analyze. Please upload or capture an image first.');
        return;
    }
    
    // Show loading state
    showSection(elements.loadingSection);
    
    try {
        // Call Vercel serverless function
        const response = await fetch('/api/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: currentImageData
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Display results
        displayResults(result);
        
        // Increment stats
        incrementStats();
        
    } catch (error) {
        console.error('Classification error:', error);
        alert('Sorry, there was an error analyzing your image. Please try again or check your internet connection.');
        showSection(elements.previewSection);
    }
}

// ============================================
// RESULTS DISPLAY
// ============================================
function displayResults(result) {
    // Display identified object
    elements.objectName.textContent = result.objectName;
    
    // Display category with appropriate styling
    const category = result.category.toLowerCase();
    elements.categoryCard.className = 'category-card ' + category;
    
    // Set category icon
    const icons = {
        recyclable: '♻️',
        organic: '🌱',
        hazardous: '⚠️'
    };
    elements.categoryIcon.textContent = icons[category] || '📦';
    
    // Set category name
    elements.categoryName.textContent = result.category;
    
    // Display awareness message
    elements.awarenessMessage.innerHTML = `<p>${result.awarenessMessage}</p>`;
    
    // Display alternatives
    if (result.alternatives && result.alternatives.length > 0) {
        elements.alternativesList.innerHTML = result.alternatives
            .map(alt => `<li>${alt}</li>`)
            .join('');
    } else {
        elements.alternativesList.innerHTML = '<li>Keep sorting your waste to help the environment!</li>';
    }
    
    // Display random fun fact
    elements.funFact.textContent = getRandomFunFact();
    
    // Show results section
    showSection(elements.resultsSection);
}

function getRandomFunFact() {
    return funFacts[Math.floor(Math.random() * funFacts.length)];
}

// ============================================
// START APPLICATION
// ============================================
init();
