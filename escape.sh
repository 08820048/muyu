#!/bin/bash
# 查找所有 Markdown 文件并处理可能导致宏定义错误的内容
find content -name "*.md" -type f -exec sed -i \
  -e 's/fs/f_s/g' \
  -e 's/{{/{ {/g' \
  -e 's/}}/} }/g' \
  -e 's/{%/{ %/g' \
  -e 's/%}/% }/g' \
{} \;
