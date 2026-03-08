#!/bin/bash
#
# 数感乐园生产环境管理脚本
# 管理运行在端口3001上的生产服务器
#

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$PROJECT_DIR/.production.pid"
LOG_FILE="$PROJECT_DIR/server.log"
PORT=3001

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查服务器是否在运行
is_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0  # 运行中
        else
            rm -f "$PID_FILE"  # 清理无效的PID文件
            return 1
        fi
    fi
    return 1
}

# 获取当前运行的服务器PID
get_running_pid() {
    ss -tlnp 2>/dev/null | grep ":$PORT" | awk '{print $NF}' | cut -d= -f2 | cut -d, -f1 | head -1
}

case "$1" in
    start)
        if is_running; then
            warning "生产服务器已经在运行 (PID: $(cat "$PID_FILE"))"
            exit 0
        fi

        # 检查端口是否被占用
        if ss -tlnp 2>/dev/null | grep -q ":$PORT"; then
            error "端口 $PORT 已被占用"
            exit 1
        fi

        info "启动生产服务器 (端口: $PORT)..."

        # 构建项目（如果dist目录不存在）
        if [ ! -d "dist" ]; then
            info "构建生产版本..."
            npm run build
        fi

        # 启动服务器
        PORT=$PORT nohup node server.js > "$LOG_FILE" 2>&1 &
        SERVER_PID=$!

        # 保存PID
        echo "$SERVER_PID" > "$PID_FILE"

        # 等待服务器启动
        sleep 3

        # 检查服务器是否启动成功
        if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" | grep -q "200"; then
            success "生产服务器启动成功!"
            info "PID: $SERVER_PID"
            info "日志文件: $LOG_FILE"
            info "访问地址: http://localhost:$PORT"
            info "网络地址: http://$(hostname -I | awk '{print $1}'):$PORT"
        else
            error "服务器启动失败，请检查日志: $LOG_FILE"
            rm -f "$PID_FILE"
            exit 1
        fi
        ;;

    stop)
        if ! is_running; then
            # 尝试通过端口查找进程
            port_pid=$(get_running_pid)
            if [ -n "$port_pid" ]; then
                info "通过端口找到运行中的服务器 (PID: $port_pid)，正在停止..."
                kill "$port_pid"
                sleep 2
                success "服务器已停止"
                exit 0
            else
                warning "生产服务器未在运行"
                exit 0
            fi
        fi

        pid=$(cat "$PID_FILE")
        info "停止生产服务器 (PID: $pid)..."

        kill "$pid"
        sleep 2

        # 检查是否成功停止
        if ps -p "$pid" > /dev/null 2>&1; then
            warning "服务器未正常停止，强制终止..."
            kill -9 "$pid"
            sleep 1
        fi

        rm -f "$PID_FILE"
        success "服务器已停止"
        ;;

    restart)
        $0 stop
        sleep 2
        $0 start
        ;;

    status)
        if is_running; then
            pid=$(cat "$PID_FILE")
            success "生产服务器运行中 (PID: $pid)"
            info "端口: $PORT"
            info "启动时间: $(ps -p "$pid" -o lstart= 2>/dev/null || echo "未知")"
            info "内存使用: $(ps -p "$pid" -o rss= 2>/dev/null) KB"

            # 检查服务是否可访问
            if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" | grep -q "200"; then
                info "服务状态: ✅ 可访问"
            else
                warning "服务状态: ⚠️ 运行中但不可访问"
            fi

            info "访问地址: http://localhost:$PORT"
        else
            # 检查端口是否被占用（可能由其他进程启动）
            port_pid=$(get_running_pid)
            if [ -n "$port_pid" ]; then
                warning "端口 $PORT 被进程占用 (PID: $port_pid)，但未使用本脚本管理"
                info "可能是手动启动的服务器或其他应用"
            else
                info "生产服务器未在运行"
            fi
        fi
        ;;

    logs)
        if [ ! -f "$LOG_FILE" ]; then
            error "日志文件不存在: $LOG_FILE"
            exit 1
        fi

        case "$2" in
            tail)
                info "实时查看日志 (Ctrl+C 退出)..."
                tail -f "$LOG_FILE"
                ;;
            error)
                info "查看错误日志..."
                grep -i "error\|warn\|fail\|exception" "$LOG_FILE" | tail -50
                ;;
            *)
                info "查看完整日志..."
                cat "$LOG_FILE" | tail -100
                ;;
        esac
        ;;

    build)
        info "构建生产版本..."
        npm run build
        success "构建完成"
        ;;

    help|--help|-h)
        echo "数感乐园生产环境管理脚本"
        echo ""
        echo "使用方法: $0 {start|stop|restart|status|logs|build|help}"
        echo ""
        echo "命令:"
        echo "  start     启动生产服务器 (端口: 3001)"
        echo "  stop      停止生产服务器"
        echo "  restart   重启生产服务器"
        echo "  status    查看服务器状态"
        echo "  logs      查看日志 (可选: tail, error)"
        echo "  build     重新构建生产版本"
        echo "  help      显示此帮助信息"
        echo ""
        echo "示例:"
        echo "  $0 start          # 启动服务器"
        echo "  $0 logs tail      # 实时查看日志"
        echo "  $0 status         # 查看服务器状态"
        echo ""
        echo "访问地址:"
        echo "  - 本地: http://localhost:3001"
        echo "  - 网络: http://$(hostname -I | awk '{print $1}'):3001"
        ;;

    *)
        echo "未知命令: $1"
        echo "使用: $0 {start|stop|restart|status|logs|build|help}"
        exit 1
        ;;
esac