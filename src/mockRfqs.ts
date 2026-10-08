import { Rfq } from './types';

export const traderAccounts = [
  'North Harbor Trading',
  'Meridian Agri Group',
  'Atlas Energy Partners',
  'Cedar Commodities',
];

export const counterparties = [
  'Pacific Commodities',
  'AgriGlobal BV',
  'Minh Long Trading',
  'Cargill International',
  'Louis Dreyfus Company',
  'Vitol Group',
  'Bunge Limited',
  'Trafigura',
];

export const mockRfqs: Rfq[] = [
  {
    id: 'RFQ-1048', commodity: 'Wheat', traderAccount: 'North Harbor Trading', status: 'Quoted',
    startDate: '2026-10-18', endDate: '2026-10-28', validUntil: '2026-10-08T16:00',
    price: 286, unit: 'Metric Ton', quantity: 12000,
    description: 'Milling wheat, min. 12.5% protein. CIF Rotterdam, discharge in 48 hours.',
    counterparties: ['AgriGlobal BV', 'Cargill International', 'Louis Dreyfus Company'], createdAt: '2026-10-06',
    quotes: [
      { id: 'Q-501', counterparty: 'AgriGlobal BV', price: 281, currency: 'USD', submittedAt: '2026-10-06T08:42', expiresAt: '2026-10-08T16:00', status: 'Submitted', notes: 'CIF Rotterdam. Freight included.' },
      { id: 'Q-502', counterparty: 'Cargill International', price: 284, currency: 'USD', submittedAt: '2026-10-06T09:15', expiresAt: '2026-10-08T16:00', status: 'Submitted', notes: 'Subject to final vessel nomination.' },
      { id: 'Q-503', counterparty: 'Louis Dreyfus Company', price: 279, currency: 'USD', submittedAt: '2026-10-06T09:33', expiresAt: '2026-10-08T16:00', status: 'Submitted', notes: 'Offer valid for 24 hours.' },
    ],
  },
  {
    id: 'RFQ-1047', commodity: 'Crude Oil', traderAccount: 'Atlas Energy Partners', status: 'Pending Broker Approval',
    startDate: '2026-11-01', endDate: '2026-11-15', validUntil: '2026-10-09T12:00',
    price: 78.5, unit: 'Liter', quantity: 850000,
    description: 'Light sweet crude, max 0.5% sulfur. FOB loading terminal.',
    counterparties: ['Vitol Group', 'Trafigura'], createdAt: '2026-10-05',
    quotes: [{ id: 'Q-498', counterparty: 'Vitol Group', price: 77.9, currency: 'USD', submittedAt: '2026-10-06T07:20', expiresAt: '2026-10-09T12:00', status: 'Submitted', notes: 'FOB. Laycan to be confirmed.' }],
  },
  {
    id: 'RFQ-1046', commodity: 'Gold', traderAccount: 'Meridian Agri Group', status: 'Open',
    startDate: '2026-10-22', endDate: '2026-10-30', validUntil: '2026-10-11T17:00',
    price: 76600, unit: 'Metric Ton', quantity: 250,
    description: '99.99% purity, LBMA good delivery bars. Insured delivery to Zurich.',
    counterparties: ['Trafigura', 'Vitol Group', 'Cargill International'], createdAt: '2026-10-04', quotes: [],
  },
  {
    id: 'RFQ-1045', commodity: 'LNG', traderAccount: 'Atlas Energy Partners', status: 'Executed',
    startDate: '2026-09-22', endDate: '2026-09-30', validUntil: '2026-09-15T17:00',
    price: 12.8, unit: 'Metric Ton', quantity: 65000,
    description: 'DES delivery, 3.5 TBtu cargo. Destination flexibility required.',
    counterparties: ['Vitol Group', 'Trafigura'], createdAt: '2026-09-01',
    quotes: [{ id: 'Q-481', counterparty: 'Vitol Group', price: 12.55, currency: 'USD', submittedAt: '2026-09-10T11:10', expiresAt: '2026-09-15T17:00', status: 'Accepted', notes: 'DES. Cargo confirmed.' }],
  },
  {
    id: 'RFQ-1044', commodity: 'Palm Oil', traderAccount: 'Cedar Commodities', status: 'Draft',
    startDate: '2026-11-12', endDate: '2026-11-20', validUntil: '2026-10-15T12:00',
    price: 1030, unit: 'Metric Ton', quantity: 1800,
    description: 'RSPO-certified, sustainable supply chain documentation required.',
    counterparties: ['Bunge Limited', 'Cargill International'], createdAt: '2026-10-03', quotes: [],
  },
  {
    id: 'RFQ-1043', commodity: 'Wheat', traderAccount: 'North Harbor Trading', status: 'Expired',
    startDate: '2026-09-12', endDate: '2026-09-20', validUntil: '2026-09-08T17:00',
    price: 292, unit: 'Metric Ton', quantity: 5000,
    description: 'Feed wheat, grade 2. CIF New Orleans.',
    counterparties: ['AgriGlobal BV', 'Louis Dreyfus Company'], createdAt: '2026-09-01', quotes: [],
  },
];

export const chartData = [
  { month: 'May', volume: 18, awarded: 12 },
  { month: 'Jun', volume: 26, awarded: 17 },
  { month: 'Jul', volume: 22, awarded: 15 },
  { month: 'Aug', volume: 34, awarded: 23 },
  { month: 'Sep', volume: 29, awarded: 20 },
  { month: 'Oct', volume: 42, awarded: 28 },
];