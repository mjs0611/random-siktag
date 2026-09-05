#!/bin/bash

REPO="$(cd "$(dirname "$0")/.." && pwd)"  # 스크립트 위치 기준 (복사본에서도 동작)

rm -rf "$REPO/.next"
rm -rf "$REPO/out"

BUILD_TARGET=ait npx next build
