# ColdMan Refrigeration Website Redesign

This is a redesigned, responsive ColdMan Refrigeration website inspired by the uploaded vibrant glassmorphism mockup.

## What changed

- Full visual redesign with rounded glass frame, gradient background, modern cards, hero search/audit bar and mobile layout.
- Added pages: Home, About, Services, Projects, Contact, Privacy and Terms.
- Added interactive JavaScript functionality:
  - Mobile menu
  - Service and project filters
  - Audit request modal
  - Quick audit pre-fill form
  - Savings estimator
  - FAQ accordion
  - Back-to-top button
  - Toast notifications
- Contact form now posts to `process.php`, which saves requests to `leads.json` on PHP hosting.
- Updated branding using the provided `Logo.png` copied to `images/coldman-logo.png`.

## How to run

Open `index.html` directly in a browser for the static site.

For contact form processing:
1. Put the folder inside a PHP server such as XAMPP `htdocs`.
2. Open `http://localhost/Coldguy/contact.html`.
3. Submit the form.
4. Requests will be saved to `leads.json` in the project folder.

## Files to edit

- `style.css` for design and layout.
- `app.js` for interactivity.
- `process.php` for backend form handling.
- HTML pages for content.
