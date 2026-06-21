# 自建服务器部署指南（Contabo VPS）

从 Vercel 迁到你自己的 Contabo VPS。打法和服务器上现成的 **MailSort 一模一样**：
PM2 守护一个 Node 进程，绑定 `127.0.0.1`，OpenResty 在前面反代。

## 这个项目有多简单

先说结论，省得你担心：

- ❌ **不需要任何运行时环境变量** —— 代码里虽然引了 Supabase，但 `createClient()` 从没被调用过，所有数据来自 `src/lib/data/mockData.ts`。
- ❌ **没有数据库、没有 API 路由、没有 SSR 取数、没有后端依赖**。
- ✅ 本质是一个纯前端站点，构建后由一个极小的 Node 服务（Next.js standalone）托管。
- ✅ 内存占用很小，standalone 包仅约 66MB，启动 < 50ms。

> 唯一的「构建期」变量是 `NEXT_PUBLIC_SITE_URL`（你的域名），只影响分享卡片/OG 图的链接，不影响功能。见下文 `.env.deploy`。

## 架构

```
浏览器 ──HTTPS──▶ OpenResty(1Panel, 443) ──反代──▶ 127.0.0.1:3002 (PM2: node server.js)
                  ↑ 你在这里配域名+证书              ↑ 本应用，UFW 不开放此端口
```

端口规划（避开现有服务）：

| 端口 | 服务 |
|------|------|
| 3001 | MailSort（已占用）|
| **3002** | **本应用（新）** |
| 2026 | DeerFlow |
| 5678 | N8N |

如需改端口，改 `ecosystem.config.cjs` 里的 `PORT` 和 `deploy.sh` 顶部的 `PORT` 即可。

---

## 零、前提：先把部署文件推到 GitHub（一次性）

部署模型是「服务器 `git clone` 仓库 → 跑 `./deploy.sh`」，所以 `deploy.sh`、
`ecosystem.config.cjs`、`DEPLOY.md` 以及 `next.config.ts` / `layout.tsx` 的改动
**必须先提交并推到 GitHub**，否则服务器 clone 下来根本没有这些文件。

在本地仓库执行（或让我帮你做）：

```bash
git add deploy.sh ecosystem.config.cjs DEPLOY.md next.config.ts package.json \
        src/app/layout.tsx src/app/opengraph-image.tsx
git commit -m "chore: self-host deploy tooling (standalone + PM2)"
git push origin main
# 校验三件套都进版本库了：
git ls-files | grep -E "deploy.sh|ecosystem|DEPLOY"
```

> 如果你不想推到 GitHub，也可以改成 `scp` 把整个源码目录拷到服务器再构建——
> 但 clone 模型对后续更新最省事，推荐走 GitHub。

---

## 一、前置检查（在服务器上）

```bash
ssh -i ~/.ssh/id_ed25519 -p 2222 root@212.28.182.160

node -v     # 必须 >= 20.9.0（Next.js 16 要求；deploy.sh 也会硬校验）
pm2 -v      # MailSort 已在用，应该已装
git --version
```

**如果 Node 版本低于 20.9**，用 nvm 装一个新的（不影响系统 node）：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
nvm alias default 20
node -v   # 确认 v20.x
pm2 update # 让 pm2 用上新 node
```

---

## 二、首次部署

```bash
# 1. 拉代码到 /opt（和 /opt/mailsorter 同一约定）
cd /opt
git clone https://github.com/noique/silhouette-paradox.git
cd silhouette-paradox

# 2. 写入你的域名（用于 OG/分享卡片的绝对链接）。文件不入库，不会污染 git。
echo 'NEXT_PUBLIC_SITE_URL=https://你的域名' > .env.deploy

# 3. 一键部署：版本校验 → 同步源码 → 安装 → 构建 → 拷静态资源 → 起 PM2 → 健康检查
./deploy.sh

# 4. 设置开机自启（仅首次需要执行一次）
pm2 startup    # 复制它输出的那条命令再执行一次
pm2 save
```

`./deploy.sh` 跑完会自检：`page 200` + `css 200` + `og:img 200`，全绿就成了。

---

## 三、配置 OpenResty 反代（你来做）

应用现在跑在 `127.0.0.1:3002`，你把域名反代过去即可。

### 方式 A：1Panel 面板（推荐，你现在就是这么管的）

1. 1Panel → **网站** → 创建网站 → **反向代理**
2. 主域名：填你的域名（和 `.env.deploy` 里写的保持一致）
3. 代理目标：`http://127.0.0.1:3002`
4. 保存后在面板里给这个网站**申请 / 部署 HTTPS 证书**（Let's Encrypt 一键）

### 方式 B：手写 nginx location（如果你直接改配置文件）

```nginx
location / {
    proxy_pass         http://127.0.0.1:3002;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   Upgrade           $http_upgrade;
    proxy_set_header   Connection        "upgrade";
    proxy_read_timeout 300s;
}

# 可选：给 Next.js 不可变静态资源加长缓存，减轻 Node 压力
location /_next/static/ {
    proxy_pass http://127.0.0.1:3002;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

> 防火墙：**不要**在 UFW 开放 3002，它只走 loopback，由 OpenResty 内部访问（和 MailSort 的 3001 一致）。

---

## 四、后续更新（改完代码重新发布）

```bash
# 本地：改完代码推到 GitHub
git push origin main

# 服务器：一条命令
ssh -i ~/.ssh/id_ed25519 -p 2222 root@212.28.182.160
cd /opt/silhouette-paradox && ./deploy.sh
```

`deploy.sh` 的更新逻辑是 `git fetch + git reset --hard origin/<branch>`——
即**以 GitHub 为准、强制对齐**，幂等且不怕服务器上的本地残留。

> ⚠️ 因此：**不要直接在服务器上改被 git 跟踪的文件**（会被下次部署覆盖）。
> 唯一的本地配置 `.env.deploy` 不入库，所以是安全的。
> 重新发布时会有 ~1 秒的 502 抖动（单进程 reload 期间），低流量下基本无感。

---

## 五、为什么必须在服务器上构建（重要）

你的 Mac 是 **arm64**，服务器是 **x86_64**。Next.js 的编译器（SWC）和部分依赖是
**平台相关的原生二进制**。在 Mac 上构建再上传，服务器会因架构不匹配而崩。

所以流程是「把源码拉到服务器、在服务器上 `npm ci && npm run build`」。
你的服务器 8 核 / 24GB，构建几秒就好，完全无压力。

---

## 六、常用运维命令

```bash
pm2 status                              # 看进程状态
pm2 logs silhouette-paradox             # 看实时日志
pm2 logs silhouette-paradox --lines 100 # 看最近 100 行
pm2 restart silhouette-paradox          # 重启
pm2 stop silhouette-paradox             # 停止
pm2 delete silhouette-paradox           # 删除进程（重新部署用 ./deploy.sh）
curl -I http://127.0.0.1:3002/          # 本地探活
```

---

## 七、故障排查

| 现象 | 原因 / 解决 |
|------|------|
| 页面能开但**样式全乱 / 没图** | 静态资源没拷进 standalone。重跑 `./deploy.sh`（已内置 css 资源探针，正常会拦住这种情况）。 |
| `pm2 status` 里进程一直重启 | `pm2 logs silhouette-paradox` 看报错。最常见是 **Node 版本 < 20.9**，按第一节升级（deploy.sh 现在也会提前硬校验）。 |
| 启动报端口被占 | 3002 被别的进程占了。改 `ecosystem.config.cjs` 和 `deploy.sh` 的 `PORT`，重跑。 |
| OpenResty 502 | Node 进程没起来（`pm2 status` 确认）或反代目标端口写错（应为 `127.0.0.1:3002`）。重发布瞬间的短暂 502 属正常。 |
| `git reset --hard` 把我服务器上的改动冲掉了 | 这是设计行为：服务器是部署目标，所有改动应在本地改完推 GitHub。机器专属配置放 `.env.deploy`（不入库）。 |
| 分享到社交平台 OG 图/链接不对 | 检查 `.env.deploy` 的 `NEXT_PUBLIC_SITE_URL` 是否是真实域名，然后重跑 `./deploy.sh`（该变量在**构建时**写死）。 |
| `npm ci` 报 peer deps 冲突 | 仓库已带 `.npmrc`（`legacy-peer-deps=true`），正常不会触发；若手动装请加 `--legacy-peer-deps`。 |

---

## 速查

| 项 | 值 |
|------|------|
| 应用目录 | `/opt/silhouette-paradox` |
| 监听 | `127.0.0.1:3002` |
| 进程名 | `silhouette-paradox` |
| 进程管理 | PM2（`pm2 reload silhouette-paradox`）|
| 反代 | OpenResty（1Panel）→ `127.0.0.1:3002` |
| 部署/更新 | `cd /opt/silhouette-paradox && ./deploy.sh` |
| 机器专属配置 | `.env.deploy`（不入库，仅 `NEXT_PUBLIC_SITE_URL`）|
| 运行时环境变量 | 无（纯前端）|
