@echo off
echo Creating sound effect files...

REM Create sound effects directory if it doesn't exist
if not exist "public\assets\sounds" mkdir "public\assets\sounds"

REM Create background music directory if it doesn't exist
if not exist "public\assets\sounds\music" mkdir "public\assets\sounds\music"

REM Create sound effect files
echo Creating sound effect files...
copy NUL "public\assets\sounds\button_click.mp3"
copy NUL "public\assets\sounds\success.mp3"
copy NUL "public\assets\sounds\error.mp3"
copy NUL "public\assets\sounds\notification.mp3"
copy NUL "public\assets\sounds\level_up.mp3"
copy NUL "public\assets\sounds\task_complete.mp3"
copy NUL "public\assets\sounds\task_created.mp3"
copy NUL "public\assets\sounds\reward_common.mp3"
copy NUL "public\assets\sounds\reward_rare.mp3"
copy NUL "public\assets\sounds\reward_epic.mp3"
copy NUL "public\assets\sounds\reward_legendary.mp3"
copy NUL "public\assets\sounds\challenge_complete.mp3"
copy NUL "public\assets\sounds\challenge_unlocked.mp3"
copy NUL "public\assets\sounds\panda_happy.mp3"
copy NUL "public\assets\sounds\panda_sad.mp3"
copy NUL "public\assets\sounds\panda_eat.mp3"
copy NUL "public\assets\sounds\bamboo_collect.mp3"

REM Create background music files
echo Creating background music files...
copy NUL "public\assets\sounds\music\bamboo_forest.mp3"
copy NUL "public\assets\sounds\music\meditation_ambient.mp3"
copy NUL "public\assets\sounds\music\traditional_guzheng.mp3"
copy NUL "public\assets\sounds\music\traditional_flute.mp3"

echo All sound files created successfully!
