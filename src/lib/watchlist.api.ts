// watchlistService.js
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_WATCHLIST_API; // Replace with your API endpoint base URL


export interface WatchlistEntry {
  walletAddress: string;
  label: string;
  createdAt: string;
}


export default class WatchlistService {
  static async addToWatchlist(accountAddress, walletAddress, label) {
    try {
      const response = await axios.post(`${API_BASE_URL}/watchlist`, {
        accountAddress,
        walletAddress,
        label,
      });

      
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  static async getWatchlist(accountAddress) {
    try {
      const response = await axios.get(`${API_BASE_URL}/watchlist/${accountAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error getting watchlist:', error);
      throw error;
    }
  }

  static async deleteFromWatchlist(accountAddress, walletAddress) {
    try {
      await axios.delete(`${API_BASE_URL}/watchlist/${accountAddress}/${walletAddress}`);
    } catch (error) {
      console.error('Error deleting from watchlist:', error);
      throw error;
    }
  }

  static async updateWatchlistEntry(accountAddress, walletAddress, label) {
    try {
      await axios.put(`${API_BASE_URL}/watchlist/${accountAddress}/${walletAddress}`, {
        label,
      });
    } catch (error) {
      console.error('Error updating watchlist entry:', error);
      throw error;
    }
  }
}

