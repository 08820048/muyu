#!/bin/bash

# 开发环境启动脚本
# 使用本地base_url启动zola开发服务器

echo "🚀 启动Zola开发服务器..."
echo "📍 本地访问地址: http://127.0.0.1:1111"
echo "📍 局域网访问地址: http://0.0.0.0:1111"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

zola serve --interface 0.0.0.0 --port 1111
