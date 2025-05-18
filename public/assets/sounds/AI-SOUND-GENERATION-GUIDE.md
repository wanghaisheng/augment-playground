# AI Sound Generation Guide for PandaHabit

This guide explains how to use AI tools to generate high-quality sound effects and background music for the PandaHabit application.

## Overview

We've created a comprehensive CSV file (`sound-resources.csv`) that contains:
- File names for all required sounds
- Type and category information
- Recommended duration
- Detailed descriptions
- AI prompts specifically crafted for audio generation tools

## AI Audio Generation Tools

Several AI tools can generate audio based on text prompts. Here are some recommended options:

### For Sound Effects

1. **AudioCraft / MusicGen / AudioGen** (Meta)
   - Website: [AudioCraft GitHub](https://github.com/facebookresearch/audiocraft)
   - Features: Can generate both sound effects and music
   - Usage: Use the prompts from the CSV file with AudioGen for sound effects

2. **ElevenLabs Sound Effects**
   - Website: [ElevenLabs](https://elevenlabs.io/sound-effects)
   - Features: Specialized in generating realistic sound effects
   - Usage: Copy the AI prompts directly into their interface

3. **DALL-E 3 Audio** (OpenAI)
   - Website: [OpenAI](https://openai.com/)
   - Features: Can generate audio based on text descriptions
   - Usage: Use the AI prompts from the CSV file

4. **Stable Audio**
   - Website: [Stability AI](https://stability.ai/)
   - Features: Good for generating various audio types
   - Usage: Use the AI prompts with appropriate settings

### For Background Music

1. **Suno**
   - Website: [Suno](https://suno.ai/)
   - Features: Specialized in music generation
   - Usage: Use the background music prompts from the CSV file

2. **Udio**
   - Website: [Udio](https://udio.com/)
   - Features: Creates high-quality music tracks
   - Usage: Use the background music prompts from the CSV file

3. **MusicGen** (Meta)
   - Website: [AudioCraft GitHub](https://github.com/facebookresearch/audiocraft)
   - Features: Specialized in music generation
   - Usage: Use the background music prompts from the CSV file

4. **Soundraw**
   - Website: [Soundraw](https://soundraw.io/)
   - Features: AI music generation with style controls
   - Usage: Use the background music prompts with appropriate style settings

## Step-by-Step Guide

### 1. Generating Sound Effects

1. **Choose an AI tool** from the sound effects section above
2. **Open the CSV file** (`sound-resources.csv`) and find the sound effect you want to generate
3. **Copy the AI prompt** from the CSV file
4. **Paste the prompt** into the AI tool's interface
5. **Adjust settings** if available:
   - Set the duration according to the recommended length in the CSV
   - For sound effects, choose higher quality settings if available
   - For traditional Chinese sounds, specify this in additional settings if the tool allows
6. **Generate the sound** and download the result
7. **Rename the file** to match the required filename from the CSV
8. **Convert to MP3 format** if necessary (many tools output WAV files)
9. **Place the file** in the `/public/assets/sounds/` directory

### 2. Generating Background Music

1. **Choose an AI tool** from the background music section above
2. **Open the CSV file** (`sound-resources.csv`) and find the music track you want to generate
3. **Copy the AI prompt** from the CSV file
4. **Paste the prompt** into the AI tool's interface
5. **Adjust settings** if available:
   - Set the duration according to the recommended length in the CSV (typically 3-4 minutes)
   - For traditional Chinese music, specify this in additional settings if the tool allows
   - Adjust tempo, mood, and instrumentation settings if available
6. **Generate the music** and download the result
7. **Rename the file** to match the required filename from the CSV
8. **Convert to MP3 format** if necessary
9. **Place the file** in the `/public/assets/sounds/music/` directory

### 3. Post-Processing (Optional but Recommended)

For the best results, consider these post-processing steps:

1. **Trim the audio** to remove any unwanted silence at the beginning or end
2. **Normalize the volume** to ensure consistent levels across all sounds
3. **Add fade-in/fade-out** for background music tracks (0.5-1 second fade-in, 1-2 second fade-out)
4. **Optimize file size** by adjusting MP3 compression settings:
   - For sound effects: 128-192 kbps is usually sufficient
   - For background music: 192-256 kbps provides good quality while keeping file size reasonable
5. **Make background music loopable** by ensuring the end transitions smoothly to the beginning

## Tips for Better Results

### For Sound Effects

1. **Be specific in additional instructions** about the traditional Chinese instruments you want to hear
2. **Generate multiple variations** and choose the best one
3. **Specify "non-verbal"** for panda sounds to avoid human-like vocalizations
4. **Request "clean, isolated sounds"** without background noise or reverb
5. **For UI sounds** (button clicks, etc.), specify "subtle, not distracting" in your additional instructions

### For Background Music

1. **Specify "seamless loop"** if the tool supports it
2. **Request "dynamic variation"** to avoid repetitive sections
3. **Mention "traditional Chinese instruments"** explicitly in additional instructions
4. **Specify "ambient, non-distracting"** for background music that won't interfere with concentration
5. **Generate longer tracks** than needed (5+ minutes if possible) and then edit down to the best sections

## Free Audio Editing Tools

If you need to edit the generated audio:

1. **Audacity** - Free, open-source audio editor
   - Website: [Audacity](https://www.audacityteam.org/)
   - Good for: Trimming, normalizing, adding fades, converting formats

2. **FFMPEG** - Command-line tool for audio conversion
   - Website: [FFMPEG](https://ffmpeg.org/)
   - Good for: Batch converting files, optimizing file sizes

3. **Online Audio Converter** - Web-based conversion tool
   - Website: [Online Audio Converter](https://online-audio-converter.com/)
   - Good for: Quick format conversions without installing software

## Legal Considerations

When using AI-generated audio:

1. **Check the terms of service** of the AI tool you're using
2. **Verify the licensing terms** for commercial use
3. **Keep records** of which tools were used to generate each sound
4. **Consider generating multiple variations** to ensure uniqueness

## Conclusion

Using AI to generate sound effects and background music can save time and resources while providing high-quality audio for your application. The carefully crafted prompts in the CSV file are designed to produce sounds that match the traditional Chinese aesthetic of PandaHabit while maintaining a cohesive audio experience throughout the app.

For any sounds that don't meet your expectations with AI generation, consider using royalty-free sound libraries as an alternative source.
