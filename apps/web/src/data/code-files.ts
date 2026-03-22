export interface FileTreeNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  language?: string;
  children?: FileTreeNode[];
}

export interface CodeFile {
  path: string;
  language: string;
  content: string;
  diff?: { added: number[]; removed: number[] };
}

// MSN-001: OAuth2 PKCE auth migration
export const authFileTree: FileTreeNode = {
  name: 'src',
  type: 'directory',
  path: 'src',
  children: [
    {
      name: 'auth',
      type: 'directory',
      path: 'src/auth',
      children: [
        { name: 'pkce.ts', type: 'file', path: 'src/auth/pkce.ts', language: 'typescript' },
        { name: 'refresh.ts', type: 'file', path: 'src/auth/refresh.ts', language: 'typescript' },
        { name: 'types.ts', type: 'file', path: 'src/auth/types.ts', language: 'typescript' },
      ],
    },
    {
      name: 'middleware',
      type: 'directory',
      path: 'src/middleware',
      children: [
        { name: 'auth.ts', type: 'file', path: 'src/middleware/auth.ts', language: 'typescript' },
        { name: 'cors.ts', type: 'file', path: 'src/middleware/cors.ts', language: 'typescript' },
      ],
    },
    {
      name: '__tests__',
      type: 'directory',
      path: 'src/__tests__',
      children: [
        {
          name: 'pkce.test.ts',
          type: 'file',
          path: 'src/__tests__/pkce.test.ts',
          language: 'typescript',
        },
        {
          name: 'refresh.test.ts',
          type: 'file',
          path: 'src/__tests__/refresh.test.ts',
          language: 'typescript',
        },
      ],
    },
    { name: 'index.ts', type: 'file', path: 'src/index.ts', language: 'typescript' },
    { name: 'package.json', type: 'file', path: 'src/package.json', language: 'json' },
  ],
};

// MSN-002: Rate limiting
export const rateLimitFileTree: FileTreeNode = {
  name: 'src',
  type: 'directory',
  path: 'src',
  children: [
    {
      name: 'ingestion',
      type: 'directory',
      path: 'src/ingestion',
      children: [
        {
          name: 'handler.ts',
          type: 'file',
          path: 'src/ingestion/handler.ts',
          language: 'typescript',
        },
        {
          name: 'rate-limiter.ts',
          type: 'file',
          path: 'src/ingestion/rate-limiter.ts',
          language: 'typescript',
        },
        {
          name: 'routes.ts',
          type: 'file',
          path: 'src/ingestion/routes.ts',
          language: 'typescript',
        },
        {
          name: 'config.ts',
          type: 'file',
          path: 'src/ingestion/config.ts',
          language: 'typescript',
        },
      ],
    },
    {
      name: 'redis',
      type: 'directory',
      path: 'src/redis',
      children: [
        { name: 'client.ts', type: 'file', path: 'src/redis/client.ts', language: 'typescript' },
        { name: 'types.ts', type: 'file', path: 'src/redis/types.ts', language: 'typescript' },
      ],
    },
    {
      name: '__tests__',
      type: 'directory',
      path: 'src/__tests__',
      children: [
        {
          name: 'rate-limiter.test.ts',
          type: 'file',
          path: 'src/__tests__/rate-limiter.test.ts',
          language: 'typescript',
        },
      ],
    },
    { name: 'index.ts', type: 'file', path: 'src/index.ts', language: 'typescript' },
  ],
};

// MSN-004: Multi-currency billing
export const billingFileTree: FileTreeNode = {
  name: 'src',
  type: 'directory',
  path: 'src',
  children: [
    {
      name: 'billing',
      type: 'directory',
      path: 'src/billing',
      children: [
        {
          name: 'domain',
          type: 'directory',
          path: 'src/billing/domain',
          children: [
            {
              name: 'currency.ts',
              type: 'file',
              path: 'src/billing/domain/currency.ts',
              language: 'typescript',
            },
            {
              name: 'invoice.ts',
              type: 'file',
              path: 'src/billing/domain/invoice.ts',
              language: 'typescript',
            },
            {
              name: 'money.ts',
              type: 'file',
              path: 'src/billing/domain/money.ts',
              language: 'typescript',
            },
          ],
        },
        {
          name: 'infrastructure',
          type: 'directory',
          path: 'src/billing/infrastructure',
          children: [
            {
              name: 'fx-rate-service.ts',
              type: 'file',
              path: 'src/billing/infrastructure/fx-rate-service.ts',
              language: 'typescript',
            },
            {
              name: 'stripe-adapter.ts',
              type: 'file',
              path: 'src/billing/infrastructure/stripe-adapter.ts',
              language: 'typescript',
            },
          ],
        },
        {
          name: 'application',
          type: 'directory',
          path: 'src/billing/application',
          children: [
            {
              name: 'generate-invoice.ts',
              type: 'file',
              path: 'src/billing/application/generate-invoice.ts',
              language: 'typescript',
            },
          ],
        },
      ],
    },
    {
      name: '__tests__',
      type: 'directory',
      path: 'src/__tests__',
      children: [
        {
          name: 'multi-currency.test.ts',
          type: 'file',
          path: 'src/__tests__/multi-currency.test.ts',
          language: 'typescript',
        },
      ],
    },
    { name: 'index.ts', type: 'file', path: 'src/index.ts', language: 'typescript' },
  ],
};

export const fileTrees: Record<string, FileTreeNode> = {
  'MSN-001': authFileTree,
  'MSN-002': rateLimitFileTree,
  'MSN-004': billingFileTree,
};

export const codeFiles: CodeFile[] = [
  {
    path: 'src/auth/pkce.ts',
    language: 'typescript',
    content: `import { generateRandomBytes, base64UrlEncode } from './utils';

export interface PKCEChallenge {
  codeVerifier: string;
  codeChallenge: string;
  method: 'S256';
}

export async function generateCodeVerifier(): Promise<string> {
  const bytes = generateRandomBytes(32);
  return base64UrlEncode(bytes);
}

export async function generateCodeChallenge(
  verifier: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

export async function createPKCEChallenge(): Promise<PKCEChallenge> {
  const codeVerifier = await generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge, method: 'S256' };
}

// Validate verifier length per RFC 7636 (43-128 chars)
export function isValidVerifier(verifier: string): boolean {
  return verifier.length >= 43 && verifier.length <= 128;
}`,
    diff: {
      added: [
        1, 2, 4, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29,
        30, 31, 32,
      ],
      removed: [],
    },
  },
  {
    path: 'src/auth/refresh.ts',
    language: 'typescript',
    content: `import type { TokenPair, RefreshConfig } from './types';

const DEFAULT_CONFIG: RefreshConfig = {
  rotationWindowMs: 5000,
  maxRefreshCount: 50,
  tokenLifetimeMs: 3600000,
};

interface StoredRefresh {
  token: string;
  issuedAt: number;
  rotationCount: number;
}

const refreshStore = new Map<string, StoredRefresh>();

export async function rotateRefreshToken(
  currentToken: string,
  config: RefreshConfig = DEFAULT_CONFIG
): Promise<TokenPair> {
  const stored = refreshStore.get(currentToken);

  if (!stored) {
    throw new Error('Invalid refresh token');
  }

  const elapsed = Date.now() - stored.issuedAt;
  if (elapsed > config.rotationWindowMs) {
    refreshStore.delete(currentToken);
    throw new Error('Refresh token expired');
  }

  if (stored.rotationCount >= config.maxRefreshCount) {
    refreshStore.delete(currentToken);
    throw new Error('Max rotation count exceeded');
  }

  refreshStore.delete(currentToken);
  const newPair = await generateTokenPair(stored.rotationCount + 1);
  return newPair;
}

async function generateTokenPair(count: number): Promise<TokenPair> {
  return {
    accessToken: \`at_\${crypto.randomUUID()}\`,
    refreshToken: \`rt_\${crypto.randomUUID()}\`,
    expiresIn: 3600,
    rotationCount: count,
  };
}`,
    diff: { added: [17, 18, 19, 20, 21, 22, 28, 29, 30, 31, 33, 34, 35], removed: [] },
  },
  {
    path: 'src/middleware/auth.ts',
    language: 'typescript',
    content: `import { Request, Response, NextFunction } from 'express';
import { jwtVerify, type JWTVerifyResult } from 'jose';

const JWKS_URI = process.env.JWKS_URI ?? 'https://auth.example.com/.well-known/jwks.json';
const ISSUER = process.env.JWT_ISSUER ?? 'https://auth.example.com';

interface AuthenticatedRequest extends Request {
  auth?: { sub: string; tenantId: string; scopes: string[] };
}

export function jwtAuthMiddleware() {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing bearer token' });
    }

    const token = header.slice(7);
    try {
      const { payload } = await jwtVerify(token, createRemoteJWKSet(JWKS_URI), {
        issuer: ISSUER,
        audience: 'api',
      });
      req.auth = {
        sub: payload.sub as string,
        tenantId: payload.tenant_id as string,
        scopes: (payload.scope as string)?.split(' ') ?? [],
      };
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// Legacy session auth for /admin/* routes
export function sessionAuthMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Session required' });
    }
    return next();
  };
}`,
    diff: {
      added: [
        11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
      ],
      removed: [11, 12, 13],
    },
  },
  {
    path: 'src/ingestion/rate-limiter.ts',
    language: 'typescript',
    content: `import type { RedisClient } from '../redis/client';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  burstMultiplier: number;
  burstWindowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 1000,
  burstMultiplier: 2,
  burstWindowMs: 30_000,
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export async function checkRateLimit(
  redis: RedisClient,
  tenantId: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const key = \`rl:\${tenantId}\`;

  // Remove expired entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count requests in current window
  const count = await redis.zcard(key);
  const limit = config.maxRequests;

  if (count >= limit) {
    const oldestScore = await redis.zrangebyscore(key, '-inf', '+inf', 'LIMIT', 0, 1);
    const resetAt = oldestScore + config.windowMs;
    return { allowed: false, remaining: 0, resetAt, limit };
  }

  // Add current request
  await redis.zadd(key, now, \`\${now}:\${Math.random()}\`);
  await redis.pexpire(key, config.windowMs);

  return {
    allowed: true,
    remaining: limit - count - 1,
    resetAt: now + config.windowMs,
    limit,
  };
}`,
    diff: {
      added: [
        1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
        35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
      ],
      removed: [],
    },
  },
  {
    path: 'src/billing/domain/currency.ts',
    language: 'typescript',
    content: `export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
}

export const MINOR_UNITS: Record<Currency, number> = {
  [Currency.USD]: 2,
  [Currency.EUR]: 2,
  [Currency.GBP]: 2,
  [Currency.JPY]: 0,
};

export interface FxRate {
  from: Currency;
  to: Currency;
  rate: number;
  fetchedAt: string;
}

export interface Money {
  amount: number;
  currency: Currency;
}

export function formatMoney(money: Money): string {
  const units = MINOR_UNITS[money.currency];
  const symbols: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.EUR]: '\u20ac',
    [Currency.GBP]: '\u00a3',
    [Currency.JPY]: '\u00a5',
  };
  const symbol = symbols[money.currency];
  return \`\${symbol}\${money.amount.toFixed(units)}\`;
}

export function convertMoney(
  money: Money,
  toCurrency: Currency,
  rate: number
): Money {
  const converted = money.amount * rate;
  const units = MINOR_UNITS[toCurrency];
  // BUG: This rounding causes issues with GBP
  const rounded = Math.round(converted * 10 ** units) / 10 ** units;
  return { amount: rounded, currency: toCurrency };
}`,
    diff: {
      added: [
        1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 39, 40, 41, 42, 43, 44, 45,
        46, 47,
      ],
      removed: [1, 2, 3],
    },
  },
  {
    path: 'src/billing/infrastructure/fx-rate-service.ts',
    language: 'typescript',
    content: `import type { Currency, FxRate } from '../domain/currency';

const API_URL = 'https://api.exchangerate.host/latest';
const REFRESH_INTERVAL_MS = 60_000;

interface RateCache {
  rates: Map<string, FxRate>;
  lastFetch: number;
}

const cache: RateCache = {
  rates: new Map(),
  lastFetch: 0,
};

export async function fetchLatestRates(
  base: Currency
): Promise<FxRate[]> {
  const now = Date.now();

  if (now - cache.lastFetch < REFRESH_INTERVAL_MS) {
    return Array.from(cache.rates.values());
  }

  try {
    const response = await fetch(
      \`\${API_URL}?base=\${base}&symbols=USD,EUR,GBP,JPY\`
    );
    const data = await response.json();

    const rates: FxRate[] = Object.entries(data.rates).map(
      ([currency, rate]) => ({
        from: base,
        to: currency as Currency,
        rate: rate as number,
        fetchedAt: new Date().toISOString(),
      })
    );

    rates.forEach((r) => cache.rates.set(\`\${r.from}:\${r.to}\`, r));
    cache.lastFetch = now;
    return rates;
  } catch {
    // Fallback to cached rates if available
    if (cache.rates.size > 0) {
      console.warn('FX rate fetch failed, using cached rates');
      return Array.from(cache.rates.values());
    }
    throw new Error('No FX rates available');
  }
}`,
    diff: {
      added: [
        1, 2, 3, 4, 16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44,
      ],
      removed: [],
    },
  },
  {
    path: 'src/billing/application/generate-invoice.ts',
    language: 'typescript',
    content: `import { Currency, Money, convertMoney, formatMoney } from '../domain/currency';
import { fetchLatestRates } from '../infrastructure/fx-rate-service';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
}

export interface Invoice {
  id: string;
  tenantId: string;
  currency: Currency;
  lineItems: InvoiceLineItem[];
  subtotal: Money;
  tax: Money;
  total: Money;
  issuedAt: string;
}

export async function generateInvoice(
  tenantId: string,
  items: { description: string; quantity: number; unitPriceCents: number }[],
  currency: Currency = Currency.USD
): Promise<Invoice> {
  const rates = await fetchLatestRates(Currency.USD);
  const fxRate = rates.find((r) => r.to === currency)?.rate ?? 1;

  const lineItems: InvoiceLineItem[] = items.map((item) => {
    const usdPrice: Money = {
      amount: item.unitPriceCents / 100,
      currency: Currency.USD,
    };
    const converted = convertMoney(usdPrice, currency, fxRate);
    return {
      description: item.description,
      quantity: item.quantity,
      unitPrice: converted,
      total: { amount: converted.amount * item.quantity, currency },
    };
  });

  const subtotalAmount = lineItems.reduce((sum, li) => sum + li.total.amount, 0);
  const taxAmount = subtotalAmount * 0.2;

  return {
    id: \`INV-\${Date.now()}\`,
    tenantId,
    currency,
    lineItems,
    subtotal: { amount: subtotalAmount, currency },
    tax: { amount: taxAmount, currency },
    total: { amount: subtotalAmount + taxAmount, currency },
    issuedAt: new Date().toISOString(),
  };
}`,
    diff: {
      added: [22, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36],
      removed: [22, 23, 24],
    },
  },
  {
    path: 'src/ingestion/routes.ts',
    language: 'typescript',
    content: `import { Router } from 'express';
import { jwtAuthMiddleware } from '../middleware/auth';
import { rateLimitMiddleware } from './rate-limiter-middleware';
import { handleIngestEvent, handleIngestBatch } from './handler';

const router = Router();

// Apply auth to all ingestion routes
router.use(jwtAuthMiddleware());

// Apply rate limiting after auth (uses tenantId from JWT)
router.use(rateLimitMiddleware());

router.post('/events', handleIngestEvent);
router.post('/events/batch', handleIngestBatch);

export { router as ingestionRouter };`,
    diff: { added: [3, 12], removed: [] },
  },
];
