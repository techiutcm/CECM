import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        { connected: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      connected: true,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ connected: false, error: message }, { status: 500 });
  }
}
