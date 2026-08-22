import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: 'Paramètres manquants.' }, { status: 400 });
    }

    // Initialisation de Supabase avec la clé Service Role (côté serveur sécurisé)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Récupérer le code OTP stocké pour cet e-mail
    const { data: record, error: fetchError } = await supabaseAdmin
      .from('password_resets')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !record) {
      return NextResponse.json({ success: false, error: 'Aucune demande de réinitialisation trouvée pour cet e-mail.' }, { status: 400 });
    }

    // 2. Vérifier si le code a expiré (10 minutes)
    if (new Date() > new Date(record.expires_at)) {
      return NextResponse.json({ success: false, error: 'Le code a expiré. Veuillez refaire une demande.' }, { status: 400 });
    }

    // 3. Vérifier si le code OTP saisi correspond
    if (record.otp !== otp) {
      return NextResponse.json({ success: false, error: 'Code de vérification incorrect.' }, { status: 400 });
    }

    // 4. Le code est bon : Trouver l'ID de l'utilisateur dans Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) throw userError;

    const user = userData.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilisateur introuvable dans le système.' }, { status: 404 });
    }

    // 5. Mettre à jour le mot de passe de l'administrateur
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) throw updateError;

    // 6. Nettoyer la table en supprimant le code OTP utilisé
    await supabaseAdmin
      .from('password_resets')
      .delete()
      .eq('email', email);

    return NextResponse.json({ success: true, message: 'Mot de passe mis à jour avec succès.' });

  } catch (error: any) {
    console.error('Erreur API verify-otp:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erreur interne du serveur.' }, { status: 500 });
  }
}