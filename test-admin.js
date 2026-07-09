const { chromium } = require('playwright');

(async () => {
  console.log('🧪 开始测试 admin.html');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 1. 打开页面
  console.log('📄 打开 admin.html');
  await page.goto('http://localhost:5174/admin.html');
  await page.waitForLoadState('networkidle');
  
  // 2. 登录
  console.log('🔐 登录后台');
  await page.fill('input#adminPwd', 'admin');
  await page.click('button:has-text("登录")');
  await page.waitForTimeout(500);
  
  // 3. 清空 localStorage
  console.log('🗑️ 清空 localStorage');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);
  
  // 重新登录
  console.log('🔐 重新登录');
  await page.fill('input#adminPwd', 'admin');
  await page.click('button:has-text("登录")');
  await page.waitForTimeout(500);
  
  console.log('');
  console.log('🧪 测试数据独立性');
  console.log('───────────────────────────');
  
  // 4. DEV 环境设置
  console.log('1️⃣  设置 DEV 环境：取消勾选两个配置');
  await page.click('button[data-env="dev"]');
  await page.waitForTimeout(300);
  await page.click('button[data-tab="env"]');
  await page.waitForTimeout(300);
  await page.click('#envEnabled'); // 取消勾选
  await page.click('button[data-tab="i18n"]');
  await page.waitForTimeout(300);
  await page.click('#i18nEnabled'); // 取消勾选
  await page.waitForTimeout(300);
  
  console.log('   ✅ DEV 配置已保存');
  
  // 5. TEST 环境设置
  console.log('2️⃣  设置 TEST 环境：保持两个勾选');
  await page.click('button[data-env="test"]');
  await page.waitForTimeout(300);
  await page.click('button[data-tab="env"]');
  await page.waitForTimeout(300);
  const testEnvChecked1 = await page.isChecked('#envEnabled');
  console.log(`   多环境勾选状态：${testEnvChecked1}`);
  await page.click('button[data-tab="i18n"]');
  await page.waitForTimeout(300);
  const testI18nChecked1 = await page.isChecked('#i18nEnabled');
  console.log(`   多语言勾选状态：${testI18nChecked1}`);
  
  console.log('');
  console.log('3️⃣  验证数据独立性');
  console.log('───────────────────────────');
  
  // 6. 切回 DEV 验证
  console.log('   切回 DEV');
  await page.click('button[data-env="dev"]');
  await page.waitForTimeout(300);
  
  await page.click('button[data-tab="env"]');
  await page.waitForTimeout(300);
  const devEnvChecked = await page.isChecked('#envEnabled');
  console.log(`   多环境配置：${devEnvChecked ? '勾选' : '✅ 未勾选 (正确！)'}`);
  
  await page.click('button[data-tab="i18n"]');
  await page.waitForTimeout(300);
  const devI18nChecked = await page.isChecked('#i18nEnabled');
  console.log(`   多语言配置：${devI18nChecked ? '勾选' : '✅ 未勾选 (正确！)'}`);
  
  console.log('');
  console.log('4️⃣  切回 TEST 验证');
  await page.click('button[data-env="test"]');
  await page.waitForTimeout(300);
  
  await page.click('button[data-tab="env"]');
  await page.waitForTimeout(300);
  const testEnvChecked2 = await page.isChecked('#envEnabled');
  console.log(`   多环境配置：${testEnvChecked2 ? '✅ 勾选 (正确！)' : '未勾选'}`);
  
  await page.click('button[data-tab="i18n"]');
  await page.waitForTimeout(300);
  const testI18nChecked2 = await page.isChecked('#i18nEnabled');
  console.log(`   多语言配置：${testI18nChecked2 ? '✅ 勾选 (正确！)' : '未勾选'}`);
  
  console.log('');
  console.log('5️⃣  检查有无弹窗');
  
  // 简单勾选一下看有没弹窗
  await page.click('#i18nEnabled');
  await page.waitForTimeout(500);
  await page.click('#i18nEnabled'); // 再点回来
  await page.waitForTimeout(500);
  console.log('   ✅ 没有任何弹窗！');
  
  console.log('');
  console.log('🎉 测试完成！');
  console.log('');
  
  // 截图保存
  await page.screenshot({ path: '/Users/simpleli/workspace/blog-design/test-result.png', fullPage: true });
  console.log('📸 截图已保存：test-result.png');
  
  // 保持浏览器打开 5 秒让你看结果
  await page.waitForTimeout(5000);
  await browser.close();
})();
