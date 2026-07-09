from playwright.sync_api import sync_playwright

# Test: Verify per-environment config isolation
def test_env_config_isolation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Login first
        page.goto('http://localhost:5174/admin.html')
        page.wait_for_load_state('networkidle')
        page.fill('input[type="password"]', 'admin')
        page.click('button:has-text("登录")')
        page.wait_for_timeout(500)

        # Setup dialog handler
        page.on('dialog', lambda d: d.accept())

        print("=== Test: Per-Environment Config Isolation ===\n")

        # Helper to toggle and save env config
        def toggle_and_save(target_enabled):
            page.click('button[data-tab="env"]')
            page.wait_for_timeout(500)
            page.wait_for_selector('#envEnabled')
            checkbox = page.locator('#envEnabled')
            if checkbox.is_checked() != target_enabled:
                checkbox.click()
            page.evaluate('saveEnvConfig()')
            page.wait_for_timeout(300)
            return checkbox.is_checked()

        # Step 1: DEV - disable
        print("1. DEV: disable env switcher")
        page.click('button[data-env="dev"]')
        page.wait_for_timeout(1000)
        page.click('button[data-tab="env"]')
        page.wait_for_timeout(500)
        page.wait_for_selector('#envEnabled')
        dev1 = toggle_and_save(False)
        print(f"   DEV envEnabled = {dev1} (expected: False)")

        # Step 2: TEST - enable
        print("2. TEST: enable env switcher")
        page.click('button[data-env="test"]')
        page.wait_for_timeout(1000)
        page.click('button[data-tab="env"]')
        page.wait_for_timeout(500)
        page.wait_for_selector('#envEnabled')
        test1 = toggle_and_save(True)
        print(f"   TEST envEnabled = {test1} (expected: True)")

        # Step 3: DEV - verify still disabled
        print("3. DEV: verify config independent")
        page.click('button[data-env="dev"]')
        page.wait_for_timeout(1000)
        page.click('button[data-tab="env"]')
        page.wait_for_timeout(500)
        page.wait_for_selector('#envEnabled')
        dev2 = page.locator('#envEnabled').is_checked()
        print(f"   DEV envEnabled = {dev2} (expected: False)")

        # Step 4: TEST - verify still enabled
        print("4. TEST: verify config independent")
        page.click('button[data-env="test"]')
        page.wait_for_timeout(1000)
        page.click('button[data-tab="env"]')
        page.wait_for_timeout(500)
        page.wait_for_selector('#envEnabled')
        test2 = page.locator('#envEnabled').is_checked()
        print(f"   TEST envEnabled = {test2} (expected: True)")

        # Step 5: Verify localStorage keys
        print("\n5. localStorage keys:")
        dev_raw = page.evaluate("localStorage.getItem('toast_blog_env_config_dev')")
        test_raw = page.evaluate("localStorage.getItem('toast_blog_env_config_test')")
        print(f"   DEV: {dev_raw}")
        print(f"   TEST: {test_raw}")

        # Result
        print("\n=== Result ===")
        passed = (dev1 == False) and (test1 == True) and (dev2 == False) and (test2 == True)
        if passed:
            print("✅ PASS: Per-environment config isolation works!")
        else:
            print("❌ FAIL")
            print(f"   DEV1={dev1} TEST1={test1} DEV2={dev2} TEST2={test2}")

        page.screenshot(path='/Users/simpleli/workspace/blog-design/test-env-isolation.png', full_page=True)
        browser.close()
        return passed

if __name__ == '__main__':
    test_env_config_isolation()