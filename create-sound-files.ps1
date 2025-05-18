# PowerShell script to create empty placeholder MP3 files for PandaHabit

# Sound effect file names from sound.ts
$soundEffects = @(
  # Reward sounds
  'reward_common',
  'reward_uncommon',
  'reward_rare',
  'reward_epic',
  'reward_legendary',
  
  # Task related sounds
  'task_complete',
  'task_complete_high',
  'task_complete_main',
  'task_failed',
  'task_created',
  
  # Challenge related sounds
  'challenge_complete',
  'challenge_complete_epic',
  'challenge_complete_legendary',
  'challenge_failed',
  'challenge_unlocked',
  
  # System sounds
  'level_up',
  'ability_unlocked',
  'ability_activated',
  'button_click',
  'error',
  'success',
  'notification',
  'achievement',
  'confirm',
  
  # Panda interaction sounds
  'panda_happy',
  'panda_sad',
  'panda_eat',
  'panda_play',
  'panda_train',
  'panda_talk',
  
  # Environment sounds
  'water_splash',
  'camera_shutter',
  'lullaby',
  'morning_bell',
  
  # Bamboo system sounds
  'bamboo_collect',
  'water',
  'fertilize'
)

# Background music file names from backgroundMusic.ts
$backgroundMusic = @(
  # Environment music
  'bamboo_forest',
  'meditation_ambient',
  'morning_nature',
  'evening_calm',
  
  # Traditional Chinese music
  'traditional_guzheng',
  'traditional_flute',
  'traditional_ensemble',
  
  # Seasonal theme music
  'spring_theme',
  'summer_theme',
  'autumn_theme',
  'winter_theme'
)

# Directories
$soundEffectsDir = Join-Path -Path "public" -ChildPath "assets\sounds"
$backgroundMusicDir = Join-Path -Path "public" -ChildPath "assets\sounds\music"

# Ensure directories exist
if (-not (Test-Path -Path $soundEffectsDir)) {
  New-Item -ItemType Directory -Path $soundEffectsDir -Force
}

if (-not (Test-Path -Path $backgroundMusicDir)) {
  New-Item -ItemType Directory -Path $backgroundMusicDir -Force
}

# Function to create an empty MP3 file
function Create-EmptyFile {
  param (
    [string]$filePath
  )
  
  try {
    # Create a minimal valid MP3 file (just a header)
    $bytes = [byte[]]@(
      0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    )
    
    [System.IO.File]::WriteAllBytes($filePath, $bytes)
    Write-Host "Created: $filePath"
  } catch {
    Write-Error "Error creating $filePath: $_"
  }
}

# Generate sound effect files
function Generate-SoundEffects {
  Write-Host "Generating sound effect files..."
  
  foreach ($sound in $soundEffects) {
    $filePath = Join-Path -Path $soundEffectsDir -ChildPath "$sound.mp3"
    
    # Skip if file already exists
    if (Test-Path -Path $filePath) {
      Write-Host "File already exists: $filePath"
      continue
    }
    
    Create-EmptyFile -filePath $filePath
  }
}

# Generate background music files
function Generate-BackgroundMusic {
  Write-Host "Generating background music files..."
  
  foreach ($music in $backgroundMusic) {
    $filePath = Join-Path -Path $backgroundMusicDir -ChildPath "$music.mp3"
    
    # Skip if file already exists
    if (Test-Path -Path $filePath) {
      Write-Host "File already exists: $filePath"
      continue
    }
    
    Create-EmptyFile -filePath $filePath
  }
}

# Main function
function Main {
  try {
    Generate-SoundEffects
    Generate-BackgroundMusic
    Write-Host "All sound files generated successfully!"
  } catch {
    Write-Error "Error generating sound files: $_"
  }
}

# Run the script
Main
