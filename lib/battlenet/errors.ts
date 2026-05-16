import "server-only";

import type { BattleNetError, BattleNetResult } from "@/lib/battlenet/types";

export function battleNetFailure<T>(error: BattleNetError): BattleNetResult<T> {
  return {
    ok: false,
    error,
  };
}

export function mapBattleNetResponseError(response: Response): BattleNetError {
  if (response.status === 401 || response.status === 403) {
    return {
      code: "auth_failed",
      message: "Battle.net rejected the configured credentials or access token.",
      status: response.status,
    };
  }

  if (response.status === 404) {
    return {
      code: "not_found",
      message: "Battle.net could not find that character or realm.",
      status: response.status,
    };
  }

  if (response.status === 429) {
    return {
      code: "rate_limited",
      message: "Battle.net rate limited the request. Try again later.",
      status: response.status,
    };
  }

  if (response.status >= 500) {
    return {
      code: "unavailable",
      message: "Battle.net is temporarily unavailable.",
      status: response.status,
    };
  }

  return {
    code: "request_failed",
    message: "Battle.net returned an unexpected response.",
    status: response.status,
  };
}
