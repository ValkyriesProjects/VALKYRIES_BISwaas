BIS Intelligent Assistant - Modified Frontend Prototype
===========================================================

Files:
- index.html
- style.css
- script.js

What is included:
- Multi-domain BIS homepage
- Indian Standards
- Product Certification
- Licensing & Certification Process
- Testing Laboratories
- Hallmarking
- Consumer Affairs
- Standards Clubs & Training
- Conformity Assessment
- Multilingual Support
- Expanded BIS chatbot mock responses
- Hallmarking material selector: Gold, Silver, Platinum, Palladium, Other
- Sign In frontend modal with email/password and demo validation
- Backend-ready API comments and integration map
- Responsive styling

How to run:
1. Keep all three files in the same folder.
2. Open index.html in a browser.
3. Internet access is needed for Bootstrap, Bootstrap Icons and Google Fonts because
   the HTML uses CDN links.
4. The chatbot, verification and sign-in are demo frontend functions only.

Future backend endpoints referenced by the frontend:
POST /api/chat
POST /api/hallmark/verify
GET  /api/hallmark/info
GET  /api/huid/info
POST /api/auth/login

Do not place database credentials or private API keys in frontend JavaScript.
