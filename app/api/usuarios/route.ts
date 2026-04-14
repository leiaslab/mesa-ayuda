import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que quien llama es super_admin
    const serverSupabase = await createServerClient();
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: profile } = await serverSupabase
      .from("users")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (profile?.rol !== "super_admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const { nombre, email, password, rol } = await request.json();

    if (!nombre || !email || !password || !rol) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const adminClient = getAdminClient();

    // Crear usuario en Supabase Auth con metadata
    const { data: newUser, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre, rol },
    });

    if (error || !newUser.user) {
      return NextResponse.json({ error: error?.message ?? "Error al crear usuario" }, { status: 400 });
    }

    // El trigger handle_new_user crea el registro en public.users automáticamente.
    // Si no tiene el trigger, insertamos manualmente:
    await adminClient.from("users").upsert({
      id:     newUser.user.id,
      nombre,
      email,
      rol,
    });

    return NextResponse.json({ success: true, id: newUser.user.id });
  } catch (err) {
    console.error("Error en POST /api/usuarios:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
