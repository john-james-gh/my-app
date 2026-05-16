import "server-only";

import { getBattleNetCredentials, getBattleNetTokenUrl } from "@/lib/battlenet/config";
import { battleNetFailure, mapBattleNetResponseError } from "@/lib/battlenet/errors";
import type { BattleNetRegion, BattleNetResult } from "@/lib/battlenet/types";

type TokenResponse = {
  access_token?: unknown;
  expires_in?: unknown;
};

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

const tokenCache = new Map<BattleNetRegion, CachedToken>();
const tokenRequests = new Map<BattleNetRegion, Promise<BattleNetResult<string>>>();

export async function getBattleNetAccessToken(
  region: BattleNetRegion,
): Promise<BattleNetResult<string>> {
  const cachedToken = tokenCache.get(region);

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return {
      ok: true,
      data: cachedToken.accessToken,
    };
  }

  const pendingRequest = tokenRequests.get(region);

  if (pendingRequest) {
    return pendingRequest;
  }

  const tokenRequest = requestBattleNetAccessToken(region).finally(() => {
    tokenRequests.delete(region);
  });

  tokenRequests.set(region, tokenRequest);
  return tokenRequest;
}

async function requestBattleNetAccessToken(
  region: BattleNetRegion,
): Promise<BattleNetResult<string>> {
  const credentials = getBattleNetCredentials();

  if (!credentials.ok) {
    return credentials;
  }

  const authHeader = Buffer.from(
    `${credentials.data.clientId}:${credentials.data.clientSecret}`,
  ).toString("base64");

  try {
    const response = await fetch(getBattleNetTokenUrl(region), {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      return battleNetFailure(mapBattleNetResponseError(response));
    }

    const payload = (await response.json()) as TokenResponse;

    if (
      typeof payload.access_token !== "string" ||
      typeof payload.expires_in !== "number"
    ) {
      return battleNetFailure({
        code: "invalid_response",
        message: "Battle.net token response did not include a usable access token.",
      });
    }

    tokenCache.set(region, {
      accessToken: payload.access_token,
      expiresAt: Date.now() + Math.max(payload.expires_in - 60, 0) * 1000,
    });

    return {
      ok: true,
      data: payload.access_token,
    };
  } catch {
    return battleNetFailure({
      code: "unavailable",
      message: "Could not reach Battle.net while requesting an access token.",
    });
  }
}
