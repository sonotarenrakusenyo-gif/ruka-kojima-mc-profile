#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

SCOPE="sonotarenrakusenyo-5347s-projects"
REPO="ruka-kojima-mc-profile"

echo "==> GitHub: create repo (skip if exists)"
TOKEN=$(git credential-osxkeychain get <<< $'protocol=https\nhost=github.com\n' 2>/dev/null | awk -F= '/^password=/{print $2}')
HTTP_CODE=$(curl -sS -o /tmp/gh-create-repo.json -w "%{http_code}" -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/user/repos" \
  -d "{\"name\":\"${REPO}\",\"description\":\"小島瑠夏 MC 公式プロフィールサイト\",\"private\":false}")
echo "GitHub API status: ${HTTP_CODE}"
python3 -c "import json; d=json.load(open('/tmp/gh-create-repo.json')); print(d.get('html_url') or d.get('message',''))"

echo "==> Git push"
git push -u origin main

echo "==> Vercel deploy"
vercel link --yes --scope "${SCOPE}"
vercel --yes --prod --scope "${SCOPE}"

echo "Done."
