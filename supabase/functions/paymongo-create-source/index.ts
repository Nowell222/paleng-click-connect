import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CHANNEL_MAP: Record<string, string> = {
  gcash: "gcash",
  paymaya: "paymaya",
  instapay: "dob",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { amount, channel, vendor_id, stall_id, payment_type, period_month, period_year } = await req.json();

    if (!amount || amount <= 0) throw new Error("Invalid amount");
    const pmType = CHANNEL_MAP[channel];
    if (!pmType) throw new Error("Unsupported channel: " + channel);

    const SECRET = Deno.env.get("PAYMONGO_SECRET_KEY")!;
    const BASE_URL = Deno.env.get("BASE_URL") || "https://your-app.vercel.app";
    const auth = btoa(SECRET + ":");

    // Call PayMongo to create a source (generates QR)
    const pmRes = await fetch("https://api.paymongo.com/v1/sources", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: Math.round(amount * 100), // centavos
            currency: "PHP",
            type: pmType,
            redirect: {
              success: `${BASE_URL}/vendor/pay?payment=success`,
              failed: `${BASE_URL}/vendor/pay?payment=failed`,
            },
          },
        },
      }),
    });

    if (!pmRes.ok) {
      const err = await pmRes.json();
      throw new Error(err.errors?.[0]?.detail || "PayMongo error");
    }

    const pmData = await pmRes.json();
    const source = pmData.data;
    const ref_id = source.id;
    const qr_image = source.attributes.qr_code ?? null;
    const redirect_url = source.attributes.redirect?.checkout_url ?? null;

    // Save pending payment row to Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        vendor_id,
        stall_id: stall_id || null,
        amount,
        payment_method: channel,
        payment_type: payment_type || "due",
        status: "pending",
        reference_number: ref_id,
        period_month,
        period_year,
      })
      .select("id, reference_number")
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ ref_id, qr_image, redirect_url, payment_id: payment.id }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});