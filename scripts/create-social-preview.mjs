import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f4eee5"/>
<path d="M60 96H1140M60 535H1140" stroke="#cfc9bb"/>
<g fill="#1a3122">
<text x="60" y="67" font-family="Helvetica,Arial,sans-serif" font-size="20" letter-spacing="1">THE MINIMALIST</text>
<text x="60" y="267" font-family="Helvetica,Arial,sans-serif" font-size="89" letter-spacing="-4">Less, but</text>
<text x="60" y="374" font-family="Georgia,serif" font-style="italic" font-size="107" letter-spacing="-4">with feeling.</text>
<text x="60" y="574" font-family="Helvetica,Arial,sans-serif" font-size="14" letter-spacing="2">INDEPENDENT DESIGN STUDIO</text>
<text x="1140" y="574" text-anchor="end" font-family="Helvetica,Arial,sans-serif" font-size="14" letter-spacing="2">EST. 2020</text>
</g><g transform="translate(930 190) scale(5.5)" fill="none" stroke="#1a3122" stroke-width=".7">
<path d="M17 35V8m0 17C8 23 7 14 9 9c8 3 11 9 8 16Zm0-5c8-2 10-10 8-15-7 3-10 9-8 15ZM17 35C5 34 2 28 2 22c8 0 14 4 15 13Zm0 0c11-1 15-8 15-14-8 1-14 6-15 14Z"/>
</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/social-preview.png');
console.info('Created public/social-preview.png');
