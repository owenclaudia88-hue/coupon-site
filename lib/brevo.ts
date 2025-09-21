// lib/brevo.ts
import SibApiV3Sdk from "sib-api-v3-sdk";

export function getBrevoTransactionalClient() {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("Missing BREVO_API_KEY (set it in Vercel → Settings → Environment Variables)");

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  (defaultClient.authentications["api-key"] as any).apiKey = apiKey;

  return new SibApiV3Sdk.TransactionalEmailsApi();
}
