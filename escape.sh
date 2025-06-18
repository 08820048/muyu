#!/bin/bash

# 预处理 Markdown 文件，解决 Zola 模板语法冲突问题
# 这个脚本会处理 content 目录下的所有 .md 文件

echo "开始预处理 Markdown 文件..."

# 检测操作系统类型
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS 需要 -i '' 参数
    find content -name "*.md" -type f -exec sed -i '' \
      -e 's/fs/f_s/g' \
      -e 's/{{/{ {/g' \
      -e 's/}}/} }/g' \
      -e 's/{%/{ %/g' \
      -e 's/%}/% }/g' \
      {} \;
else
    # Linux 使用 -i 参数
    find content -name "*.md" -type f -exec sed -i \
      -e 's/fs/f_s/g' \
      -e 's/{{/{ {/g' \
      -e 's/}}/} }/g' \
      -e 's/{%/{ %/g' \
      -e 's/%}/% }/g' \
      {} \;
fi

echo "Markdown 文件预处理完成！"
