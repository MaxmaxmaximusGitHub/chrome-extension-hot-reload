Hot reload for Chrome extensions (for extensions developers)
===

Features:
---
1) Reload extension when its files change
2) Reload active tabs after reload extension


Installation:
---
1) Copy file `hot-reload.js` to your extension directory
2) Add this file to `background.html` page like `<script src='hot-reload.js'></script>`
3) Enjoy


Settings:
---
Settings are located in constants of top of this file

Production:
---
In production hot-reload not working, but file `hot-reload.js` exists in extension archive, but its size is small, so do not care.
