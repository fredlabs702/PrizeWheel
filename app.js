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
        const prizeSection = document.getElementById('prizeSection');
        
        // Toggle visibility
        if (prizeSection.classList.contains('hidden')) {
            prizeSection.classList.remove('hidden');
            // Change button text to indicate it's open
            document.getElementById('settingsBtn').textContent = '✕ Close Settings';
        } else {
            prizeSection.classList.add('hidden');
            document.getElementById('settingsBtn').textContent = '⚙️ Settings';
        }
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

        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                this.showWinner();
            }
        };

        animate();
    }

    showWinner() {
        const sliceAngle = (2 * Math.PI) / this.prizes.length;
        // Adjust rotation to account for pointer at top
        const adjustedRotation = (2 * Math.PI - this.rotation) % (2 * Math.PI);
        const winningIndex = Math.floor(adjustedRotation / sliceAngle);
        const winner = this.prizes[winningIndex];

        document.getElementById('winnerText').textContent = winner;
        document.getElementById('winnerDisplay').classList.remove('hidden');
    }

    resetWheel() {
        this.isSpinning = false;
        this.spinButton.disabled = false;
        this.spinButton.textContent = 'SPIN!';
        document.getElementById('winnerDisplay').classList.add('hidden');
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
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PrizeWheel();
});
