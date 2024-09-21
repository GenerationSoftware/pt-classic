<script lang="ts" context="module">
  import { get, writable } from 'svelte/store'

  // Build confetti:
  const height = 800
  const colors = [0xffb636, 0x35f0d0, 0xfa48e8, 0x5d3a97]
  let confettiSVG = `<svg
    class="confetti"
    viewBox="0 0 ${height} ${height}"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
    version="1.1"
  >`
  for (let i = 0; i < 200; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    // let color = 0xff
    // const colorOffset = Math.floor(Math.random() * 3) * 8
    // color = color << colorOffset
    const colorStr = '#' + (color | 0x666666).toString(16)
    const x = (10 + Math.random() * (height - 20)).toFixed(4)
    const y = (10 + Math.random() * (height - 20)).toFixed(4)
    confettiSVG += `
  <g>
    <rect x="0" y="0" width="20" height="10" fill="${colorStr}" fill-opacity="1.0" visibility="visible">
      <animate
        attributeType="XML"
        attributeName="height"
        begin="-${Math.random().toFixed(4)}s"
        values="10;0;10"
        dur="0.3s"
        repeatCount="indefinite" />
      <animate
        attributeType="XML"
        attributeName="fill"
        values="${colorStr};#${(Math.floor(color / 4) | 0x222222).toString(16)};${colorStr}"
        dur="0.3s"
        repeatCount="indefinite" />
      <animate
        attributeType="XML"
        attributeName="fill-opacity"
        begin="0s"
        values="1.0;0.0"
        dur="3s"
        fill="freeze" />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 10 0;${(10 + Math.random() * 60).toFixed(4)} 10 0;-${(10 + Math.random() * 60).toFixed(4)} 10 0;0 10 0"
        dur="${(0.1 + Math.random() * 0.5).toFixed(4)}s"
        repeatCount="indefinite" />
    </rect>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      begin="0s"
      end="0.5s"
      dur="0.5s"
      values="${height / 2} ${height / 2};${x} ${y}"
      calcMode="spline"
      keySplines="0.1 0.8 0.2 1"/>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      begin="0.5s"
      from="${x} ${y}"
      to="${x} ${height - 10}"
      dur="${(3 + Math.random() * 3).toFixed(4)}s"/>
  </g>`
  }
  confettiSVG += '</svg>'

  // Confetti state:
  const confettiAnimations = writable(new Set<NodeJS.Timeout>())
  export const playConfetti = () => {
    for (const animationId of [...get(confettiAnimations)]) {
      clearTimeout(animationId)
      confettiAnimations.update((x) => {
        x.delete(animationId)
        return x
      })
    }
    const confettiTimeout = setTimeout(() => {
      confettiAnimations.update((x) => {
        x.delete(confettiTimeout)
        return x
      })
    }, 5000)
    confettiAnimations.update((x) => x.add(confettiTimeout))
  }
</script>

{#each [...$confettiAnimations] as confettiId}
  {#key confettiId}
    {@html confettiSVG}
  {/key}
{/each}

<style>
  :global(svg.confetti) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
    pointer-events: none;
    min-width: 120vw;
    min-height: 120vh;
    animation: 4s 1 forwards fade;
  }
</style>
