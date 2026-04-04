# **App Name**: UrduVerify AI

## Core Features:

- Shopify Order Sync & Call Trigger: Automatically fetch new orders from Shopify, extract customer and order details, and initiate outbound calls to confirm orders.
- Urdu AI Voice Conversationalist: Utilize Urdu speech-to-text (STT) and text-to-speech (TTS) with natural voice to enable real-time, fluent Urdu conversations, handling interruptions context-awarely.
- Intelligent Query Response Tool: An AI-powered tool that intelligently answers customer questions in Urdu (e.g., price, delivery, returns, payment options) by leveraging Shopify product data and a predefined FAQ database.
- Order Status Management & Logging: Update Shopify order tags (Confirmed, Cancelled, No Answer), add call notes to the Shopify timeline, and save comprehensive call records (transcript, sentiment, duration, outcome) to Firestore.
- Admin & Monitoring Dashboard: A user interface (UI) to view call logs, monitor order statuses, access customer details, and trigger manual calls for orders needing intervention, leveraging Firestore data.
- Basic Call Retry & Detection: Implement retry logic for calls without an answer and voicemail detection to optimize call outcomes and efficiency.

## Style Guidelines:

- Primary color: A sophisticated blue-violet (`#6826C9`) conveying professionalism and modern technology. This rich hue will be used for interactive elements and key brand accents.
- Background color: A subtle, light greyish-violet (`#ECE9F2`) provides a clean and expansive backdrop, ensuring clarity and focus on the conversational and data elements.
- Accent color: A vibrant electric blue (`#6270F5`) used to highlight critical actions, notifications, and elements requiring immediate attention, providing effective contrast.
- Headline font: 'Space Grotesk' (sans-serif), for a modern, slightly techy feel that suits the AI-powered nature of the application.
- Body font: 'Inter' (sans-serif), chosen for its exceptional legibility and neutral design, ideal for displaying detailed logs, customer information, and administrative data clearly.
- Use clear, concise, and universally recognizable iconography for call actions, order statuses, and system alerts to maintain intuitive navigation within the dashboard.
- Employ a responsive grid-based layout for the admin dashboard to ensure optimal usability across various screen sizes, prioritizing data readability and efficient interaction.