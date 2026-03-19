import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const rawBody = await req.text();

    // Verify signature from PayMongo
    const sigHeader = req.headers.get("paymongo-signature") || "";
    const WEBHOOK_SECRET = Deno.env.get("PAYMONGO_WEBHOOK_SECRET");
    if (WEBHOOK_SECRET && sigHeader) {
      const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));
      const payload = `${parts["t"]}.${rawBody}`;
      const expected = createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex");
      if (expected !== parts["te"]) return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.data?.attributes?.type;
    const sourceData = event.data?.attributes?.data;
    const ref_id = sourceData?.id;

    // ── source.chargeable: QR was scanned, now charge it ──
    if (eventType === "source.chargeable" && ref_id) {
      const SECRET = Deno.env.get("PAYMONGO_SECRET_KEY")!;
      const auth = btoa(SECRET + ":");

      const { data: payment } = await supabase
        .from("payments")
        .select("id, amount")
        .eq("reference_number", ref_id)
        .single();

      if (payment) {
        await fetch("https://api.paymongo.com/v1/payments", {
          method: "POST",
          headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              attributes: {
                amount: Math.round(Number(payment.amount) * 100),
                currency: "PHP",
                source: { id: ref_id, type: "source" },
                description: "Paleng-Click stall fee",
              },
            },
          }),
        });
      }
    }

    // ── payment.paid: mark as completed, notify vendor ──
    if (eventType === "payment.paid") {
      const sourceId = sourceData?.attributes?.source?.id || ref_id;

      const { data: payment } = await supabase
        .from("payments")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("reference_number", sourceId)
        .select("id, vendor_id, amount, payment_method, period_month, period_year")
        .single();

      if (payment) {
        // Get vendor's user_id so we can send a notification
        const { data: vendor } = await supabase
          .from("vendors")
          .select("user_id")
          .eq("id", payment.vendor_id)
          .single();

        if (vendor) {
          const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          const month = payment.period_month ? MONTHS[payment.period_month - 1] : "";
          await supabase.from("notifications").insert({
            user_id: vendor.user_id,
            title: "Payment Confirmed",
            message: `Your payment of ₱${Number(payment.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })} for ${month} ${payment.period_year} via ${payment.payment_method} has been confirmed.`,
            type: "confirmation",
            read_status: false,
          });
        }
      }
    }

    // ── payment.failed: mark as failed ──
    if (eventType === "payment.failed") {
      const sourceId = sourceData?.attributes?.source?.id || ref_id;
      await supabase
        .from("payments")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("reference_number", sourceId);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});