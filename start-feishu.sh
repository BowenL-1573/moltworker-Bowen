#!/bin/bash
# === Feishu Bridge (Hardened Mode) ===
echo "🚀 Booting Feishu Bridge..."
mkdir -p /root/feishu-bridge
cd /root/feishu-bridge

# 1. 源码同步
[ ! -d ".git" ] && git clone --depth 1 https://github.com/AlexAnys/feishu-openclaw . || git pull

# 2. 依赖安装
[ ! -d "node_modules" ] && npm install --no-audit --no-fund

# 3. 配置文件恢复逻辑 (双重保险)
# 如果本地没有 .env，尝试从挂载的 connect 桶恢复
if [ ! -f ".env" ] && [ -f "/data/connect/feishu-bridge/.env" ]; then
    cp /data/connect/feishu-bridge/.env .env
    echo "✅ Restored .env from connect bucket"
fi

# 4. 关键路径准备 (针对 bridge.mjs 的强依赖)
# 这一步解决了 [FATAL] Feishu App Secret not found 错误
mkdir -p /root/.clawdbot/secrets
if [ -n "$FEISHU_APP_SECRET" ]; then
    echo "$FEISHU_APP_SECRET" > /root/.clawdbot/secrets/feishu_app_secret
elif [ -f ".env" ]; then
    # 从 .env 中提取 Secret 并同步到文件系统供代码读取
    grep FEISHU_APP_SECRET .env | cut -d '=' -f 2 > /root/.clawdbot/secrets/feishu_app_secret
    echo "✅ Synced secret from .env to system path"
fi

# 5. 后台启动
export CLAWDBOT_CONFIG_PATH="/root/.openclaw/openclaw.json"
nohup node bridge.mjs > bridge.log 2>&1 &

echo "✅ Feishu Bridge is running. Log: /root/feishu-bridge/bridge.log"
