import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxfhudsquydmciszkdnz.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4Zmh1ZHNxdXlkbWNpc3prZG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTU2ODcsImV4cCI6MjA5MzkzMTY4N30.ntsle4lIH3IE1ruQf-IlOpdR_BM6T0ngD9iED0zaySY';

export const supabase = createClient(supabaseUrl, supabaseKey);
