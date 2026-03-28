#!/bin/bash

REPO="/Users/junseungmo/Documents/03_Resources/repos/random-siktag"

rm -rf "$REPO/.next"

BUILD_TARGET=ait npx next build
