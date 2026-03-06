"use server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/encryption";

export async function saveDrawing(snapshot: unknown) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("unauthorized");

  const userId = session.user.email;
  const { ciphertext, iv } = await encrypt(JSON.stringify(snapshot), userId);

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("drawings").upsert(
    { user_id: userId, snapshot_encrypted: ciphertext, iv, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );

  if (error) throw new Error(error.message);
}

export async function loadDrawing() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const userId = session.user.email;
  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("drawings")
    .select("snapshot_encrypted, iv")
    .eq("user_id", userId)
    .single();

  if (!data) return null;

  try {
    const decrypted = await decrypt(data.snapshot_encrypted, data.iv, userId);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}
