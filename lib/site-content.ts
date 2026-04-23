import type { Json, SiteContent } from "@/types/database";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { DEFAULT_OFFICIAL_WHATSAPP_URL } from "@/lib/whatsapp";

export type SiteContentLink = {
  label: string;
  href: string;
};

export type SiteContentSocialLink = SiteContentLink & {
  icon: "instagram" | "facebook" | "youtube" | "tiktok" | "x";
};

export type SiteContentBundle = {
  splash: {
    imageUrl: string;
  };
  identity: {
    name: string;
    block: string;
    role: string;
  };
  hero: {
    eyebrow: string;
    city: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    whatsappUrl: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{
      num: string;
      title: string;
      desc: string;
    }>;
  };
  footer: {
    institutionName: string;
    socialPrompt: string;
    legalLinks: SiteContentLink[];
    socialLinks: SiteContentSocialLink[];
  };
};

export const DEFAULT_SITE_CONTENT: SiteContentBundle = {
  splash: {
    imageUrl: "/splash.jpeg",
  },
  identity: {
    name: "Cristian Frattini",
    block: "La Libertad Avanza Avellaneda",
    role: "",
  },
  hero: {
    eyebrow: "Mesa de Ayuda Virtual",
    city: "Avellaneda",
    title: "Reportá un problema en tu barrio",
    description: "Hacé tu reclamo y seguí su estado en tiempo real.",
    primaryCta: "Hacer un Reclamo",
    secondaryCta: "Consultar Estado",
    whatsappUrl: DEFAULT_OFFICIAL_WHATSAPP_URL,
  },
  howItWorks: {
    eyebrow: "Cómo funciona",
    title: "Tres pasos simples para cargar tu reclamo",
    description:
      "Un proceso claro para registrar el problema, recibir tu seguimiento y consultar el estado cuando lo necesites.",
    steps: [
      {
        num: "01",
        title: "Completá el formulario",
        desc: "Ingresá tus datos, describí el problema y adjuntá fotos si tenés.",
      },
      {
        num: "02",
        title: "Recibís tu número",
        desc: "Se genera tu código único para que puedas seguir el reclamo sin perder información.",
      },
      {
        num: "03",
        title: "Seguí el estado",
        desc: "Consultá el avance de tu reclamo en cualquier momento, desde cualquier dispositivo.",
      },
    ],
  },
  footer: {
    institutionName: "La Libertad Avanza Avellaneda",
    socialPrompt: "Seguinos en nuestras redes",
    legalLinks: [
      { label: "Términos de uso", href: "#footer-legal" },
      { label: "Política de privacidad", href: "#footer-legal" },
      { label: "Contacto", href: DEFAULT_OFFICIAL_WHATSAPP_URL },
    ],
    socialLinks: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/lalibertadavanzaavellaneda/",
        icon: "instagram",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/LaLibertadAvanzaAr",
        icon: "facebook",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@LaLibertadAvanzaNacional/videos",
        icon: "youtube",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@lalibertadavanzanacional",
        icon: "tiktok",
      },
      {
        label: "X",
        href: "https://x.com/LLibertadAvanza",
        icon: "x",
      },
    ],
  },
};

function asString(record: SiteContent | undefined, fallback: string) {
  return record?.value_text?.trim() || fallback;
}

function asJson<T>(record: SiteContent | undefined, fallback: T) {
  const value = record?.value_json;
  return (value as T | null) ?? fallback;
}

export async function getPublicSiteContent(): Promise<SiteContentBundle> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return DEFAULT_SITE_CONTENT;
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("editable", true);

    if (error || !data) {
      return DEFAULT_SITE_CONTENT;
    }

    const byKey = new Map<string, SiteContent>();
    data.forEach((row) => byKey.set(row.section_key, row as SiteContent));

    return {
      splash: {
        imageUrl: asString(byKey.get("splash.image_url"), DEFAULT_SITE_CONTENT.splash.imageUrl),
      },
      identity: {
        name: asString(byKey.get("identity.name"), DEFAULT_SITE_CONTENT.identity.name),
        block: asString(byKey.get("identity.block"), DEFAULT_SITE_CONTENT.identity.block),
        role: asString(byKey.get("identity.role"), DEFAULT_SITE_CONTENT.identity.role),
      },
      hero: {
        eyebrow: asString(byKey.get("hero.eyebrow"), DEFAULT_SITE_CONTENT.hero.eyebrow),
        city: asString(byKey.get("hero.city"), DEFAULT_SITE_CONTENT.hero.city),
        title: asString(byKey.get("hero.title"), DEFAULT_SITE_CONTENT.hero.title),
        description: asString(
          byKey.get("hero.description"),
          DEFAULT_SITE_CONTENT.hero.description
        ),
        primaryCta: asString(
          byKey.get("hero.primary_cta"),
          DEFAULT_SITE_CONTENT.hero.primaryCta
        ),
        secondaryCta: asString(
          byKey.get("hero.secondary_cta"),
          DEFAULT_SITE_CONTENT.hero.secondaryCta
        ),
        whatsappUrl: asString(
          byKey.get("hero.whatsapp_url"),
          DEFAULT_SITE_CONTENT.hero.whatsappUrl
        ),
      },
      howItWorks: {
        eyebrow: asString(
          byKey.get("how_it_works.eyebrow"),
          DEFAULT_SITE_CONTENT.howItWorks.eyebrow
        ),
        title: asString(
          byKey.get("how_it_works.title"),
          DEFAULT_SITE_CONTENT.howItWorks.title
        ),
        description: asString(
          byKey.get("how_it_works.description"),
          DEFAULT_SITE_CONTENT.howItWorks.description
        ),
        steps: asJson(
          byKey.get("how_it_works.steps"),
          DEFAULT_SITE_CONTENT.howItWorks.steps
        ),
      },
      footer: {
        institutionName: asString(
          byKey.get("footer.institution_name"),
          DEFAULT_SITE_CONTENT.footer.institutionName
        ),
        socialPrompt: asString(
          byKey.get("footer.social_prompt"),
          DEFAULT_SITE_CONTENT.footer.socialPrompt
        ),
        legalLinks: asJson(
          byKey.get("footer.legal_links"),
          DEFAULT_SITE_CONTENT.footer.legalLinks
        ),
        socialLinks: asJson(
          byKey.get("footer.social_links"),
          DEFAULT_SITE_CONTENT.footer.socialLinks
        ),
      },
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function buildSiteContentRows(payload: SiteContentBundle, updatedBy?: string | null) {
  return [
    row("identity.name", "Nombre visible", payload.identity.name, null, updatedBy),
    row("identity.block", "Bloque visible", payload.identity.block, null, updatedBy),
    row("identity.role", "Rol visible", payload.identity.role, null, updatedBy),
    row("hero.eyebrow", "Hero eyebrow", payload.hero.eyebrow, null, updatedBy),
    row("hero.city", "Hero ciudad", payload.hero.city, null, updatedBy),
    row("hero.title", "Hero título", payload.hero.title, null, updatedBy),
    row("hero.description", "Hero descripción", payload.hero.description, null, updatedBy),
    row("hero.primary_cta", "Hero botón principal", payload.hero.primaryCta, null, updatedBy),
    row("hero.secondary_cta", "Hero botón secundario", payload.hero.secondaryCta, null, updatedBy),
    row("hero.whatsapp_url", "WhatsApp flotante", payload.hero.whatsappUrl, null, updatedBy),
    row("how_it_works.eyebrow", "Cómo funciona eyebrow", payload.howItWorks.eyebrow, null, updatedBy),
    row("how_it_works.title", "Cómo funciona título", payload.howItWorks.title, null, updatedBy),
    row(
      "how_it_works.description",
      "Cómo funciona descripción",
      payload.howItWorks.description,
      null,
      updatedBy
    ),
    row("how_it_works.steps", "Cómo funciona pasos", null, payload.howItWorks.steps as Json, updatedBy),
    row(
      "footer.institution_name",
      "Footer institución",
      payload.footer.institutionName,
      null,
      updatedBy
    ),
    row("footer.social_prompt", "Footer redes texto", payload.footer.socialPrompt, null, updatedBy),
    row("footer.legal_links", "Footer legales", null, payload.footer.legalLinks as Json, updatedBy),
    row("footer.social_links", "Footer redes", null, payload.footer.socialLinks as Json, updatedBy),
  ];
}

function row(
  sectionKey: string,
  label: string,
  valueText: string | null,
  valueJson: Json | null,
  updatedBy?: string | null
) {
  return {
    section_key: sectionKey,
    label,
    value_text: valueText,
    value_json: valueJson,
    editable: true,
    updated_by: updatedBy ?? null,
  };
}
