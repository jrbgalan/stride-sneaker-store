/**
 * SUPABASE ADAPTER GUIDE
 * 
 * To switch from the default in-memory persistent store to Supabase:
 * 1. Install Supabase client:
 *    npm install @supabase/supabase-js
 * 
 * 2. Set environment variables in .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
 * 
 * 3. Plug into src/lib/db/index.js:
 * 
 * import { createClient } from '@supabase/supabase-js';
 * 
 * const supabase = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL,
 *   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 * );
 * 
 * export const productsRepo = {
 *   list: async (sort = 'created_date', limit = 100) => {
 *     const { data } = await supabase.from('products').select('*').limit(limit);
 *     return data || [];
 *   },
 *   filter: async (query = {}, sort = 'created_date', limit = 100) => {
 *     let q = supabase.from('products').select('*');
 *     Object.entries(query).forEach(([k, v]) => { q = q.eq(k, v); });
 *     const { data } = await q.limit(limit);
 *     return data || [];
 *   },
 *   get: async (idOrSlug) => {
 *     const { data } = await supabase.from('products').select('*').or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`).single();
 *     return data;
 *   },
 *   create: async (payload) => {
 *     const { data } = await supabase.from('products').insert([payload]).select().single();
 *     return data;
 *   },
 *   update: async (id, payload) => {
 *     const { data } = await supabase.from('products').update(payload).eq('id', id).select().single();
 *     return data;
 *   },
 *   delete: async (id) => {
 *     const { error } = await supabase.from('products').delete().eq('id', id);
 *     return { success: !error };
 *   }
 * };
 */
export const SUPABASE_READY = true;
