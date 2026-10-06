# Fieldnote Commodity Desk

A React and TypeScript demo for commodity RFQ procurement with Trader and Broker workspaces.

## Run locally

```sh
npm install
npm start
```

The development server opens at `http://localhost:3000`. Run `npm test -- --watchAll=false` for workflow tests and `npm run build` for a production build.

## Workspaces

- Trader view scopes the feed to North Harbor Trading and supports RFQ creation and quote decisions.
- Broker view covers assigned trader accounts, supports account filtering, and allows creating or submitting requests on a trader's behalf.
- RFQ detail views show terms, a validity countdown, offers, and accept/counter/decline actions.
- The dashboard combines RFQ activity trends with a live status distribution chart.
- Create RFQ validates the delivery date range, future quote expiry, positive prices and quantities, and selected counterparties.

The role switcher is a demo control, not authentication. Data is held in browser memory and resets on reload. Production use requires authenticated users, server-side role enforcement, persistent storage, and authoritative quote/transaction handling.

## Source layout

```text
src/
  components/
    charts/       ProcurementChart, RfqStatusChart
    forms/        RFQForm, QuoteResponseForm
    rfq/          RFQCard, QuotesTable, RFQStatusChip, RFQSummaryMetrics, ValidityCountdown
    ProfileDialog Profile and account details
  data/           Mock RFQs, accounts, counterparties, chart series
  hooks/          Shared RFQ state and lifecycle actions
  layouts/        Role-aware application shell
  pages/          Trader, Broker, shared dashboard, RFQ detail
  routes/         Trader and Broker route tree
  types/          RFQ, quote, status, role, and form types
```

## Stack

React, TypeScript, Material UI, Lucide, React Router, Recharts, React Hook Form, and Zod. IBM Plex Sans provides a consistent, high-legibility interface typeface.