export interface TechniqueCategory {
  readonly key: string;
  readonly directory: string;
  readonly translationKey: string;
}

export const TECHNIQUE_CATEGORIES: readonly TechniqueCategory[] = [
  {
    key: 'Balance',
    directory: 'balance',
    translationKey: 'practice.categories.balance',
  },
  {
    key: 'Hand Forms',
    directory: 'hand-forms',
    translationKey: 'practice.categories.handForms',
  },
  {
    key: 'Leg Techniques',
    directory: 'leg-techniques',
    translationKey: 'practice.categories.legTechniques',
  },
  {
    key: 'Stances',
    directory: 'stances',
    translationKey: 'practice.categories.stances',
  },
  {
    key: 'Jumps',
    directory: 'jumps',
    translationKey: 'practice.categories.jumps',
  },
  {
    key: 'Weapon Techniques',
    directory: 'weapon-techniques',
    translationKey: 'practice.categories.weaponTechniques',
  },
];

export const ALL_TECHNIQUES_CATEGORY = {
  key: 'All',
  translationKey: 'practice.categories.all',
} as const;
