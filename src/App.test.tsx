import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { rfqSchema } from './components/forms/RFQForm';
import { responseSchema } from './components/forms/QuoteResponseForm';
import App from './App';

jest.mock('./components/charts/ProcurementChart', () => ({ __esModule: true, default: () => null }));
jest.mock('./components/charts/RfqStatusChart', () => ({ __esModule: true, default: () => 'RFQs by status Pending Broker Approval' }));

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<App />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function clickButton(label: RegExp) {
  const button = Array.from(document.body.querySelectorAll('button')).find((item) => label.test(item.textContent || ''));
  if (!button) throw new Error(`Button not found: ${label}`);
  act(() => button.click());
}

test('opens the trader dashboard and switches to broker view', () => {
  expect(container.textContent).toContain('Good morning, Alex');
  expect(container.textContent).toContain('RFQs by status');
  expect(container.textContent).toContain('Pending Broker Approval');
  clickButton(/Broker view/i);
  expect(container.textContent).toContain('Good morning, Jordan');
  expect(container.textContent).toContain('All trader accounts');
});

test('rejects an end date before the start date and non-positive volume', () => {
  const result = rfqSchema.safeParse({
    traderAccount: 'North Harbor Trading',
    commodity: 'Wheat',
    startDate: '2026-10-20',
    endDate: '2026-10-19',
    validUntil: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    price: '100',
    quantity: '0',
    description: 'Milling wheat for Rotterdam.',
    counterparties: ['Pacific Commodities'],
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    const issuePaths = result.error.issues.map((issue) => issue.path[0]);
    expect(issuePaths).toContain('endDate');
    expect(issuePaths).toContain('quantity');
  }
});

test('validates negotiable quote responses with price and description', () => {
  const result = responseSchema.safeParse({
    price: '285.5',
    negotiable: true,
    description: 'Can confirm prompt loading at Rotterdam.',
  });
  expect(result.success).toBe(true);
  expect(responseSchema.safeParse({ price: '0', negotiable: false, description: 'Short' }).success).toBe(false);
});

test('accepting a counterparty quote executes the RFQ', () => {
  act(() => {
    window.history.pushState({}, '', '/trader/rfq/RFQ-1048');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(container.textContent).toContain('Submitted offers');
  clickButton(/^Accept$/i);
  expect(container.textContent).toContain('Executed');
});
