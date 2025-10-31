// Prize Wheel App - Main JavaScript

class PrizeWheel {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.spinButton = document.getElementById('spinButton');
        this.prizes = this.loadPrizes();
        this.rotation = 0;
        this.isSpinning = false;
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
        
        // Initialize data management systems
        this.dataManager = new DataManager();
        this.adminPanel = new AdminPanel(this.dataManager);
        this.currentEntryId = null;
        
        // Initialize registration handler
        this.registrationHandler = new RegistrationHandler((formData) => {
            this.handleRegistration(formData);
        });
        
        this.init();
    }

    init() {
        // Set up event listeners
        this.spinButton.addEventListener('click', () => this.spin());
        document.getElementById('addPrize').addEventListener('click', () => this.addPrize());
        document.getElementById('spinAgain').addEventListener('click', () => this.resetWheel());
        document.getElementById('newPrize').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPrize();
        });

        // Settings modal listeners
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettingsModal());
        document.getElementById('confirmSettings').addEventListener('click', () => this.openSettings());
        document.getElementById('cancelSettings').addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());

        // Initial render
        this.renderPrizeList();
        this.drawWheel();
    }

    showSettingsModal() {
        document.getElementById('settingsModal').classList.remove('hidden');
    }

    closeSettingsModal() {
        document.getElementById('settingsModal').classList.add('hidden');
    }

    openSettings() {
        this.closeSettingsModal();
        document.getElementById('prizeSection').classList.remove('hidden');
    }

    closeSettings() {
        document.getElementById('prizeSection').classList.add('hidden');
    }

    loadPrizes() {
        const stored = localStorage.getItem('prizes');
        if (stored) {
            return JSON.parse(stored);
        }
        // Default prizes
        return ['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5', 'Prize 6'];
    }

    savePrizes() {
        localStorage.setItem('prizes', JSON.stringify(this.prizes));
    }

    drawWheel() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.width);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);

        const sliceAngle = (2 * Math.PI) / this.prizes.length;

        // Draw each slice
        this.prizes.forEach((prize, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = startAngle + sliceAngle;

            // Draw slice
            ctx.beginPath();
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.lineTo(0, 0);
            ctx.fillStyle = this.colors[index % this.colors.length];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw text
            ctx.save();
            const textAngle = startAngle + sliceAngle / 2;
            ctx.rotate(textAngle);
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 3;
            ctx.fillText(prize, radius * 0.65, 5);
            ctx.restore();
        });

        // Draw center circle
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
    }

    spin() {
        if (this.isSpinning || this.prizes.length === 0) return;

        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.spinButton.textContent = 'SPINNING...';
        
        // Add spinning class for glow effect
        this.canvas.classList.add('spinning');

        // Random spin amount (3-5 full rotations plus random position)
        const randomSpin = Math.random() * 2 * Math.PI;
        const extraSpins = (3 + Math.random() * 2) * 2 * Math.PI;
        const totalRotation = this.rotation + extraSpins + randomSpin;

        const duration = 4000; // 4 seconds
        const startTime = Date.now();
        const startRotation = this.rotation;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);

            this.rotation = startRotation + (totalRotation - startRotation) * easeOut;
            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.rotation = totalRotation % (2 * Math.PI);
                // Remove spinning class when done
                this.canvas.classList.remove('spinning');
                this.showWinner();
            }
        };

        animate();
    }

    showWinner() {
        const sliceAngle = (2 * Math.PI) / this.prizes.length;
        
        // Pointer is at TOP (270° in canvas coordinates = -π/2 radians)
        const pointerOffsetRadians = -Math.PI / 2;
        
        // Calculate rotation relative to pointer position
        const rotationRelativeToPointer = this.rotation - pointerOffsetRadians;
        
        // Normalize to 0-2π range (handle negative values)
        const normalizedRotation = ((rotationRelativeToPointer % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        
        // Reverse direction (prizes drawn clockwise from 0°, measure counter-clockwise from pointer)
        const adjustedRotation = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
        
        const winningIndex = Math.floor(adjustedRotation / sliceAngle);
        const winner = this.prizes[winningIndex];

        // ⚠️ CRITICAL AUDIT LOG: Verify selection accuracy
        console.log('🎯 === SPIN RESULT VERIFICATION ===');
        console.log('Total Prizes:', this.prizes.length);
        console.log('Slice Angle:', (sliceAngle * 180 / Math.PI).toFixed(2) + '°');
        console.log('Final Rotation (raw):', (this.rotation * 180 / Math.PI).toFixed(2) + '° (' + this.rotation.toFixed(4) + ' rad)');
        console.log('Pointer Offset:', (pointerOffsetRadians * 180 / Math.PI).toFixed(2) + '°');
        console.log('Rotation Relative to Pointer:', (rotationRelativeToPointer * 180 / Math.PI).toFixed(2) + '°');
        console.log('Normalized Rotation:', (normalizedRotation * 180 / Math.PI).toFixed(2) + '°');
        console.log('Adjusted Rotation:', (adjustedRotation * 180 / Math.PI).toFixed(2) + '°');
        console.log('Winning Index:', winningIndex);
        console.log('Selected Prize:', winner);
        console.log('Prize Array:', this.prizes);
        console.log('=================================');

        // Save prize to entry
        if (this.currentEntryId) {
            this.dataManager.updateEntryPrize(this.currentEntryId, winner);
        }

        // Store audit log for post-event verification
        const selectionLog = {
            timestamp: new Date().toISOString(),
            entryId: this.currentEntryId,
            rotation: this.rotation,
            adjustedRotation: adjustedRotation,
            sliceAngle: sliceAngle,
            winningIndex: winningIndex,
            selectedPrize: winner,
            totalPrizes: this.prizes.length,
            prizeArray: [...this.prizes]
        };
        
        const auditLog = JSON.parse(localStorage.getItem('spinAuditLog') || '[]');
        auditLog.push(selectionLog);
        localStorage.setItem('spinAuditLog', JSON.stringify(auditLog));

        document.getElementById('winnerText').textContent = winner;
        document.getElementById('winnerDisplay').classList.remove('hidden');
    }

    resetWheel() {
        this.isSpinning = false;
        this.spinButton.disabled = false;
        this.spinButton.textContent = 'SPIN!';
        document.getElementById('winnerDisplay').classList.add('hidden');
        
        // Ask if they want to register another person
        const registerAnother = confirm('Would you like to register another person?');
        if (registerAnother) {
            this.resetForNewEntry();
        }
    }

    addPrize() {
        const input = document.getElementById('newPrize');
        const prizeName = input.value.trim();

        if (prizeName && this.prizes.length < 12) {
            this.prizes.push(prizeName);
            this.savePrizes();
            this.renderPrizeList();
            this.drawWheel();
            input.value = '';
        } else if (this.prizes.length >= 12) {
            alert('Maximum 12 prizes allowed!');
        }
    }

    deletePrize(index) {
        if (this.prizes.length > 2) {
            this.prizes.splice(index, 1);
            this.savePrizes();
            this.renderPrizeList();
            this.drawWheel();
        } else {
            alert('Must have at least 2 prizes!');
        }
    }

    renderPrizeList() {
        const listContainer = document.getElementById('prizeList');
        listContainer.innerHTML = '';

        this.prizes.forEach((prize, index) => {
            const item = document.createElement('div');
            item.className = 'prize-item';

            const name = document.createElement('span');
            name.className = 'prize-name';
            name.textContent = prize;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => this.deletePrize(index);

            item.appendChild(name);
            item.appendChild(deleteBtn);
            listContainer.appendChild(item);
        });
    }

    handleRegistration(formData) {
        // Save entry to storage
        this.currentEntryId = this.dataManager.saveEntry(formData);
        
        // Hide registration form
        this.registrationHandler.hide();
        
        // Show custom success modal with user's name
        document.getElementById('successUserName').textContent = formData.fullName;
        const modal = document.getElementById('registrationSuccessModal');
        modal.classList.remove('hidden');
        
        // Auto-close after 3 seconds and show wheel
        const autoCloseTimer = setTimeout(() => {
            modal.classList.add('hidden');
            document.getElementById('wheelContainer').classList.remove('hidden');
        }, 3000);
        
        // Manual close on button click (clears auto-close timer)
        document.getElementById('startSpinningBtn').onclick = () => {
            clearTimeout(autoCloseTimer);
            modal.classList.add('hidden');
            document.getElementById('wheelContainer').classList.remove('hidden');
        };
    }

    resetForNewEntry() {
        // Reset the form
        this.registrationHandler.reset();
        
        // Hide wheel
        document.getElementById('wheelContainer').classList.add('hidden');
        
        // Show registration form
        this.registrationHandler.show();
        
        // Reset current entry
        this.currentEntryId = null;
        
        // Hide winner display
        document.getElementById('winnerDisplay').classList.add('hidden');
    }
}

// ============================================
// DATA MANAGEMENT SYSTEM
// ============================================

class DataManager {
    constructor() {
        this.storageKey = 'raffleEntries';
    }

    // Get all entries from localStorage
    getEntries() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save entry to localStorage
    saveEntry(entryData) {
        const entries = this.getEntries();
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...entryData,
            prize: null // Will be set after spin
        };
        entries.push(entry);
        localStorage.setItem(this.storageKey, JSON.stringify(entries));
        return entry.id;
    }

    // Update prize for an entry
    updateEntryPrize(entryId, prizeName) {
        const entries = this.getEntries();
        const entry = entries.find(e => e.id === entryId);
        if (entry) {
            entry.prize = prizeName;
            localStorage.setItem(this.storageKey, JSON.stringify(entries));
        }
    }

    // Get total entries count
    getTotalEntries() {
        return this.getEntries().length;
    }

    // Get total spins (entries with prizes)
    getTotalSpins() {
        return this.getEntries().filter(e => e.prize !== null).length;
    }

    // Export to CSV
    exportToCSV() {
        const entries = this.getEntries();
        if (entries.length === 0) {
            alert('No entries to export!');
            return;
        }

        // CSV headers
        const headers = ['ID', 'Timestamp', 'Full Name', 'Email', 'Phone', 'Vehicle Year', 'Vehicle Make', 'Vehicle Model', 'Prize Won'];
        
        // CSV rows
        const rows = entries.map(entry => [
            entry.id,
            new Date(entry.timestamp).toLocaleString(),
            entry.fullName,
            entry.email,
            entry.phone,
            entry.vehicleYear,
            entry.vehicleMake,
            entry.vehicleModel,
            entry.prize || 'Not Yet Spun'
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `raffle_entries_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Clear all data
    clearAllData() {
        if (confirm('⚠️ Are you sure you want to delete ALL entries? This cannot be undone!')) {
            if (confirm('⚠️ FINAL WARNING: This will permanently delete all registration data!')) {
                localStorage.removeItem(this.storageKey);
                alert('✅ All data has been cleared.');
                return true;
            }
        }
        return false;
    }
}

// ============================================
// REGISTRATION FORM HANDLER
// ============================================

class RegistrationHandler {
    constructor(onSubmitCallback) {
        this.form = document.getElementById('registrationForm');
        this.vehicleMakeSelect = document.getElementById('vehicleMake');
        this.otherMakeGroup = document.getElementById('otherMakeGroup');
        this.onSubmitCallback = onSubmitCallback;
        this.currentEntryId = null;
        
        this.init();
    }

    init() {
        // Show/hide "Other" make input
        this.vehicleMakeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Other') {
                this.otherMakeGroup.style.display = 'block';
                document.getElementById('vehicleMakeOther').required = true;
            } else {
                this.otherMakeGroup.style.display = 'none';
                document.getElementById('vehicleMakeOther').required = false;
            }
        });

        // Handle form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            vehicleYear: document.getElementById('vehicleYear').value,
            vehicleMake: document.getElementById('vehicleMake').value === 'Other' 
                ? document.getElementById('vehicleMakeOther').value.trim()
                : document.getElementById('vehicleMake').value,
            vehicleModel: document.getElementById('vehicleModel').value.trim()
        };

        // Validate all fields
        if (!formData.fullName || !formData.email || !formData.phone || 
            !formData.vehicleYear || !formData.vehicleMake || !formData.vehicleModel) {
            alert('Please fill in all required fields!');
            return;
        }

        // Call the callback with form data
        this.onSubmitCallback(formData);
    }

    reset() {
        this.form.reset();
        this.otherMakeGroup.style.display = 'none';
        document.getElementById('vehicleMakeOther').required = false;
    }

    show() {
        document.getElementById('registrationSection').classList.remove('hidden');
    }

    hide() {
        document.getElementById('registrationSection').classList.add('hidden');
    }
}

// ============================================
// ADMIN PANEL CONTROLLER
// ============================================

class AdminPanel {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.init();
    }

    init() {
        // Admin button in settings
        document.getElementById('adminBtn').addEventListener('click', () => {
            this.show();
            document.getElementById('settingsModal').classList.add('hidden');
        });

        // Close admin
        document.getElementById('closeAdmin').addEventListener('click', () => {
            this.hide();
        });

        // Export CSV
        document.getElementById('exportCSV').addEventListener('click', () => {
            this.dataManager.exportToCSV();
        });

        // View entries
        document.getElementById('viewEntries').addEventListener('click', () => {
            this.toggleEntriesTable();
        });

        // Clear data
        document.getElementById('clearData').addEventListener('click', () => {
            if (this.dataManager.clearAllData()) {
                this.updateStats();
                this.hide();
            }
        });
    }

    show() {
        document.getElementById('adminSection').classList.remove('hidden');
        this.updateStats();
    }

    hide() {
        document.getElementById('adminSection').classList.add('hidden');
        document.getElementById('entriesTable').classList.add('hidden');
    }

    updateStats() {
        document.getElementById('totalEntries').textContent = this.dataManager.getTotalEntries();
        document.getElementById('totalSpins').textContent = this.dataManager.getTotalSpins();
    }

    toggleEntriesTable() {
        const table = document.getElementById('entriesTable');
        const isHidden = table.classList.contains('hidden');
        
        if (isHidden) {
            this.renderEntriesTable();
            table.classList.remove('hidden');
        } else {
            table.classList.add('hidden');
        }
    }

    renderEntriesTable() {
        const entries = this.dataManager.getEntries();
        const tbody = document.getElementById('entriesTableBody');
        
        tbody.innerHTML = '';

        if (entries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No entries yet</td></tr>';
            return;
        }

        entries.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td>${entry.fullName}</td>
                <td>${entry.email}</td>
                <td>${entry.phone}</td>
                <td>${entry.vehicleYear} ${entry.vehicleMake} ${entry.vehicleModel}</td>
                <td>${entry.prize || '—'}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PrizeWheel();
});