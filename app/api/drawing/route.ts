import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/encryption";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = session.user.email;
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("drawings")
    .select("snapshot_encrypted, iv")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ snapshot: null });
  }

  const snapshot = await decrypt(data.snapshot_encrypted, data.iv, userId);
  return NextResponse.json({ snapshot: JSON.parse(snapshot) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = session.user.email;
  const { snapshot } = await req.json();

  const { ciphertext, iv } = await encrypt(JSON.stringify(snapshot), userId);

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("drawings").upsert(
    {
      user_id: userId,
      snapshot_encrypted: ciphertext,
      iv,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
