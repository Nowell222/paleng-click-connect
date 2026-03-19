import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Get authorization token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('Missing authorization header')
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Parse JWT to get user ID (without verifying signature)
    let userId: string | null = null
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const decoded = JSON.parse(atob(parts[1]))
        userId = decoded.sub
      }
    } catch (e) {
      console.error('Failed to decode token:', e)
    }

    if (!userId) {
      console.error('Could not extract user ID from token')
      return new Response(JSON.stringify({ error: 'Invalid token format' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check admin role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single()

    if (roleError || !roleData) {
      console.error('User is not admin:', roleError)
      return new Response(JSON.stringify({ error: 'Unauthorized: admin role required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()
    const { email, password, first_name, middle_name, last_name, contact_number, address, role, stall_number, section, location: stallLocation } = body

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields: email, password, first_name, last_name, role' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create auth user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name, last_name, role }
    })

    if (createError) {
      console.error('Create user error:', createError)
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const newUserId = newUser.user.id

    // Update profile with extra fields
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ middle_name: middle_name || '', contact_number: contact_number || '', address: address || '' })
      .eq('user_id', newUserId)

    if (profileError) {
      console.error('Profile update error:', profileError)
    }

    // Create user role entry (in case trigger didn't work)
    const { error: roleCreateError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: newUserId, role })
      .select()
      .single()

    if (roleCreateError && !roleCreateError.message.includes('duplicate')) {
      console.error('Role create error:', roleCreateError)
    }

    // If vendor, create stall and vendor record
    if (role === 'vendor' && stall_number) {
      let stallId: string | null = null
      
      // Check if stall exists
      const { data: existingStall, error: stallCheckError } = await supabaseAdmin
        .from('stalls')
        .select('id')
        .eq('stall_number', stall_number)
        .single()

      if (existingStall) {
        stallId = existingStall.id
        // Update stall status
        await supabaseAdmin
          .from('stalls')
          .update({ status: 'occupied', section: section || 'General', location: stallLocation || '' })
          .eq('id', stallId)
      } else {
        // Create new stall
        const { data: newStall, error: stallCreateError } = await supabaseAdmin
          .from('stalls')
          .insert({ stall_number, section: section || 'General', location: stallLocation || '', status: 'occupied' })
          .select('id')
          .single()
        
        if (stallCreateError) {
          console.error('Stall create error:', stallCreateError)
        } else {
          stallId = newStall?.id ?? null
        }
      }

      // Create vendor record
      if (stallId) {
        const { error: vendorError } = await supabaseAdmin
          .from('vendors')
          .insert({ user_id: newUserId, stall_id: stallId, award_date: new Date().toISOString().split('T')[0] })

        if (vendorError) {
          console.error('Vendor create error:', vendorError)
        }
      }
    }

    console.log(`Successfully created ${role} account for ${email}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: newUserId,
        email: email,
        role: role,
        message: 'Account created successfully'
      }), 
      {
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }), 
      {
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
