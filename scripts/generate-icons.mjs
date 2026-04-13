import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fondo degradado rosa
  const grad = ctx.createLinearGradient(0, 0, size, size)
  grad.addColorStop(0, '#f472b6')
  grad.addColorStop(1, '#fb7185')
  ctx.fillStyle = grad
  const r = size * 0.2
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(size - r, 0)
  ctx.quadraticCurveTo(size, 0, size, r)
  ctx.lineTo(size, size - r)
  ctx.quadraticCurveTo(size, size, size - r, size)
  ctx.lineTo(r, size)
  ctx.quadraticCurveTo(0, size, 0, size - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()

  // Flor central
  const cx = size / 2
  const cy = size / 2
  const petalR = size * 0.14
  const petalDist = size * 0.18

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    ctx.beginPath()
    ctx.ellipse(
      cx + Math.cos(angle) * petalDist,
      cy + Math.sin(angle) * petalDist,
      petalR, petalR * 0.6,
      angle, 0, Math.PI * 2
    )
    ctx.fill()
  }

  // Centro
  ctx.fillStyle = '#fce7f3'
  ctx.beginPath()
  ctx.arc(cx, cy, size * 0.1, 0, Math.PI * 2)
  ctx.fill()

  // Brillo
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.beginPath()
  ctx.ellipse(size * 0.35, size * 0.3, size * 0.2, size * 0.12, -Math.PI / 4, 0, Math.PI * 2)
  ctx.fill()

  return canvas.toBuffer('image/png')
}

try {
  writeFileSync(join(__dir, '../public/icon-192.png'), drawIcon(192))
  writeFileSync(join(__dir, '../public/icon-512.png'), drawIcon(512))
  console.log('✅ Íconos generados: icon-192.png y icon-512.png')
} catch (e) {
  console.error('Error:', e.message)
}
