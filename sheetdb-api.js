/**
 * SheetDB API Integration Module
 * Handles all Google Sheets operations via SheetDB API
 * Author: Prize Wheel Project
 * Last Updated: October 31, 2025
 */

class SheetDBAPI {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * Generic fetch with retry logic
     */
    async fetchWithRetry(url, options, retries = this.maxRetries) {
        try {
            const response = await fetch(url, options);
            
            // If rate limited (429) or server error (5xx), retry
            if ((response.status === 429 || response.status >= 500) && retries > 0) {
                console.warn(`Request failed with status ${response.status}, retrying... (${retries} attempts left)`);
                await this.delay(this.retryDelay);
                return this.fetchWithRetry(url, options, retries - 1);
            }
            
            return response;
        } catch (error) {
            if (retries > 0) {
                console.warn(`Network error, retrying... (${retries} attempts left)`, error);
                await this.delay(this.retryDelay);
                return this.fetchWithRetry(url, options, retries - 1);
            }
            throw error;
        }
    }

    /**
     * Delay helper for retries
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get all entries from the sheet
     */
    async getAllEntries() {
        try {
            const response = await this.fetchWithRetry(this.apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            
            const data = await response.json();
            console.log('✅ SheetDB: Retrieved', data.length, 'entries');
            return data;
        } catch (error) {
            console.error('❌ SheetDB: Failed to get entries', error);
            throw error;
        }
    }

    /**
     * Add a new entry to the sheet
     */
    async addEntry(entryData) {
        try {
            const response = await this.fetchWithRetry(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: entryData })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            
            const result = await response.json();
            console.log('✅ SheetDB: Entry added successfully', entryData.id);
            return result;
        } catch (error) {
            console.error('❌ SheetDB: Failed to add entry', error);
            throw error;
        }
    }

    /**
     * Update an entry's prize field
     */
    async updatePrize(entryId, prizeName) {
        try {
            const response = await this.fetchWithRetry(`${this.apiUrl}/id/${entryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: { prize: prizeName } })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            
            const result = await response.json();
            console.log('✅ SheetDB: Prize updated for entry', entryId, '→', prizeName);
            return result;
        } catch (error) {
            console.error('❌ SheetDB: Failed to update prize', error);
            throw error;
        }
    }

    /**
     * Get prizes configuration (from a separate "prizes" sheet or hardcoded)
     * For now, we'll fetch from LocalStorage as fallback
     */
    async getPrizes() {
        // Option 1: Return default prizes (recommended for simplicity)
        // Option 2: Create a second sheet tab for prizes
        // For this implementation, we'll use LocalStorage for prizes
        // since SheetDB free tier works best with a single sheet
        
        try {
            const stored = localStorage.getItem('prizes');
            if (stored) {
                const prizes = JSON.parse(stored);
                console.log('✅ Prizes loaded from LocalStorage', prizes.length);
                return prizes;
            }
            
            // Default prizes if nothing in storage
            const defaultPrizes = [
                'Grand Prize',
                'First Prize',
                'Second Prize',
                'Third Prize',
                'Consolation Prize',
                'Better Luck Next Time'
            ];
            console.log('⚠️ Using default prizes');
            return defaultPrizes;
        } catch (error) {
            console.error('❌ Failed to get prizes', error);
            return [];
        }
    }

    /**
     * Sync LocalStorage entries to SheetDB (one-time migration)
     */
    async syncLocalToSheet() {
        try {
            const localEntries = localStorage.getItem('raffleEntries');
            if (!localEntries) {
                console.log('ℹ️ No local entries to sync');
                return { synced: 0 };
            }
            
            const entries = JSON.parse(localEntries);
            console.log(`🔄 Syncing ${entries.length} local entries to SheetDB...`);
            
            let syncedCount = 0;
            for (const entry of entries) {
                try {
                    await this.addEntry(entry);
                    syncedCount++;
                } catch (error) {
                    console.error('Failed to sync entry', entry.id, error);
                }
            }
            
            console.log(`✅ Synced ${syncedCount}/${entries.length} entries to SheetDB`);
            return { synced: syncedCount, total: entries.length };
        } catch (error) {
            console.error('❌ Failed to sync local entries', error);
            throw error;
        }
    }

    /**
     * Check if SheetDB API is accessible
     */
    async healthCheck() {
        try {
            const response = await fetch(this.apiUrl);
            return response.ok;
        } catch (error) {
            console.error('❌ SheetDB health check failed', error);
            return false;
        }
    }
}

// Export for use in app.js
// Initialize with your SheetDB API URL
const sheetDB = new SheetDBAPI('https://sheetdb.io/api/v1/sln0yc5o1pyi3');

console.log('✅ SheetDB API module loaded');
