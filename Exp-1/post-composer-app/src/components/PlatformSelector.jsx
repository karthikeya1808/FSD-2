import { PLATFORM_LIST } from '../config/platforms'
import './PlatformSelector.css'

/**
 * Controlled multi-select of target platforms. `selectedIds` and `onChange`
 * are owned by the parent (PostComposer) — this component holds no state of
 * its own, keeping it a pure, reusable "controlled component".
 */
export default function PlatformSelector({ selectedIds, onChange }) {
  function toggle(id) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="platform-selector" role="group" aria-label="Select target platforms">
      {PLATFORM_LIST.map((platform) => {
        const active = selectedIds.includes(platform.id)
        return (
          <button
            key={platform.id}
            type="button"
            className={`platform-chip${active ? ' platform-chip--active' : ''}`}
            style={{ '--chip-accent': platform.accent }}
            aria-pressed={active}
            onClick={() => toggle(platform.id)}
          >
            <span className="platform-chip__glyph">{platform.glyph}</span>
            <span className="platform-chip__body">
              <span className="platform-chip__label">{platform.label}</span>
              <span className="platform-chip__limit">{platform.charLimit} ch cap</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
