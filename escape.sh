#!/bin/bash
# 查找所有 Markdown 文件并替换 'fs' 为 'f_s'
find content -name "*.md" -type f -exec sed -i 's/fs/f_s/g' {} \;
