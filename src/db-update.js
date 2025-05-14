import { db } from './db';

/**
 * Add VIP navigation labels to the database
 */
export async function addVipNavigationLabels() {
  const vipNavLabels = [
    { scopeKey: 'globalLayout', labelKey: 'navVip', languageCode: 'en', translatedText: 'VIP' },
    { scopeKey: 'globalLayout', labelKey: 'navVip', languageCode: 'zh', translatedText: 'VIP特权' },
  ];

  try {
    // Check if labels already exist
    for (const label of vipNavLabels) {
      const existingLabel = await db.uiLabels
        .where({
          scopeKey: label.scopeKey,
          labelKey: label.labelKey,
          languageCode: label.languageCode
        })
        .first();

      if (!existingLabel) {
        // Only add if it doesn't exist
        await db.uiLabels.add(label);
        console.log(`Added VIP navigation label for ${label.languageCode}`);
      } else {
        // Update if it exists
        await db.uiLabels.update(existingLabel.id, {
          translatedText: label.translatedText
        });
        console.log(`Updated VIP navigation label for ${label.languageCode}`);
      }
    }

    console.log('VIP navigation labels processed successfully');
    return true;
  } catch (error) {
    console.error('Failed to process VIP navigation labels:', error);
    return false;
  }
}
