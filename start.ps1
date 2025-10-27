# Alpha Arena 项目启动脚本

Write-Host "🚀 启动 Alpha Arena 项目..." -ForegroundColor Green

# 检查 .env 文件
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  警告：backend/.env 文件不存在！" -ForegroundColor Red
    Write-Host "请先配置数据库连接信息" -ForegroundColor Yellow
    Write-Host "`n正在创建示例配置文件..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ 已创建 backend/.env 文件" -ForegroundColor Green
    Write-Host "请编辑 backend/.env 文件配置数据库信息" -ForegroundColor Yellow
    exit
}

Write-Host "`n🌐 正在启动后端和前端服务..." -ForegroundColor Cyan
Write-Host "后端 API: http://localhost:3000" -ForegroundColor White
Write-Host "前端应用: http://localhost:5173" -ForegroundColor White
Write-Host "`n按 Ctrl+C 停止服务" -ForegroundColor Yellow
Write-Host ""

# 启动服务
npm run dev

