#!/usr/bin/env bash
# Writes what the docs agent reads: an index of the commits in BASE..HEAD of
# the source checkout, and one patch per commit.
# Usage: prepare.sh <source checkout> <base sha> <head sha> <output dir>
set -euo pipefail

src="$1"
base="$2"
head="$3"
out="$4"

# Noise that never changes what the docs should say.
exclude=(
  ':(exclude)*package-lock.json'
  ':(exclude)*.test.*'
  ':(exclude)*.snap'
  ':(exclude)*.png'
  ':(exclude)*.jpg'
  ':(exclude)*.webp'
  ':(exclude)*.svg'
  ':(exclude)*.zip'
  ':(exclude)*.sha256'
)

rm -rf "$out/commits" "$out/commits.md"
mkdir -p "$out/commits"

{
  echo "# Commits on ${head:0:7} since ${base:0:7}, oldest first"
  echo
} > "$out/commits.md"

n=0
# --first-parent: a merge into main is read as one change, diffed against main.
for sha in $(git -C "$src" rev-list --reverse --first-parent "$base..$head"); do
  n=$((n + 1))
  file="$(printf '%04d' "$n")-${sha:0:7}.patch"
  {
    echo "## commits/$file"
    echo
    git -C "$src" show -s --format='%s%n%n%b' "$sha"
    echo '```'
    git -C "$src" diff --stat=120 "$sha^1" "$sha" -- . "${exclude[@]}"
    echo '```'
    echo
  } >> "$out/commits.md"
  git -C "$src" diff "$sha^1" "$sha" -- . "${exclude[@]}" > "$out/commits/$file"
done

echo "$n"
