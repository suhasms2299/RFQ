import React, { createContext, useContext, useMemo, useState } from 'react';
import { mockRfqs } from './mockRfqs';
import { Quote, Rfq, RfqFormValues, UserRole } from './types';

type QuoteAction = 'accept' | 'decline' | 'counter';

type RfqContextValue = {
  rfqs: Rfq[];
  createRfq: (values: RfqFormValues, role: UserRole) => Rfq;
  updateQuote: (rfqId: string, quoteId: string, action: QuoteAction, counterPrice?: number) => void;
  submitDraft: (rfqId: string) => void;
};

const RfqContext = createContext<RfqContextValue | null>(null);

export function RfqProvider({ children }: { children: React.ReactNode }) {
  const [rfqs, setRfqs] = useState(mockRfqs);

  const value = useMemo<RfqContextValue>(() => ({
    rfqs,
    createRfq: (values, role) => {
      const commodity = values.commodity;
      const unit = commodity === 'Crude Oil' || commodity === 'Palm Oil' ? 'Liter' : 'Metric Ton';
      const account = role === 'broker' ? values.traderAccount : 'North Harbor Trading';
      const rfq: Rfq = {
        id: `RFQ-${Date.now().toString().slice(-6)}`,
        commodity,
        traderAccount: account,
        status: 'Open',
        startDate: values.startDate,
        endDate: values.endDate,
        validUntil: values.validUntil,
        price: Number(values.price),
        unit,
        quantity: Number(values.quantity),
        description: values.description,
        counterparties: values.counterparties,
        quotes: [],
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setRfqs((current) => [rfq, ...current]);
      return rfq;
    },
    updateQuote: (rfqId, quoteId, action, counterPrice) => {
      setRfqs((current) => current.map((rfq) => {
        if (rfq.id !== rfqId) return rfq;
        const quotes: Quote[] = rfq.quotes.map((quote) => {
          if (quote.id !== quoteId) return action === 'accept' && quote.status === 'Submitted' ? { ...quote, status: 'Declined' } : quote;
          if (action === 'accept') return { ...quote, status: 'Accepted' };
          if (action === 'decline') return { ...quote, status: 'Declined' };
          return { ...quote, status: 'Countered', price: counterPrice ?? quote.price };
        });
        return { ...rfq, quotes, status: action === 'accept' ? 'Executed' : rfq.status };
      }));
    },
    submitDraft: (rfqId) => {
      setRfqs((current) => current.map((rfq) => rfq.id === rfqId ? { ...rfq, status: 'Open' } : rfq));
    },
  }), [rfqs]);

  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}

export function useRfqs() {
  const context = useContext(RfqContext);
  if (!context) throw new Error('useRfqs must be used inside RfqProvider');
  return context;
}

export type { QuoteAction };