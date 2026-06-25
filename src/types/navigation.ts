export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export type ActivePage = 'overview' | 'copilot' | 'knowledge-base' | 'architecture';