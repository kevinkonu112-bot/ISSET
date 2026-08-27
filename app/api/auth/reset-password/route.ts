import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, otpCode, newPassword } = await request.json();

    if (!email || !otpCode || !newPassword) {
      return NextResponse.json({ success: false, error: 'Informations manquantes.' }, { status: 400 });
    }

    // Initialiser le client Supabase avec la clé Service Role (contourne la session manquante)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Vérifier le code OTP dans la table 'password_resets'
    const { data: resetRecord, error: fetchError } = await supabaseAdmin
      .from('password_resets')
      .select('*')
      .eq('email', email)
      .eq('otp', otpCode)
      .single();

    if (fetchError || !resetRecord) {
      return NextResponse.json({ success: false, error: "Code OTP invalide ou expiré." }, { status: 400 });
    }

    // Vérifier l'expiration (10 minutes)
    if (new Date() > new Date(resetRecord.expires_at)) {
      return NextResponse.json({ success: false, error: "Le code OTP a expiré. Veuillez refaire une demande." }, { status: 400 });
    }

    // 2. Trouver l'ID de l'utilisateur par son email dans Supabase Auth
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    const targetUser = users?.find((u) => u.email === email);

    if (userError || !targetUser) {
      return NextResponse.json({ success: false, error: "Utilisateur introuvable." }, { status: 404 });
    }

    // 3. Mettre à jour le mot de passe de l'utilisateur avec l'API Admin
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      { password: newPassword }
    );

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 400 });
    }

    // 4. Supprimer le code OTP utilisé de la table
    await supabaseAdmin.from('password_resets').delete().eq('email', email);

    return NextResponse.json({ success: true, message: 'Mot de passe mis à jour avec succès.' });

  } catch (error: any) {
    console.error('Erreur API reset-password:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erreur interne du serveur.' }, { status: 500 });
  }
}