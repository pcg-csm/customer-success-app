import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserCreation() {
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'test_create' + Date.now() + '@example.com',
        password: 'Password123!',
        options: {
            data: {
                first_name: 'Test',
                last_name: 'User',
            }
        }
    });

    if (authError) {
        console.log("AUTH_ERROR_JSON:", JSON.stringify(authError));
    } else {
        console.log("SUCCESS:", authData.user.id);
    }
}

testUserCreation();
