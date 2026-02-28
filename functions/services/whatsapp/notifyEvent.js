const axios = require('axios');

const token = 'EAAp5v3A0rIgBO7X9djUc7GC5EGZAKCulwNlUzXzY8nZCb8ZCrDq6d4agkKbCQRamLVmrH3c1QPVeq2oKRiARlDP6M2m2Ji66ZChPaezxL07Fm8vSFXN9s6IoZCLlX9ZBtvb5EkZAEQcVq72O6nkOqdKwPzsOXubC9XP5lZAiyZAmxSzWSpKZBPgfyUuhZCi9ZAraLms0lg4WDZCxoBDvyAZAR6fxApXd9sCygZD'; // Get from Meta Dev Console
const phoneNumberId = '203989189458582';
const recipientPhone = '+919068111886';
const version = 'v22.0';

const notifySessionCreation = async () => {
    try {
        let body = {
            "messaging_product": "whatsapp",
            "to": recipientPhone,
            "type": "template",
            "template": {
                name: 'session_booked',
                language: { code: 'en_US' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: 'Shubh Sharma' },           // {{1}} = John
                            { type: 'text', text: 'shubhsteam1701@gmail.com' },        // {{2}} = Order ID
                            { type: 'text', text: '+91-9068111886' }, // {{3}} = Delivery Date
                            { type: 'text', text: '10/05/2025' }, // {{3}} = Delivery Date
                            { type: 'text', text: '20:00' }, // {{3}} = Delivery Date
                            { type: 'text', text: 'None' }, // {{3}} = Delivery Date
                        ]
                    }
                ]
            }
        }
        const response = await axios.post(
            `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
            body,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
    }
}

notifySessionCreation();