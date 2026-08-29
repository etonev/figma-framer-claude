const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();

  // MOBILE viewport
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('https://intelligent-gecko-264478.framer.app/', { waitUntil: 'networkidle' });

  // Extract fixed bottom bar button details
  const bottomBarDetails = await mobilePage.evaluate(() => {
    const fixedEls = [];
    document.querySelectorAll('*').forEach(el => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' && s.bottom === '0px' && parseInt(s.height) > 50 && parseInt(s.height) < 100) {
        // Get all buttons/links inside
        const buttons = el.querySelectorAll('a, button, [role="button"]');
        const btnDetails = [];
        buttons.forEach(btn => {
          const bs = getComputedStyle(btn);
          btnDetails.push({
            text: btn.textContent?.trim().substring(0, 100),
            backgroundColor: bs.backgroundColor,
            color: bs.color,
            border: bs.border,
            borderRadius: bs.borderRadius,
            fontSize: bs.fontSize,
            fontWeight: bs.fontWeight,
            fontFamily: bs.fontFamily,
            padding: bs.padding,
            width: bs.width,
            height: bs.height,
            display: bs.display
          });
        });

        fixedEls.push({
          backgroundColor: s.backgroundColor,
          height: s.height,
          padding: s.padding,
          boxShadow: s.boxShadow,
          borderTop: s.borderTop,
          buttons: btnDetails
        });
      }
    });
    return fixedEls;
  });

  console.log('=== MOBILE BOTTOM BAR DETAILS ===');
  console.log(JSON.stringify(bottomBarDetails, null, 2));

  // Extract section-by-section comparison data for mobile
  const mobileData = await mobilePage.evaluate(() => {
    const results = {};

    // Get all major sections by scrolling through and checking backgrounds
    const sections = [];
    for (let y = 0; y < document.body.scrollHeight; y += 200) {
      const el = document.elementFromPoint(187, Math.min(y, 800));
      if (el) {
        let section = el;
        // Walk up to find the section-level element
        while (section.parentElement && section.parentElement !== document.body && section.parentElement.tagName !== 'MAIN') {
          section = section.parentElement;
        }
        const s = getComputedStyle(section);
        const rect = section.getBoundingClientRect();
        const key = `y${Math.round(rect.top + window.scrollY)}`;
        if (!sections.find(x => x.key === key)) {
          sections.push({
            key,
            tag: section.tagName,
            bg: s.backgroundColor,
            top: Math.round(rect.top + window.scrollY),
            height: Math.round(rect.height)
          });
        }
      }
      window.scrollTo(0, y);
    }

    // Reset scroll
    window.scrollTo(0, 0);

    return { sections };
  });

  console.log('=== MOBILE SECTIONS ===');
  console.log(JSON.stringify(mobileData.sections?.slice(0, 20), null, 2));

  // DESKTOP viewport - compare specific element styles
  await mobilePage.setViewportSize({ width: 1440, height: 900 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await mobilePage.waitForTimeout(500);

  const desktopDetails = await mobilePage.evaluate(() => {
    const results = {};

    // Hero badge/pill
    const allEls = document.querySelectorAll('*');

    // Find the "$150" text elements
    for (const el of allEls) {
      const text = el.textContent?.trim();
      if (text && text.includes('$150') && el.children.length === 0 && text.length < 50) {
        const s = getComputedStyle(el);
        results['$150_text_' + text.substring(0, 30)] = {
          color: s.color,
          fontWeight: s.fontWeight,
          fontSize: s.fontSize
        };
      }
    }

    // Find step number indicators (1, 2, 3)
    for (const el of allEls) {
      const text = el.textContent?.trim();
      if (['1', '2', '3'].includes(text) && el.children.length === 0) {
        const s = getComputedStyle(el);
        const ps = getComputedStyle(el.parentElement);
        if (parseInt(s.fontSize) > 14) {
          results['step_' + text] = {
            color: s.color,
            bg: ps.backgroundColor,
            borderRadius: ps.borderRadius,
            width: ps.width,
            height: ps.height
          };
        }
      }
    }

    // Find CTA banner buttons
    // Look for the dark-green CTA section
    for (const el of allEls) {
      const s = getComputedStyle(el);
      const bg = s.backgroundColor;
      if (bg === 'rgb(32, 76, 67)' || bg === 'rgb(27, 67, 50)' || bg === 'rgb(52, 58, 64)') {
        // Found a dark section - check buttons inside
        const btns = el.querySelectorAll('a, button');
        btns.forEach((btn, i) => {
          const bs = getComputedStyle(btn);
          if (parseInt(bs.width) > 100) {
            results['cta_btn_' + i] = {
              text: btn.textContent?.trim().substring(0, 50),
              bg: bs.backgroundColor,
              color: bs.color,
              border: bs.border,
              borderRadius: bs.borderRadius
            };
          }
        });
      }
    }

    // Check navbar height and styling
    const nav = document.querySelector('nav') || document.querySelector('[class*="nav"]');
    if (nav) {
      const ns = getComputedStyle(nav);
      results['navbar'] = {
        bg: ns.backgroundColor,
        height: ns.height,
        position: ns.position
      };
    }

    // Check testimonial section
    for (const el of allEls) {
      if (el.textContent?.includes('Hear what thousands') && el.tagName.match(/H[1-6]/)) {
        const s = getComputedStyle(el);
        results['testimonial_heading'] = {
          color: s.color,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight
        };
        // Parent section bg
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          const ps = getComputedStyle(parent);
          if (ps.backgroundColor !== 'rgba(0, 0, 0, 0)' && ps.backgroundColor !== 'transparent') {
            results['testimonial_section_bg'] = ps.backgroundColor;
            break;
          }
          parent = parent.parentElement;
        }
      }
    }

    return results;
  });

  console.log('=== DESKTOP DETAILS ===');
  console.log(JSON.stringify(desktopDetails, null, 2));

  // Take section-level desktop screenshots for comparison
  // Scroll through each section and take screenshots
  const sectionNames = ['hero', 'what-is', 'earn-150', 'not-sure-tech', 'trusted-care', 'testimonials', 'cta-banner', 'faq', 'footer'];

  for (let i = 0; i < 9; i++) {
    await mobilePage.evaluate((scrollY) => window.scrollTo(0, scrollY), i * 800);
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({
      path: `/Users/alexandersivura/Developer/repos/figma-framer-claude/screenshots/r13-framer-desktop-${sectionNames[i]}.png`
    });
  }

  console.log('Section screenshots saved');

  await browser.close();
})();
