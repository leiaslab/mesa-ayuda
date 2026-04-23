import PrivateLoginClient from "./PrivateLoginClient";

export default async function PrivateLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  return <PrivateLoginClient redirectTo={params.redirect ?? null} />;
}
