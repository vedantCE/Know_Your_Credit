import { api } from './api';

class RealTimeSync {
  constructor() {
    this.subscribers = new Map();
    this.intervals = new Map();
  }

  // Subscribe to real-time updates for a specific data type
  subscribe(dataType, callback, intervalMs = 30000) {
    if (!this.subscribers.has(dataType)) {
      this.subscribers.set(dataType, new Set());
    }
    
    this.subscribers.get(dataType).add(callback);
    
    // Start polling if this is the first subscriber for this data type
    if (this.subscribers.get(dataType).size === 1) {
      this.startPolling(dataType, intervalMs);
    }
    
    // Return unsubscribe function
    return () => this.unsubscribe(dataType, callback);
  }

  // Unsubscribe from updates
  unsubscribe(dataType, callback) {
    if (this.subscribers.has(dataType)) {
      this.subscribers.get(dataType).delete(callback);
      
      // Stop polling if no more subscribers
      if (this.subscribers.get(dataType).size === 0) {
        this.stopPolling(dataType);
      }
    }
  }

  // Start polling for a specific data type
  startPolling(dataType, intervalMs) {
    let lastDataHash = null;
    
    const pollFunction = async () => {
      try {
        let data;
        
        switch (dataType) {
          case 'users':
            data = await api.getAllUsers();
            break;
          case 'signupLogs':
            data = await api.getSignupLogs();
            break;
          default:
            return;
        }
        
        if (data.status === 'Success') {
          // Create hash of data to detect changes
          const currentDataHash = JSON.stringify(data);
          
          // Only notify if data has changed
          if (lastDataHash !== currentDataHash) {
            lastDataHash = currentDataHash;
            
            const callbacks = this.subscribers.get(dataType);
            if (callbacks) {
              callbacks.forEach(callback => {
                try {
                  callback(data);
                } catch (error) {
                  console.error('Error in subscriber callback:', error);
                }
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error polling ${dataType}:`, error);
      }
    };

    // Initial fetch
    pollFunction();
    
    // Set up interval
    const intervalId = setInterval(pollFunction, intervalMs);
    this.intervals.set(dataType, intervalId);
  }

  // Stop polling for a specific data type
  stopPolling(dataType) {
    const intervalId = this.intervals.get(dataType);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(dataType);
    }
  }

  // Manually trigger a refresh for all data types
  async refreshAll() {
    const dataTypes = Array.from(this.subscribers.keys());
    
    for (const dataType of dataTypes) {
      try {
        let data;
        
        switch (dataType) {
          case 'users':
            data = await api.getAllUsers();
            break;
          case 'signupLogs':
            data = await api.getSignupLogs();
            break;
          default:
            continue;
        }
        
        if (data.status === 'Success') {
          const callbacks = this.subscribers.get(dataType);
          if (callbacks) {
            callbacks.forEach(callback => {
              try {
                callback(data);
              } catch (error) {
                console.error('Error in subscriber callback:', error);
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error refreshing ${dataType}:`, error);
      }
    }
  }

  // Clean up all subscriptions and intervals
  cleanup() {
    // Clear all intervals
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    
    // Clear all data structures
    this.subscribers.clear();
    this.intervals.clear();
  }
}

// Create a singleton instance
export const realTimeSync = new RealTimeSync();

// Hook for React components to use real-time sync
export const useRealTimeSync = (dataType, callback, intervalMs = 30000) => {
  // Note: This hook should be used in components that import React
  // The actual implementation should be in the component file
  console.warn('useRealTimeSync: This hook should be implemented in the component file');
};

export default realTimeSync;
