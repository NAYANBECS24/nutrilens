import { redirect } from "next/navigation";

// Root redirects to sign-in; auth guard in (app) layout will redirect
// authenticated users to /home automatically.
export default function RootPage() {
  redirect("/sign-in");
}
