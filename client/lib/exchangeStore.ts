// Simple state store for exchange data to avoid exposing sensitive amounts in URLs
export interface ExchangeData {
  fromAmount: string;
  toAmount: string;
  email?: string;
  walletAddress?: string;
  exchangeRate: number;
  effectiveRate?: number;
  promoCode?: string;
  finalRate?: number;
  finalAmount?: string;
}

class ExchangeStore {
  private data: ExchangeData | null = null;

  setExchangeData(data: ExchangeData) {
    this.data = data;
    // Store in sessionStorage for persistence across page refreshes
    sessionStorage.setItem("exchange_data", JSON.stringify(data));
  }

  getExchangeData(): ExchangeData | null {
    if (this.data) return this.data;

    // Try to restore from sessionStorage
    const stored = sessionStorage.getItem("exchange_data");
    if (stored) {
      this.data = JSON.parse(stored);
      return this.data;
    }

    return null;
  }

  clearExchangeData() {
    this.data = null;
    sessionStorage.removeItem("exchange_data");
  }

  updateExchangeData(updates: Partial<ExchangeData>) {
    if (this.data) {
      this.data = { ...this.data, ...updates };
      sessionStorage.setItem("exchange_data", JSON.stringify(this.data));
    }
  }
}

export const exchangeStore = new ExchangeStore();
