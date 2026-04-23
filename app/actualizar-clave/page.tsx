"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Page() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleUpdate = async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setMsg("Falta configurar Supabase para actualizar la contraseña.");
      return;
    }

    const supabase = createClient(url, key);
    const { error } = await supabase.auth.updateUser({ password });
    setMsg(error ? error.message : "✅ Contraseña cambiada correctamente");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Cambiar contraseña</h2>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        style={{ maxWidth: 300, width: "100%", padding: 10 }}
      />
      <br />
      <br />
      <button onClick={handleUpdate} style={{ padding: 10 }}>
        Actualizar contraseña
      </button>
      <p style={{ marginTop: 10 }}>{msg}</p>
    </div>
  );
}
