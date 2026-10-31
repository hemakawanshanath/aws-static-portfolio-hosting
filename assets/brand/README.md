# Portfolio identity

The logo is a simple pastel-green H, following the supplied reference. The sharing card combines it with a branching connection motif in the forest/pastel-green palette.

- favicon.svg: scalable browser icon.
- favicon.png: 32px fallback.
- apple-touch-icon.png: 180px home-screen icon.
- social-preview.png: 1200 × 630 sharing artwork.

Once you have a public URL, run `node scripts/configure-sharing.mjs https://your-domain.example/` from the project folder, replacing the example with your real address (include a project subdirectory if applicable). Publish the updated HTML and assets together. Social preview crawlers require a publicly reachable image and absolute metadata URLs; local previews cannot verify social-platform rendering.

The contact form prepares a mail draft. Visitors review and send it in their own email app. Copy message is a fallback; no form provider, account, or server is required. Direct delivery from the website would require a mail service or backend.
