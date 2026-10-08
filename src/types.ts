export type UserRole = 'trader' | 'broker';

export type RfqStatus =
  | 'Open'
  | 'Pending Broker Approval'
  | 'Quoted'
  | 'Executed'
  | 'Expired'
  | 'Draft';

export type QuoteStatus = 'Submitted' | 'Accepted' | 'Declined' | 'Countered';

export type Quote = {
  id: string;
  counterparty: string;
  price: number;
  currency: 'USD';
  submittedAt: string;
  expiresAt: string;
  status: QuoteStatus;
  notes: string;
};

export type Rfq = {
  id: string;
  commodity: string;
  traderAccount: string;
  status: RfqStatus;
  startDate: string;
  endDate: string;
  validUntil: string;
  price: number;
  unit: 'Metric Ton' | 'Liter';
  quantity: number;
  description: string;
  counterparties: string[];
  quotes: Quote[];
  createdAt: string;
};

export type RfqFormValues = {
  traderAccount: string;
  commodity: string;
  startDate: string;
  endDate: string;
  validUntil: string;
  price: string;
  quantity: string;
  description: string;
  counterparties: string[];
};