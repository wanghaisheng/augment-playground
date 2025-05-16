export enum SkinType {
  PANDA = 'panda',
  // Other equippable items if any
}

export enum SkinRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface PandaSkinRecord {
  id?: number;
  name: string;
  description?: string;
  type: SkinType.PANDA; // Always panda for this record
  rarity: SkinRarity;
  assetKey: string; // Key to retrieve image/model
  isEquipped: boolean;
  isOwned: boolean;
  isVipExclusive: boolean;
  themeType?: string; // e.g., 'spring_blossom', 'space_explorer'
  unlockCondition?: string; // e.g., 'vip_level_3', 'achievement_X'
  purchasePrice?: number;
  priceCurrency?: string; // 'coins', 'jade'
  createdAt: Date;
  updatedAt: Date;
} 