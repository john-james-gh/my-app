export const REGIONS = ["us", "eu", "kr", "tw"] as const;

export type Region = (typeof REGIONS)[number];

export type CharacterLookup = {
  region: Region;
  realm: string;
  name: string;
};

export type CharacterLookupErrors = Partial<Record<keyof CharacterLookup, string>>;

export function isRegion(value: string): value is Region {
  return REGIONS.includes(value as Region);
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toDisplayName(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function validateCharacterLookup(input: {
  region: string;
  realm: string;
  name: string;
}): { data: CharacterLookup; errors: null } | { data: null; errors: CharacterLookupErrors } {
  const region = input.region.trim().toLowerCase();
  const realm = toSlug(input.realm);
  const name = toSlug(input.name);
  const errors: CharacterLookupErrors = {};

  if (!isRegion(region)) {
    errors.region = "Choose a supported region.";
  }

  if (realm.length < 2) {
    errors.realm = "Enter a realm name.";
  }

  if (name.length < 2) {
    errors.name = "Enter a character name.";
  }

  if (realm.length > 32) {
    errors.realm = "Realm name is too long.";
  }

  if (name.length > 24) {
    errors.name = "Character name is too long.";
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      region: region as Region,
      realm,
      name,
    },
    errors: null,
  };
}
