# CompoundHQ — MVP 1.0

CompoundHQ is a Nigerian rental marketplace prototype. It demonstrates property discovery, transparent rental cost breakdowns, tenant/landlord workflows, enquiries, favourites, a landlord listing form, an admin review screen and a simulated payment checkout.

**Important:** All sample properties and accounts are illustrative. A demo verification badge is not evidence of real-world verification. Demo checkout does not charge money.

## Requirements
- Node.js 20 or newer
- npm
- VS Code (recommended)

## Run locally
1. Extract the ZIP.
2. Open the `compoundhq` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Demo controls
- Use the role selector in the top navigation to switch Tenant, Landlord and Admin views.
- Explore properties and open a property detail page.
- Save favourites, send enquiries and try the demo checkout.
- Switch to Landlord and add a property.
- Switch to Admin and review the sample listings.
- Demo data is saved in the browser's localStorage. It is not a shared production database.

## Build
```bash
npm run build
npm run preview
```

## Free hosting
### Vercel
1. Push this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add environment variables if you configure live services.
7. Deploy.

The included `api/` functions are intended for Vercel serverless deployment. Add `@vercel/node` as a dev dependency if your deployment build requires its TypeScript types:
```bash
npm install -D @vercel/node
```

### Netlify
The static frontend can be hosted on Netlify with build command `npm run build` and publish directory `dist`. The included `/api` endpoints are Vercel-style functions; for Netlify live payment processing, port them to Netlify Functions or use a separate secure backend. Do not publish secret keys in frontend code.

## Payment integration
The UI currently runs in demonstration mode. It does not send money to Paystack or Flutterwave.

Secure server endpoints are included:
- `POST /api/paystack-initialize`
- `GET /api/paystack-verify?reference=...`
- `POST /api/flutterwave-initialize`
- `GET /api/flutterwave-verify?transaction_id=...`

Set server-side environment variables in your hosting provider:
- `PAYSTACK_SECRET_KEY`
- `FLUTTERWAVE_SECRET_KEY`
- `APP_BASE_URL`

Never use secret keys in `VITE_` variables. Never trust a frontend redirect as proof of payment. Verify transactions server-side and implement signed webhook handling, idempotency, order ownership checks, amount/currency matching, persistent transaction records and audit logs before accepting live rental payments.

The current checkout modal intentionally disables live checkout because credentials, customer identity, server-side order creation, database persistence and webhook processing have not yet been configured.

## Supabase
`supabase/schema.sql` provides a starter schema and basic RLS policies. The current demo UI uses localStorage, not Supabase. Before connecting Supabase:
- Add authentication and profile creation.
- Replace local demo state with database queries.
- Review every RLS policy.
- Add secure admin authorization using trusted claims/roles.
- Keep payment status updates server-only.
- Add private storage buckets for identity/ownership documents.
- Do not expose verification documents through public URLs.

## Before a public pilot
- Replace sample properties with listings whose owners have authorised publication.
- Implement real identity and property-authority verification.
- Add terms, privacy notice, complaint handling and support contact.
- Clarify whether CompoundHQ collects rent, facilitates payment, or only initiates payment to a landlord.
- Confirm provider approval, fees, settlement, refunds, chargebacks and applicable Nigerian regulatory requirements.
- Conduct security and privacy review.
