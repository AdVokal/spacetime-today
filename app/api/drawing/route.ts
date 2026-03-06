import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { supabaseAdmin } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/encryption";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = token.email as string;
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("drawings")
    .select("snapshot_encrypted, iv")
    .eq("user_id", userId)
    .single();

  if (!data) return NextResponse.json({ snapshot: null });

  try {
    const snapshot = await decrypt(data.snapshot_encrypted, data.iv, userId);
    return NextResponse.json({ snapshot: JSON.parse(snapshot) });
  } catch {
    return NextResponse.json({ snapshot: null });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = token.email as string;
  const { snapshot } = await req.json();
  const { ciphertext, iv } = await encrypt(JSON.stringify(snapshot), userId);

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("drawings").upsert(
    { user_id: userId, snapshot_encrypted: ciphertext, iv, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
