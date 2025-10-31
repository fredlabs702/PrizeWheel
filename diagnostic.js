// Diagnostic Script - Check Prize Wheel Status
// Paste this in the browser console (F12 -> Console)

console.log("=== PRIZE WHEEL DIAGNOSTIC ===");

// Check if elements exist
console.log("1. Registration Section exists:", !!document.getElementById('registrationSection'));
console.log("2. Wheel Container exists:", !!document.getElementById('wheelContainer'));
console.log("3. Registration Form exists:", !!document.getElementById('registrationForm'));

// Check visibility
const regSection = document.getElementById('registrationSection');
const wheelContainer = document.getElementById('wheelContainer');

console.log("4. Registration Section classes:", regSection?.className);
console.log("5. Wheel Container classes:", wheelContainer?.className);

// Check if wheel is hidden
console.log("6. Wheel is hidden:", wheelContainer?.classList.contains('hidden'));
console.log("7. Registration is hidden:", regSection?.classList.contains('hidden'));

// Check if PrizeWheel is initialized
console.log("8. Window has wheel object:", typeof window.wheel);

// Check localStorage
const entries = localStorage.getItem('raffleEntries');
console.log("9. LocalStorage entries:", entries ? JSON.parse(entries).length : 0);

// Try to manually show the wheel
console.log("\n=== MANUAL FIX ===");
console.log("Run this to manually show the wheel:");
console.log("document.getElementById('registrationSection').classList.add('hidden');");
console.log("document.getElementById('wheelContainer').classList.remove('hidden');");
