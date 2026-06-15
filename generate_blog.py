import os

OUT = '/Users/simpleli/workspace/blog-design/index.html'

def w(part):
    with open(OUT, 'a') as f:
        f.write(part)

# Start fresh
with open(OUT, 'w') as f:
    f.write('')

# ── Head ──────────────────────────────────────
w('''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>个人博客 · 作品与技术</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
''')
print("head done")
