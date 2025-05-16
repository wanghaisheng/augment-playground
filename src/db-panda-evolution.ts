// src/db-panda-evolution.ts
import { db } from './db-old';

/**
 * Add panda evolution labels to the database
 * This function adds all the labels needed for the panda evolution animation
 *
 * @returns A promise that resolves when the labels are added
 */
export async function addPandaEvolutionLabels(): Promise<void> {
  try {
    // Check if panda evolution labels already exist
    const existingLabel = await db.uiLabels.where({
      scopeKey: 'pandaEvolution',
      labelKey: 'evolutionTitle',
      languageCode: 'en'
    }).first();

    if (existingLabel) {
      console.log('Panda evolution labels already exist');
      return;
    }

    // Add panda evolution labels
    await db.uiLabels.bulkAdd([
      // English labels
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'evolutionTitle', 
        languageCode: 'en', 
        translatedText: 'Panda Evolution!' 
      },
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'evolutionMessage', 
        languageCode: 'en', 
        translatedText: 'Congratulations! Your panda has grown to level {level} and gained new abilities and appearance!' 
      },
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'continueButtonLabel', 
        languageCode: 'en', 
        translatedText: 'Continue' 
      },
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'levelLabel', 
        languageCode: 'en', 
        translatedText: 'Level' 
      },
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'newAbilitiesMessage', 
        languageCode: 'en', 
        translatedText: 'New Abilities Unlocked:' 
      },
      
      // Chinese labels
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'evolutionTitle', 
        languageCode: 'zh', 
        translatedText: '熊猫进化！' 
      },
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'evolutionMessage', 
        languageCode: 'zh', 
        translatedText: '恭喜！你的熊猫已经成长到{level}级，获得了新的能力和外观！' 
      },
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'continueButtonLabel', 
        languageCode: 'zh', 
        translatedText: '继续' 
      },
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'levelLabel', 
        languageCode: 'zh', 
        translatedText: '等级' 
      },
      { 
        scopeKey: 'pandaEvolution', 
        labelKey: 'newAbilitiesMessage', 
        languageCode: 'zh', 
        translatedText: '解锁新能力：' 
      },
    ]);

    console.log('Added panda evolution labels');
  } catch (error) {
    console.error('Failed to add panda evolution labels:', error);
  }
}
