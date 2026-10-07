// Supabase project used for accounts (Google sign-in) and history sync.
// Both values are public by design: the anon key only allows what the row-level security
// rules of the database permit. If both are empty, accounts are hidden and the app works offline only.
// Environment variables can point a local build at another project.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://prfadpnawhrphxigiyag.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3LEt_6gdMHC9gufGs2b-Zw_Glo4nfTO';

// Umami Cloud website id for audience measurement (cookieless, no personal data). Public by
// design, like any analytics snippet. Empty: nothing is loaded and nothing is measured.
export const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID || '';
