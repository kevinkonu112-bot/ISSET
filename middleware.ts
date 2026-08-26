import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // 1. Si route admin (hors login) et pas d'utilisateur -> Redirection vers login
  if (isAdminRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 2. Si l'utilisateur est connecté et essaie d'aller sur le login -> Redirection vers dashboard
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // 3. Vérification optionnelle du rôle dans la table profiles (sécurisée pour éviter les blocages si la table est vide)
  if (isAdminRoute && !isLoginPage && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    // Si le profil existe et qu'un rôle est défini, on vérifie. S'il n'existe pas encore, on laisse passer pour éviter le blocage.
    if (profile && profile.role) {
      const hasAccess = profile.role === "admin" || profile.role === "editeur";
      if (!hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("error", "acces_refuse");
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};