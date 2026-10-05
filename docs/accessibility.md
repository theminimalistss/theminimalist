# Accessibility

The hero includes a main landmark, page heading, skip link, named controls,
visible focus, project metadata as text, and a persistent pause control. Images
have meaningful alternative text. Silent video enhances an equivalent poster;
no information requires audio.

Tabbing into a moving study foregrounds and pauses it. Gallery view offers a
stationary alternative. Native dialogs provide focus containment and Escape,
visible close buttons, and focus restoration. The menu exposes implemented views.

Every page shares the header, menu, and footer sitemap. Navigation landmarks are
named (Primary, Site, Footer, Breadcrumb, section tabs) and mark the current page
with `aria-current`. After a route change the page scrolls to the top and focus
moves to `#main-content`, including after navigating from the menu.

The loader is a polite status region and the page behind it stays `inert` until
ready. The menu keeps native dialog focus handling; Escape and Close play the
morph out and then restore focus to the menu button.

`prefers-reduced-motion: reduce` selects a normal, fully discoverable gallery,
disables automatic video playback, shows a static loader, opens the menu without
a morph, and removes secondary transitions and their delays. Preference
changes are handled live. Explicit pause stops movement and video; hidden tabs
also suspend work.

Interface text uses Moss Ink on Soft Ivory. Media has restrained contrast scrims
and project-specific dark text for light studies. Automated axe scans run on both
browser projects; they do not replace screen-reader and image-contrast review
after content changes.
