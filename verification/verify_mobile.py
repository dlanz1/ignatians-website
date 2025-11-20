from playwright.sync_api import sync_playwright

def verify_mobile_visuals():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        # Create a context with mobile viewport
        context = browser.new_context(
            viewport={'width': 375, 'height': 667},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        )
        page = context.new_page()

        try:
            # Navigate to local dev server
            # Assuming Vite runs on 5173 by default
            page.goto("http://localhost:5173")

            # Wait for content to load
            page.wait_for_timeout(2000) # Wait for initial load

            # 1. Capture Header
            page.screenshot(path="verification/mobile_header.png")
            print("Captured header screenshot")

            # 2. Trigger Toast Notification (Simulate sign up or check if there's a way to trigger it)
            # We can't easily trigger it without interacting.
            # Let's try to click a card to open modal, then click sign up to trigger 'Name required' or something?
            # Or injecting the notification state if possible, but we can't easily access React state from outside.
            # We can simulate a sign up failure (empty name).

            # Find a placement card
            # Wait for placements to load
            page.wait_for_selector(".placement-card-compact", timeout=5000)
            cards = page.locator(".placement-card-compact").all()
            if cards:
                cards[0].click()
                # Wait for modal
                page.wait_for_selector(".placement-modal-content.visible")

                # Click Sign Up in modal
                # Depending on state, button might say "Sign Up"
                sign_up_btn = page.get_by_role("button", name="Sign Up")
                if sign_up_btn.is_visible():
                    sign_up_btn.click()

                    # Wait for confirm modal
                    page.wait_for_selector("form")

                    # Click Confirm without name -> should trigger error toast?
                    # The code says: if (!studentName.trim()) return; -> it just returns, no toast.
                    # Wait, let's check the code.
                    # const handleConfirmSignUp = async (e) => { e.preventDefault(); if (!studentName.trim()) return; ... }
                    # So empty name does nothing.

                    # Okay, we need to mock the dataService or inject a notification.
                    # Or we can just inspect the CSS changes we make without triggering the toast visually in the "before" state if we can't trigger it.
                    # But we can trigger a success toast if we actually sign up. But we don't want to pollute DB.

                    pass

            # 3. Check Dark Mode
            # Change color scheme to dark
            page.emulate_media(color_scheme='dark')
            page.reload()
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/mobile_dark_mode.png")
            print("Captured dark mode screenshot")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_mobile_visuals()
