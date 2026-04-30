# Screenshot Guide

## How to Capture the Marketing Page Screenshot

This guide explains how to take a screenshot of the rendered Maui Luxury Vacation Rentals marketing page for submission.

### Steps

1. **Start the development server:**
   ```bash
   cd week12/term-project
   npm install  # if dependencies not yet installed
   npm run dev
   ```

2. **Open the page in your browser:**
   - The terminal will display: `Local: http://localhost:5173/`
   - Open your browser and navigate to this URL
   - You should see the complete marketing page with:
     - Header with navigation
     - Hero section with property image and headline
     - About section with property description
     - Amenities grid with emoji icons
     - Call-to-action section with "Contact Us" button
     - Footer with copyright

3. **Capture the screenshot:**
   
   **On Windows:**
   - Press `Windows Key + Shift + S`
   - Select "Fullscreen" or draw a region around the page
   - Image is copied to clipboard
   - Use Ctrl + V to paste into Paint or an image editor, then Save As

   **On macOS:**
   - Press `Cmd + Shift + 4`, then `Space`, then click the window
   - Screenshot saves to Desktop automatically
   - Or use `Cmd + Shift + 5` for more capture options

   **On Linux:**
   - Use `gnome-screenshot` command or screenshot tool
   - Or press `Print Screen` key

4. **Save the screenshot:**
   - Save as `week12/term-project/docs/screenshot.png` (PNG format preferred for clarity)
   - Ensure the entire page is visible in the shot, including header, hero, about, amenities, CTA, and footer

5. **Commit to GitHub:**
   ```bash
   cd week12/term-project
   git add docs/screenshot.png
   git add .
   git commit -m "Week 12: Add marketing page screenshot"
   git push origin main
   ```

### What the Page Should Look Like

- **Header:** Dark blue (`#094f57`) with "Maui Hospitality" logo and navigation links (Home, Dashboard, Admin)
- **Hero:** Large image background with overlay, property name "Kihei Studio by the Sea", island name "Maui", and an "Explore Listings" button
- **About:** Light blue background with property description and three highlight cards
- **Amenities:** White background with a grid of emoji-labeled amenity cards (wifi 📶, kitchen 🍳, beach access 🏖️, parking 🅿️, air conditioning ❄️)
- **CTA:** Blue gradient background with "Contact Us" button and secondary "View More Listings" button
- **Footer:** Dark background with copyright and footer links

### Responsive Design Notes

For a professional submission, capture the page at:
- **Desktop width (recommended):** Full browser window at 1920px or wider
- **Mobile width (alternative):** 375px width to demonstrate responsive design

---

**Note:** The screenshot will be reviewed as part of your submission to verify that all components render correctly and the page is responsive and accessible.
