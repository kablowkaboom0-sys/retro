# PICO Games Web Emulator

A lightweight GitHub Pages frontend for playing PICO-8-style cartridges through a browser emulator instead of the paid/native PICO-8 runtime.

## Current setup

The page embeds the open-source pico8-web-emulator project by Brooklyn-Dev. It uses JavaScript and Fengari to run PICO-8 cartridge code in a browser.

The upstream web emulator currently has limited cartridge support, so this repository does not claim full PICO-8 compatibility.

## GitHub Pages

1. Open Settings -> Pages.
2. Select Deploy from a branch.
3. Select main and / (root).
4. Save.
5. Open the Pages URL GitHub gives you.

## Upstream emulator

https://github.com/Brooklyn-Dev/pico8-web-emulator

The upstream project is MIT licensed. Check it for current capabilities and limitations.

## Why not the official PICO-8 runtime?

This frontend intentionally does not bundle or require the paid/native PICO-8 executable. It uses a browser-based reimplementation instead.

## Cartridge compatibility

PICO-8 commonly uses .p8 and .p8.png cartridge formats, but compatibility depends on the emulator implementation. Some cartridges may use features that the reimplementation does not yet support.

Only use cartridges you are allowed to use.
