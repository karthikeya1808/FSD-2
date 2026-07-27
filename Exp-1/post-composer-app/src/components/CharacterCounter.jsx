import './CharacterCounter.css'

/**
 * Renders a single platform's live character budget as a teletype-style
 * readout: mono digits + a thin bar that depletes as the writer approaches
 * the limit. Turns amber near the cap and red past it.
 */
export default function CharacterCounter({ platform, result }) {
  const { charCount, charLimit, percentUsed } = result
  const overLimit = charCount > charLimit
  const nearLimit = !overLimit && percentUsed >= (platform.warnThreshold ?? 0.9)

  const state = overLimit ? 'over' : nearLimit ? 'warn' : 'ok'
  const barPct = Math.min(percentUsed, 1) * 100

  return (
    <div className={`char-counter char-counter--${state}`}>
      <div className="char-counter__row">
        <span className="char-counter__platform">{platform.shortLabel}</span>
        <span className="char-counter__digits">
          {charCount} / {charLimit}
        </span>
      </div>
      <div className="char-counter__track" aria-hidden="true">
        <div className="char-counter__fill" style={{ width: `${barPct}%` }} />
      </div>
    </div>
  )
}
