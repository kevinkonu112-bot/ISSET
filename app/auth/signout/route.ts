import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  
  // Destruction de la session dans Supabase
  await supabase.auth.signOut();

  // Redirection automatique vers la page de connexion
  const requestUrl = new URL(request.url);
  return NextResponse.redirect(new URL("/admin/login", requestUrl.origin), {
    status: 302,
  });
}

export async function GET(request: Request) {
  const supabase = createClient();
  
  // Destruction de la session si accédé en GET
  await supabase.auth.signOut();

  const requestUrl = new URL(request.url);
  return NextResponse.redirect(new URL("/admin/login", requestUrl.origin), {
    status: 302,
  });
}