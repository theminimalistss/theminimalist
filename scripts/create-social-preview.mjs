import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f4eee5"/>
<path d="M60 96H1140M60 535H1140" stroke="#cfc9bb"/>
<g fill="#1a3122">
<text x="60" y="67" font-family="Helvetica,Arial,sans-serif" font-size="20" letter-spacing="1">THE MINIMALIST</text>
<text x="60" y="267" font-family="Helvetica,Arial,sans-serif" font-size="89" letter-spacing="-4">Less, but</text>
<text x="60" y="374" font-family="Georgia,serif" font-style="italic" font-size="107" letter-spacing="-4">with feeling.</text>
<text x="60" y="574" font-family="Helvetica,Arial,sans-serif" font-size="14" letter-spacing="2">DESIGN STUDIO</text>
<text x="1140" y="574" text-anchor="end" font-family="Helvetica,Arial,sans-serif" font-size="14" letter-spacing="2">EST. 2020</text>
</g><g transform="translate(880 215) scale(.42) translate(-46 -134)" fill="none" stroke="#1a3122" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
<path d="M356 143 409 195 356 247 303 195Z"/>
<path d="M356 326Q300 280 262 256C252 250 244 256 244 270C242 470 290 560 356 592 448 637 607 450 652 400 660 390 654 378 637 377 602 374 542 376 502 380"/>
<path d="M315 368Q395 282 450 256C460 250 468 256 468 270C470 470 422 560 356 592 264 637 105 450 60 400 52 390 58 378 75 377 110 374 170 376 210 380"/>
</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/social-preview.png');
console.info('Created public/social-preview.png');
