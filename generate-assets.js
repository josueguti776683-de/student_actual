import sharp from 'sharp';
import fs from 'fs';

async function generate() {
  console.log('--- Iniciando Renderizador de Activos de Interfaz ---');

  try {
    const svgPath = './public/icon.svg';
    if (!fs.existsSync(svgPath)) {
      throw new Error('No se encontró el archivo /public/icon.svg en el directorio público.');
    }
    const svgBuffer = fs.readFileSync(svgPath);

    // 1. Icono estándar 192x192
    await sharp(svgBuffer)
      .resize(192, 192)
      .png({ compressionLevel: 9, quality: 80 })
      .toFile('./public/icon-192.png');
    console.log('✔ Generado: /public/icon-192.png');

    // 2. Icono alta definición 512x512
    await sharp(svgBuffer)
      .resize(512, 512)
      .png({ compressionLevel: 9, quality: 80 })
      .toFile('./public/icon-512.png');
    console.log('✔ Generado: /public/icon-512.png');

    // 3. Captura horizontal 1280x720 (requerida para PWABuilder)
    const svgHorizontalScreenshot = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="100%" stop-color="#0b1329" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="1280" height="720" fill="url(#bgGrad)"/>
      <g opacity="0.08">
        <circle cx="640" cy="360" r="300" stroke="#00FF66" stroke-width="2" fill="none" />
        <circle cx="640" cy="360" r="500" stroke="#ffffff" stroke-width="1" fill="none" />
      </g>
      <g transform="translate(100, 260)">
        <text x="0" y="0" font-family="system-ui, sans-serif" font-weight="900" font-size="56" fill="#ffffff">STUDENT 1</text>
        <text x="0" y="55" font-family="system-ui, sans-serif" font-weight="700" font-size="24" fill="#00FF66" filter="url(#glow)">ENGLISH NATURAL NUMBERS 1-100</text>
        <text x="0" y="110" font-family="system-ui, sans-serif" font-weight="400" font-size="18" fill="#94a3b8">
          Interactive pronunciation, memory games, spelling, and audio learning modules.
        </text>
      </g>
      <g transform="translate(950, 200) scale(0.65)">
        <!-- Beautiful representation of the neon icon in the screenshot -->
        <rect width="512" height="512" rx="112" fill="#000000" stroke="#00FF66" stroke-width="4" />
        <text x="256" y="280" font-family="system-ui, sans-serif" font-weight="900" font-size="340" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">1</text>
      </g>
    </svg>`;
    await sharp(Buffer.from(svgHorizontalScreenshot))
      .png({ compressionLevel: 8 })
      .toFile('./public/screenshot-1.png');
    console.log('✔ Generada captura horizontal: /public/screenshot-1.png');

    // 4. Captura vertical 1080x1920
    const svgVerticalScreenshot = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
      <defs>
        <linearGradient id="bgGradVert" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="100%" stop-color="#0b1329" />
        </linearGradient>
        <filter id="glowVert" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="1080" height="1920" fill="url(#bgGradVert)"/>
      <g opacity="0.08">
        <circle cx="540" cy="960" r="400" stroke="#00FF66" stroke-width="2" fill="none" />
        <circle cx="540" cy="960" r="700" stroke="#ffffff" stroke-width="1" fill="none" />
      </g>
      <g transform="translate(284, 350) scale(1.0)">
        <rect width="512" height="512" rx="112" fill="#000000" stroke="#00FF66" stroke-width="4" />
        <text x="256" y="280" font-family="system-ui, sans-serif" font-weight="900" font-size="340" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">1</text>
      </g>
      <g transform="translate(100, 1050)">
        <text x="440" y="0" font-family="system-ui, sans-serif" font-weight="950" font-size="72" fill="#ffffff" text-anchor="middle">STUDENT 1</text>
        <text x="440" y="80" font-family="system-ui, sans-serif" font-weight="700" font-size="32" fill="#00FF66" text-anchor="middle" filter="url(#glowVert)">COMMERCIAL ENGLISH</text>
        <text x="440" y="160" font-family="system-ui, sans-serif" font-weight="500" font-size="24" fill="#94a3b8" text-anchor="middle">Interactive 5-Minute and Practice Modes</text>
      </g>
      <text x="540" y="1750" font-family="system-ui, sans-serif" font-weight="700" font-size="24" fill="#475569" text-anchor="middle">COMPREHENSIVE NUMBERS TRAINING</text>
    </svg>`;
    await sharp(Buffer.from(svgVerticalScreenshot))
      .png({ compressionLevel: 8 })
      .toFile('./public/screenshot-2.png');
    console.log('✔ Generada captura vertical: /public/screenshot-2.png');

    console.log('--- Generación de Activos de Interfaz Completada con éxito ---');
  } catch (err) {
    console.error('❌ Error al generar assets:', err.message);
    process.exit(1);
  }
}

generate();
