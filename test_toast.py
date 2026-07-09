from playwright.sync_api import sync_playwright
import time

# 测试 Toast 功能
print("=== Toast 功能测试 ===\n")

try:
    with sync_playwright() as p:
        print("1. 启动浏览器...")
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("2. 访问管理后台...")
        page.goto('http://localhost:5174/admin.html')
        page.wait_for_load_state('networkidle')
        
        print("3. 登录...")
        page.fill('input[type="password"]', 'admin')
        page.click('button:has-text("登录")')
        page.wait_for_timeout(1000)
        
        print("4. 切换到多环境标签...")
        page.click('button[data-tab="env"]')
        page.wait_for_timeout(500)
        
        print("5. 勾选复选框，触发保存...")
        checkbox = page.locator('#envEnabled')
        current_state = checkbox.is_checked()
        checkbox.click()
        page.wait_for_timeout(1000)
        
        print("6. 检查是否有 Toast 弹窗...")
        toasts = page.locator('.toast')
        toast_count = toasts.count()
        print(f"   找到 {toast_count} 个 Toast")
        
        for i in range(toast_count):
            toast_text = toasts.nth(i).text_content().strip()
            print(f"   内容: {toast_text}")
        
        print("\n7. 截图保存...")
        page.screenshot(path='/Users/simpleli/workspace/blog-design/test_toast.png', full_page=True)
        print("   截图已保存到 test_toast.png")
        
        print("\n8. 验证多环境隔离...")
        page.click('button[data-env="dev"]')
        page.wait_for_timeout(800)
        page.click('button[data-tab="env"]')
        page.wait_for_timeout(800)
        dev_state = page.locator('#envEnabled').is_checked()
        print(f"   DEV 环境选中状态: {dev_state}")
        
        print("\n9. 切换到 TEST 环境...")
        page.click('button[data-env="test"]')
        page.wait_for_timeout(800)
        page.click('button[data-tab="env"]')
        page.wait_for_timeout(800)
        test_state = page.locator('#envEnabled').is_checked()
        print(f"   TEST 环境选中状态: {test_state}")
        
        print("\n=== 测试完成 ===")
        
        print("\n等待 5 秒后关闭...")
        time.sleep(5)
        browser.close()
        
except Exception as e:
    print(f"\n❌ 测试出错: {e}")
    import traceback
    traceback.print_exc()