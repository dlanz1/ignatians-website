
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # iPhone 12 viewport
        context = browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            color_scheme='dark' # Force dark mode
        )

        page = context.new_page()

        # Navigate to board view
        page.goto("http://localhost:5173/board")

        # Wait for table
        page.wait_for_selector('table')

        # 1. Take screenshot of initial state (Dark Mode + Action Menu Button)
        os.makedirs('verification', exist_ok=True)
        page.screenshot(path="verification/mobile_fix_dark.png")
        print("Screenshot captured at verification/mobile_fix_dark.png")

        # 2. Click the menu button on the first row
        # Find the first row's menu button. It should be visible in mobile view.
        # The class is .mobile-only inside the td.
        # We can target the MoreVertical icon's parent button.

        # Wait for a bit for any layout shifts
        page.wait_for_timeout(500)

        # Click the first "more" button
        # The first button in the actions column for mobile
        # The actions column is the last td.
        # Let's locate specifically.

        menu_btn = page.locator("table tbody tr:first-child td:last-child .mobile-only button")
        menu_btn.click()

        # Wait for menu to appear
        page.wait_for_timeout(500)

        # 3. Take screenshot with menu open
        page.screenshot(path="verification/mobile_fix_menu_open.png")
        print("Screenshot captured at verification/mobile_fix_menu_open.png")

        browser.close()

if __name__ == "__main__":
    run()
