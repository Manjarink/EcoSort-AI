// Vercel Serverless Function for AI Waste Classification
// This function receives an image, uses Google Gemini Vision API to identify the object,
// then applies rule-based classification to determine waste category

export default async function handler(req, res) {
    // Enable CORS for development
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Get API key from environment variable
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'API key not configured. Please add GEMINI_API_KEY to environment variables.'
            });
        }

        // Remove data URL prefix to get base64 string
        const base64Image = image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '');

        // Call Gemini Vision API (trying v1 endpoint)
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: "Identify this waste item in 1-3 words. Just name the object, nothing else. Examples: 'plastic bottle', 'banana peel', 'battery', 'newspaper'."
                            },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Image
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 50
                    }
                })
            }
        );

        if (!geminiResponse.ok) {
            // Log detailed error for debugging
            const errorText = await geminiResponse.text();
            console.error('Gemini API Error Details:', {
                status: geminiResponse.status,
                statusText: geminiResponse.statusText,
                body: errorText
            });
            throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
        }

        const geminiData = await geminiResponse.json();

        // Extract identified object
        const identifiedObject = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || 'unknown item';

        // Apply rule-based classification
        const classification = classifyWaste(identifiedObject);

        // Return result
        return res.status(200).json({
            objectName: identifiedObject,
            category: classification.category,
            awarenessMessage: classification.awarenessMessage,
            alternatives: classification.alternatives
        });

    } catch (error) {
        console.error('Classification error:', error);
        return res.status(500).json({
            error: 'Failed to classify image. Please try again.',
            details: error.message
        });
    }
}

// ============================================
// HYBRID CLASSIFICATION SYSTEM
// Rule-based mapping of identified objects to waste categories
// ============================================
function classifyWaste(objectName) {
    const lowerName = objectName.toLowerCase();

    // RECYCLABLE ITEMS
    const recyclableKeywords = [
        'bottle', 'plastic', 'can', 'aluminum', 'glass', 'jar', 'container',
        'paper', 'cardboard', 'box', 'newspaper', 'magazine', 'carton',
        'metal', 'tin', 'steel', 'cup', 'bag', 'wrapper', 'packaging'
    ];

    // ORGANIC ITEMS
    const organicKeywords = [
        'peel', 'banana', 'apple', 'orange', 'fruit', 'vegetable', 'food',
        'waste', 'scrap', 'compost', 'leaves', 'grass', 'plant', 'flower',
        'coffee', 'grounds', 'tea', 'eggshell', 'bread', 'rice', 'leftover'
    ];

    // HAZARDOUS ITEMS
    const hazardousKeywords = [
        'battery', 'electronic', 'phone', 'computer', 'charger', 'cable',
        'chemical', 'paint', 'oil', 'medicine', 'pill', 'syringe', 'needle',
        'bleach', 'cleaner', 'pesticide', 'bulb', 'fluorescent', 'thermometer'
    ];

    // Check for hazardous first (highest priority)
    if (hazardousKeywords.some(keyword => lowerName.includes(keyword))) {
        return {
            category: 'Hazardous',
            awarenessMessage: `This item contains materials that can harm the environment and human health if not disposed of properly. Please take it to a designated hazardous waste collection facility. Don't throw it in regular trash or recycling bins!`,
            alternatives: [
                'Find your nearest e-waste or hazardous waste collection center',
                'Check if the manufacturer has a take-back program',
                'Contact your local municipality for safe disposal options',
                'Never pour chemicals down drains or throw batteries in regular trash'
            ]
        };
    }

    // Check for organic
    if (organicKeywords.some(keyword => lowerName.includes(keyword))) {
        return {
            category: 'Organic',
            awarenessMessage: `This is biodegradable organic waste! Instead of sending it to a landfill where it produces harmful methane gas, you can compost it. Composting turns food scraps into nutrient-rich soil that helps plants grow.`,
            alternatives: [
                'Start a home compost bin (it\'s easier than you think!)',
                'Use a community composting service if available',
                'Feed appropriate scraps to chickens or farm animals',
                'Create a small vermicompost (worm composting) setup for apartments'
            ]
        };
    }

    // Check for recyclable
    if (recyclableKeywords.some(keyword => lowerName.includes(keyword))) {
        return {
            category: 'Recyclable',
            awarenessMessage: `Great news! This item can be recycled and turned into new products. Make sure to rinse it clean and check your local recycling guidelines. Recycling saves energy, reduces pollution, and conserves natural resources.`,
            alternatives: [
                'Rinse containers before recycling to avoid contamination',
                'Remove caps and labels if your facility requires it',
                'Consider reusing this item before recycling (reduce comes first!)',
                'Flatten cardboard boxes to save space in recycling bins'
            ]
        };
    }

    // Default case (unknown items)
    return {
        category: 'Recyclable',
        awarenessMessage: `I'm not entirely sure about this item, but it might be recyclable. To be safe, check with your local waste management guidelines. When in doubt, it's better to ask than to contaminate recycling streams.`,
        alternatives: [
            'Contact your local waste management authority for guidance',
            'Check online recycling databases for your area',
            'Look for recycling symbols on the packaging',
            'Consider if this item can be reused or repurposed first'
        ]
    };
}
