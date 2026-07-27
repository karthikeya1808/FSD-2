/**
 * SIMULATED BACKEND SERVICE
 * ---------------------------------------------------------------------------
 * This experiment is frontend-only, but a real Post Composer eventually
 * talks to an API. To keep the component code forward-compatible, every
 * "network" call funnels through this module. Swap the internals for real
 * `fetch()` calls later and nothing above this layer has to change.
 *
 * publishPost() simulates:
 *  - network latency (600-1400ms)
 *  - occasional failure (~15%) so the UI's error handling path is exercised
 */
export function publishPost({ content, platformIds }) {
  const latency = 600 + Math.random() * 800

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const willFail = Math.random() < 0.15
      if (willFail) {
        reject(
          new Error(
            `Simulated network error while publishing to ${platformIds.join(', ')}. Please retry.`
          )
        )
        return
      }
      resolve({
        success: true,
        publishedAt: new Date().toISOString(),
        platformIds,
        contentPreview: content.slice(0, 60),
      })
    }, latency)
  })
}
