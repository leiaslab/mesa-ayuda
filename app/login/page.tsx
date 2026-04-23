import { redirect } from "next/navigation";
import { PRIVATE_LOGIN_PATH } from "@/lib/config/internal";

export default function LoginPage() {
  redirect(PRIVATE_LOGIN_PATH);
}
