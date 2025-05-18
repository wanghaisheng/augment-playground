# Sound File Generation for PandaHabit

This document explains how to generate the required sound files for the PandaHabit application.

## Required Sound Files

The application requires various sound files to be placed in specific locations:

1. Sound effects in `/public/assets/sounds/`
2. Background music in `/public/assets/sounds/music/`

## Using the Sound Generation Tool

We've created a browser-based tool to help you generate placeholder sound files:

1. Start the development server:
   ```
   npm start
   ```

2. Open the sound generation tool in your browser:
   ```
   http://localhost:3000/generate-sounds.html
   ```

3. Click the "Generate Sound Files" button to generate all the required sound files.

4. Click the "Download All Files as ZIP" button to download a ZIP file containing all the generated sound files.

5. Extract the ZIP file and place the files in the appropriate directories:
   - Extract the `assets/sounds/*.mp3` files to `/public/assets/sounds/`
   - Extract the `assets/sounds/music/*.mp3` files to `/public/assets/sounds/music/`

## Using Real Sound Files

For a better user experience, you should replace the placeholder sound files with real sound files. You can find free sound effects and background music on the following websites:

- [Freesound](https://freesound.org/) - Large collection of free sound effects
- [Mixkit](https://mixkit.co/free-sound-effects/) - High-quality free sound effects
- [ZapSplat](https://www.zapsplat.com/) - Free sound effects library
- [Pixabay](https://pixabay.com/music/) - Free background music
- [Free Music Archive](https://freemusicarchive.org/) - Free music tracks

When downloading sound files, make sure to:

1. Rename the files to match the required filenames (e.g., `button_click.mp3`, `bamboo_forest.mp3`)
2. Convert the files to MP3 format if they're in a different format
3. Keep the file sizes small (ideally under 100KB for sound effects and under 2MB for background music)

## Sound File List

### Sound Effects

```
reward_common.mp3
reward_uncommon.mp3
reward_rare.mp3
reward_epic.mp3
reward_legendary.mp3
task_complete.mp3
task_complete_high.mp3
task_complete_main.mp3
task_failed.mp3
task_created.mp3
challenge_complete.mp3
challenge_complete_epic.mp3
challenge_complete_legendary.mp3
challenge_failed.mp3
challenge_unlocked.mp3
level_up.mp3
ability_unlocked.mp3
ability_activated.mp3
button_click.mp3
error.mp3
success.mp3
notification.mp3
achievement.mp3
confirm.mp3
panda_happy.mp3
panda_sad.mp3
panda_eat.mp3
panda_play.mp3
panda_train.mp3
panda_talk.mp3
water_splash.mp3
camera_shutter.mp3
lullaby.mp3
morning_bell.mp3
bamboo_collect.mp3
water.mp3
fertilize.mp3
```

### Background Music

```
bamboo_forest.mp3
meditation_ambient.mp3
morning_nature.mp3
evening_calm.mp3
traditional_guzheng.mp3
traditional_flute.mp3
traditional_ensemble.mp3
spring_theme.mp3
summer_theme.mp3
autumn_theme.mp3
winter_theme.mp3
```
