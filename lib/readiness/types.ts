export type IssueSeverity = "high" | "medium" | "low";

export type IssueCategory = "enchant" | "gem" | "tier";

export type CharacterSummary = {
  name: string;
  realm: string;
  region: string;
  spec: string;
  characterClass: string;
  itemLevel: number;
};

export type ReadinessIssue = {
  id: string;
  severity: IssueSeverity;
  category: IssueCategory;
  title: string;
  description: string;
  slot?: string;
};

export type ReadinessReport = {
  score: number;
  summary: string;
  character: CharacterSummary;
  issues: ReadinessIssue[];
};
