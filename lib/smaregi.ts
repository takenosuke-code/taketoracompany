/**
 * スマレジ・プラットフォームAPI クライアント（Webサイト用・在庫の読み取り専用）
 *
 * taketora_app（在庫管理アプリ）の supabase/functions/_shared/smaregi.ts と同じ
 * 認証方式（OAuth2 client_credentials）。ただしサイトは在庫を表示するだけなので、
 * 要求スコープは pos.stock:read のみ。
 *
 * 必要な環境変数（未設定の間は getStockMap() が null を返し、サイトは在庫不明として動く）:
 *   SMAREGI_CONTRACT_ID / SMAREGI_CLIENT_ID / SMAREGI_CLIENT_SECRET
 *   SMAREGI_ENV        production 以外を指定するとサンドボックス(*.smaregi.dev)
 *   SMAREGI_STORE_ID   任意。指定時はその店舗の在庫のみ、未指定なら全店舗の合算
 */

interface SmaregiConfig {
  contractId: string;
  clientId: string;
  clientSecret: string;
  idHost: string;
  apiHost: string;
  storeId?: string;
}

function cfg(): SmaregiConfig | null {
  const contractId = process.env.SMAREGI_CONTRACT_ID;
  const clientId = process.env.SMAREGI_CLIENT_ID;
  const clientSecret = process.env.SMAREGI_CLIENT_SECRET;
  if (!contractId || !clientId || !clientSecret) return null;
  // アプリ側と違い、サイトは本番店舗の在庫表示が目的なので既定を production にする
  const isSandbox = (process.env.SMAREGI_ENV ?? "production") !== "production";
  return {
    contractId,
    clientId,
    clientSecret,
    idHost: isSandbox ? "https://id.smaregi.dev" : "https://id.smaregi.jp",
    apiHost: isSandbox ? "https://api.smaregi.dev" : "https://api.smaregi.jp",
    storeId: process.env.SMAREGI_STORE_ID || undefined,
  };
}

// トークンはプロセス内でキャッシュ（expires_in から少し手前で失効扱い）
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(c: SmaregiConfig): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token;
  const basic = Buffer.from(`${c.clientId}:${c.clientSecret}`).toString("base64");
  const res = await fetch(`${c.idHost}/app/${c.contractId}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "pos.stock:read",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`スマレジ認証失敗: ${res.status} ${(await res.text()).slice(0, 200)}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  const ttl = Math.max((data.expires_in ?? 3600) - 60, 60);
  cachedToken = { token: data.access_token, expiresAt: Date.now() + ttl * 1000 };
  return cachedToken.token;
}

/**
 * 全商品の現在在庫を { smaregiProductId: stockAmount } で返す。
 * スマレジ未設定（環境変数なし）の場合は null（＝在庫不明）。
 * SMAREGI_STORE_ID 未指定時は全店舗の在庫を商品ごとに合算する。
 */
export async function getStockMap(): Promise<Record<string, number> | null> {
  const c = cfg();
  if (!c) return null;
  const token = await getAccessToken(c);
  const out: Record<string, number> = {};
  const limit = 1000;
  for (let page = 1; page <= 50; page++) {
    const qs = new URLSearchParams({ limit: String(limit), page: String(page) });
    if (c.storeId) qs.set("store_id", c.storeId);
    const res = await fetch(`${c.apiHost}/${c.contractId}/pos/stock?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`スマレジ在庫取得失敗: ${res.status} ${(await res.text()).slice(0, 200)}`);
    }
    const rows = (await res.json()) as Array<{
      productId: string | number;
      stockAmount: string | number;
    }>;
    for (const r of rows) {
      const pid = String(r.productId);
      out[pid] = (out[pid] ?? 0) + Number(r.stockAmount ?? 0);
    }
    if (rows.length < limit) break; // 最終ページ
  }
  return out;
}
