import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Configuration du transporteur SMTP avec Brevo
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email requis.' }, { status: 400 });
    }

    // 1. Générer un code OTP aléatoire à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Initialiser le client Supabase avec la clé Service Role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Définir l'expiration à 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 3. Sauvegarder ou mettre à jour le code dans la table 'password_resets'
    const { error: dbError } = await supabaseAdmin
      .from('password_resets')
      .upsert(
        { email, otp, expires_at: expiresAt },
        { onConflict: 'email' }
      );

    if (dbError) {
      console.error('Erreur base de données Supabase:', dbError);
      throw new Error("Erreur lors de l'enregistrement de la demande de réinitialisation.");
    }

    // 4. Envoyer l'e-mail via Brevo avec ton adresse vérifiée kevinkonu112@gmail.com
    await transporter.sendMail({
      from: `"ISSET Admin" <kevinkonu112@gmail.com>`,
      to: email,
      subject: 'Votre code de réinitialisation de mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; text-align: center;">Réinitialisation de mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe administrateur. Voici votre code de vérification à 6 chiffres :</p>
          <div style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 15px; font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 8px; color: #0284c7; margin: 20px 0; border-radius: 6px;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #64748b;">Ce code expire dans <strong>10 minutes</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">ISSET Togo - Tableau de bord Administrateur</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Code de vérification envoyé avec succès.' });

  } catch (error: any) {
    console.error('Erreur API send-otp:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erreur interne du serveur.' }, { status: 500 });
  }
}