import crypto from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { userCollection } from "@/models/users";
import { passwordTokenCollection } from "@/models/passwordTokens";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { base_checkEmail } from "@/lib/utils";

// Controllo env (fail fast)
if (!process.env.MAILERSEND_API_KEY) {
  throw new Error("MAILERSEND_API_KEY mancante");
}

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

// Rate limiting in-memory - SOLO PER IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minuti
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 richieste per IP ogni 15 minuti

function checkRateLimit(ip) {
  const now = Date.now();
  
  // Pulisci vecchie entry
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(key);
    }
  }
  
  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, {
      count: 1,
      firstRequest: now,
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, {
      count: 1,
      firstRequest: now,
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetTime = new Date(record.firstRequest + RATE_LIMIT_WINDOW);
    return { 
      allowed: false, 
      remaining: 0,
      resetTime 
    };
  }
  
  record.count++;
  return { 
    allowed: true, 
    remaining: MAX_REQUESTS_PER_WINDOW - record.count 
  };
}

function getClientIP(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const real = req.headers.get("x-real-ip");
  const cfConnecting = req.headers.get("cf-connecting-ip");
  
  if (cfConnecting) return cfConnecting;
  if (forwarded) return forwarded.split(",")[0].trim();
  if (real) return real;
  
  return "unknown";
}

export async function POST(req) {
  const rtn = { success: false, data: "", error: "" };

  try {
    const { email } = await req.json();

    // --- VALIDAZIONE INPUT ---
    if (!email || email.trim() === "") {
      rtn.error = "Email is required";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    if (!base_checkEmail(email)) {
      rtn.error = "Invalid email format";
      return new NextResponse(JSON.stringify(rtn), { status: 400 });
    }

    // --- RATE LIMIT CHECK (SOLO IP) ---
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for IP ${clientIP}`);
      rtn.error = "Too many requests. Please try again later.";
      rtn.data = { resetTime: rateLimit.resetTime };
      return new NextResponse(JSON.stringify(rtn), { status: 429 });
    }

    // --- CONNESSIONE DB ---
    const client = await clientPromise;
    const db = client.db();
    const users = userCollection(db);
    const tokens = passwordTokenCollection(db);

    // --- CERCA UTENTE ---
    const user = await users.findOne({ email: email.trim() });

    // Risposta neutra per sicurezza (anche se l'utente non esiste)
    if (!user) {
      rtn.success = true;
      rtn.data = { 
        message: "If this email exists, a reset link has been sent.",
        remaining: rateLimit.remaining 
      };
      return new NextResponse(JSON.stringify(rtn), { status: 200 });
    }

    // --- GENERA TOKEN ---
    const token = crypto.randomBytes(32).toString("hex");

    // --- SALVA TOKEN ---
    await tokens.insertOne({
      userId: user._id,
      token,
      used: false,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      createdAt: new Date(),
    });

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    // --- PREPARA EMAIL ---
    const emailParams = new EmailParams()
      .setFrom(
        new Sender(
          process.env.MAILERSEND_FROM_EMAIL,
          process.env.MAILERSEND_FROM_NAME
        )
      )
      .setTo([new Recipient(email.trim())])
      .setSubject("Reset della password")
      .setHtml(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background: #007bff; 
                color: white !important; 
                text-decoration: none; 
                border-radius: 5px;
                margin: 20px 0;
              }
              .footer { color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Reset della password</h2>
              <p>Hai richiesto il reset della password per il tuo account.</p>
              <p>Clicca sul pulsante qui sotto per reimpostare la password:</p>
              <a href="${resetLink}" class="button">Reimposta la password</a>
              <p style="font-size: 12px; color: #666;">
                Oppure copia e incolla questo link nel tuo browser:<br>
                <span style="word-break: break-all;">${resetLink}</span>
              </p>
              <div class="footer">
                <p><strong>Il link è valido per 15 minuti.</strong></p>
                <p>Se non hai richiesto questo reset, ignora questa email. La tua password rimarrà invariata.</p>
              </div>
            </div>
          </body>
        </html>
      `)
      .setText(`Reset della password\n\nHai richiesto il reset della password.\n\nClicca su questo link:\n${resetLink}\n\nIl link è valido per 15 minuti.\n\nSe non hai richiesto questo reset, ignora questa email.`);

    // --- INVIA EMAIL ---
    await mailerSend.email.send(emailParams);

    // --- RISPOSTA ---
    rtn.success = true;
    rtn.data = { 
      message: "Password reset email sent successfully.",
      remaining: rateLimit.remaining 
    };

    return new NextResponse(JSON.stringify(rtn), { status: 200 });
  } catch (error) {
    console.error("Error in /api/forgot-password:", error);
    rtn.error = error.message + " on endpoint:/api/forgot-password";
    rtn.data = "";
    return new NextResponse(JSON.stringify(rtn), { status: 500 });
  }
}