# Alpha Arena 项目安装脚本

Write-Host "🚀 开始安装 Alpha Arena 项目依赖..." -ForegroundColor Green

# 安装后端依赖
Write-Host "`n📦 安装后端依赖..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# 安装前端依赖
Write-Host "`n📦 安装前端依赖..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "`n✅ 所有依赖安装完成！" -ForegroundColor Green
Write-Host "`n📝 接下来的步骤:" -ForegroundColor Cyan
Write-Host "1. 创建 PostgreSQL 数据库" -ForegroundColor White
Write-Host "2. 配置 backend/.env 文件" -ForegroundColor White
Write-Host "3. 运行 npm run dev 启动项目" -ForegroundColor White
Write-Host "`n查看 QUICKSTART.md 了解更多详情" -ForegroundColor Yellow

