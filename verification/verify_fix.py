from playwright.sync_api import sync_playwright, expect
import time

def verify_flicker_fix(page):
    print("Navigating to home page...")
    page.goto("http://localhost:5173")

    # Wait for the placements to load
    print("Waiting for placements to load...")
    page.wait_for_selector(".placement-card-compact", timeout=10000)

    # Get the first placement card
    first_card = page.locator(".placement-card-compact").first

    print("Attempting Scenario A: Click Open -> Click Close Immediately")

    # Pre-locate the close button. It doesn't exist yet, so we define the locator.
    close_button = page.locator(".placement-modal-close")
    modal_content = page.locator(".placement-modal-content")

    # Click to open
    first_card.click()

    # Immediately try to close.
    # We assume the modal renders fast enough that the close button is clickable.
    # If not, we might miss the 10ms window, but let's try.
    close_button.click()

    print("Close clicked. Waiting 100ms to check state...")
    time.sleep(0.1)

    # Check visibility.
    # We expect the element to still be in DOM (because of 300ms close timer).
    # If the fix works, it should NOT have "visible" class.
    # If the bug exists, it might have "visible" class (because open timer fired late).

    if modal_content.count() > 0:
        is_visible_class = "visible" in modal_content.get_attribute("class")
        print(f"Is visible class present? {is_visible_class}")

        if is_visible_class:
            print("BUG DETECTED: Modal has 'visible' class after immediate close!")
        else:
            print("SUCCESS: Modal does not have 'visible' class.")
    else:
        print("Element already removed from DOM (Timer fired early or close click delayed).")

    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_flicker_fix(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
