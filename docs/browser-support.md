# Browser support

The supported audience is current Chrome/Edge, Firefox, and Safari, including
iOS Safari. Universal compatibility with every obsolete browser or embedded web
view is not a release claim. JavaScript must be enabled.

| Engine   | Verification                                                                  |
| -------- | ----------------------------------------------------------------------------- |
| Chromium | Production browser suite locally and in Linux CI; Edge shares this engine     |
| WebKit   | Desktop and iPhone-profile production tests locally and in CI                 |
| Firefox  | Linux CI; the installed Playwright binary cannot launch on this macOS version |

The Vite targets (Chrome/Edge 90, Firefox 90, Safari 15, ES2020) control generated
syntax. They do not establish complete application support on those old versions.
Emulated iPhone tests do not replace checks on real iOS hardware or in-app browsers.

## Progressive behavior

- Missing/lost WebGL retains static illustrations or native portfolio media.
- Missing View Transitions uses normal navigation and existing fades.
- Reduced motion keeps galleries and content usable without automatic playback.
- Contact selected states use attributes and native focus rather than `:has()`;
  collapsed channel links have explicit ARIA/tab-order state alongside `inert`.
- Contact and Products include viewport-height and palette fallbacks before their
  small-viewport units and mixed colours. Older engines may switch grid layouts
  instantly rather than interpolate them.
- Contact copying checks the Clipboard API and handles denial with a selectable
  message. Clipboard writes require a secure context and may require permission
  or user activation; see [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).
- The form opens a mail app, which the visitor must use to send the email. A
  manual-copy message supports visitors without a mail handler; no backend receipt
  or successful delivery is asserted.

Before hosting publication, verify direct route refreshes, touch controls,
reduced motion, blocked clipboard/WebGL, and mail-app hand-off on representative
real devices. See [deployment](deployment.md) and [testing](testing.md).
