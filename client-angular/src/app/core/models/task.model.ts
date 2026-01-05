export interface Task {
  id: number;
  time: string;
  title?: string;
  subtitle?: string;
  description?: string;
  type: 'activity' | 'journal' | 'note' | 'productivity';
  colorTheme: 'mint' | 'cyan' | 'purple' | 'peach';
  icon?: string; // PrimeIcons string
  isExpanded?: boolean;
}
