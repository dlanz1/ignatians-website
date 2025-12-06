
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

        # Screenshot
        os.makedirs('verification', exist_ok=True)
        page.screenshot(path="verification/repro_mobile_dark.png")

        print("Screenshot captured at verification/repro_mobile_dark.png")

        browser.close()

if __name__ == "__main__":
    run()
