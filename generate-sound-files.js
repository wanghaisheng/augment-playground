// Script to generate placeholder MP3 files for PandaHabit
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Sound effect file names from sound.ts
const soundEffects = [
  // Reward sounds
  'reward_common',
  'reward_uncommon',
  'reward_rare',
  'reward_epic',
  'reward_legendary',
  
  // Task related sounds
  'task_complete',
  'task_complete_high',
  'task_complete_main',
  'task_failed',
  'task_created',
  
  // Challenge related sounds
  'challenge_complete',
  'challenge_complete_epic',
  'challenge_complete_legendary',
  'challenge_failed',
  'challenge_unlocked',
  
  // System sounds
  'level_up',
  'ability_unlocked',
  'ability_activated',
  'button_click',
  'error',
  'success',
  'notification',
  'achievement',
  'confirm',
  
  // Panda interaction sounds
  'panda_happy',
  'panda_sad',
  'panda_eat',
  'panda_play',
  'panda_train',
  'panda_talk',
  
  // Environment sounds
  'water_splash',
  'camera_shutter',
  'lullaby',
  'morning_bell',
  
  // Bamboo system sounds
  'bamboo_collect',
  'water',
  'fertilize'
];

// Background music file names from backgroundMusic.ts
const backgroundMusic = [
  // Environment music
  'bamboo_forest',
  'meditation_ambient',
  'morning_nature',
  'evening_calm',
  
  // Traditional Chinese music
  'traditional_guzheng',
  'traditional_flute',
  'traditional_ensemble',
  
  // Seasonal theme music
  'spring_theme',
  'summer_theme',
  'autumn_theme',
  'winter_theme'
];

// Directories
const soundEffectsDir = path.join('public', 'assets', 'sounds');
const backgroundMusicDir = path.join('public', 'assets', 'sounds', 'music');

// Ensure directories exist
if (!fs.existsSync(soundEffectsDir)) {
  fs.mkdirSync(soundEffectsDir, { recursive: true });
}

if (!fs.existsSync(backgroundMusicDir)) {
  fs.mkdirSync(backgroundMusicDir, { recursive: true });
}

// Function to generate a silent MP3 file
function generateSilentMp3(filePath, durationSec = 1) {
  return new Promise((resolve, reject) => {
    // Check if ffmpeg is available
    exec('ffmpeg -version', (error) => {
      if (error) {
        console.log(`FFmpeg not available. Creating empty file: ${filePath}`);
        // Create an empty file if ffmpeg is not available
        fs.writeFileSync(filePath, '');
        resolve();
      } else {
        // Use ffmpeg to generate a silent MP3
        const command = `ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t ${durationSec} -q:a 9 -acodec libmp3lame "${filePath}" -y`;
        
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error generating ${filePath}: ${error.message}`);
            // Create an empty file as fallback
            fs.writeFileSync(filePath, '');
          }
          console.log(`Generated: ${filePath}`);
          resolve();
        });
      }
    });
  });
}

// Generate sound effect files
async function generateSoundEffects() {
  console.log('Generating sound effect files...');
  
  for (const sound of soundEffects) {
    const filePath = path.join(soundEffectsDir, `${sound}.mp3`);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File already exists: ${filePath}`);
      continue;
    }
    
    await generateSilentMp3(filePath, 1); // 1 second for sound effects
  }
}

// Generate background music files
async function generateBackgroundMusic() {
  console.log('Generating background music files...');
  
  for (const music of backgroundMusic) {
    const filePath = path.join(backgroundMusicDir, `${music}.mp3`);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File already exists: ${filePath}`);
      continue;
    }
    
    await generateSilentMp3(filePath, 5); // 5 seconds for background music
  }
}

// Main function
async function main() {
  try {
    await generateSoundEffects();
    await generateBackgroundMusic();
    console.log('All sound files generated successfully!');
  } catch (error) {
    console.error('Error generating sound files:', error);
  }
}

// Run the script
main();
