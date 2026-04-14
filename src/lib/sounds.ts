/**
 * Sonidos cute generados con Web Audio API.
 * Sin archivos externos — todo programático y liviano.
 */

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  } catch {
    return null
  }
}

function playTone(
  freqs: number[],
  opts: {
    type?: OscillatorType
    duration?: number      // segundos totales
    gap?: number           // pausa entre notas (s)
    gain?: number          // volumen 0-1
    fadeOut?: number       // duración del fade final (s)
    wave?: PeriodicWave
  } = {}
) {
  const ac = ctx()
  if (!ac) return

  const {
    type = 'sine',
    duration = 0.12,
    gap = 0.08,
    gain = 0.18,
    fadeOut = 0.06,
  } = opts

  freqs.forEach((freq, i) => {
    const osc = ac.createOscillator()
    const gainNode = ac.createGain()

    osc.connect(gainNode)
    gainNode.connect(ac.destination)

    osc.type = type
    osc.frequency.value = freq

    const start = ac.currentTime + i * (duration + gap)
    const end   = start + duration

    gainNode.gain.setValueAtTime(0, start)
    gainNode.gain.linearRampToValueAtTime(gain, start + 0.01)
    gainNode.gain.setValueAtTime(gain, end - fadeOut)
    gainNode.gain.linearRampToValueAtTime(0, end)

    osc.start(start)
    osc.stop(end)
  })
}

// ─── Sonidos individuales ─────────────────────────────────────────────────────

/** Horas registradas — dos notas ascendentes suaves, cálidas */
export function soundHorasOk() {
  playTone([523, 659], { type: 'sine', duration: 0.13, gap: 0.06, gain: 0.15 })
}

/** Empresa / proyecto creado — pop burbuja con rebote */
export function soundCreado() {
  playTone([880, 1046], { type: 'sine', duration: 0.10, gap: 0.04, gain: 0.12 })
}

/** Guardado / actualizado — nota única suave */
export function soundGuardado() {
  playTone([698], { type: 'sine', duration: 0.18, gain: 0.13, fadeOut: 0.08 })
}

/** Eliminado — nota descendente suave, no agresiva */
export function soundEliminado() {
  playTone([440, 349], { type: 'sine', duration: 0.10, gap: 0.05, gain: 0.10 })
}

/** Login bienvenida — tres notas ascendentes tipo fanfarria cute */
export function soundBienvenida() {
  playTone([523, 659, 784], { type: 'sine', duration: 0.12, gap: 0.07, gain: 0.14 })
}

/** Celebración / hito — acorde alegre */
export function soundCelebracion() {
  playTone([523, 659, 784, 1046], { type: 'sine', duration: 0.14, gap: 0.06, gain: 0.13 })
}

/** Easter egg — escalita rápida y juguetona */
export function soundEasterEgg() {
  playTone([523, 587, 659, 698, 784, 880, 988, 1046], {
    type: 'sine', duration: 0.08, gap: 0.03, gain: 0.12,
  })
}

/** Nota guardada (autosave) — click suave, casi imperceptible */
export function soundNota() {
  playTone([880], { type: 'sine', duration: 0.07, gain: 0.07, fadeOut: 0.04 })
}
