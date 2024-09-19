<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { VectorMath } from './vectorMath'
  import type { PlinkoState, Prize, PrizeRowTile } from './types'

  export let width: number
  export let height: number
  export let columns = 4
  export let prizes: Prize[] = []

  let canvas: HTMLCanvasElement
  let plinko: HTMLDivElement
  let poolLogo: HTMLImageElement
  let mounted = false

  $: if (mounted) setCanvasSize(width, height)

  onMount(() => {
    mounted = true
  })

  onDestroy(() => {
    mounted = false
  })

  // Define game state
  const gameWidth = 100
  const columnWidth = gameWidth / columns
  const rowHeight = columnWidth * 0.75
  const ballRadius = columnWidth / 5
  const pegRadius = columnWidth * 0.1
  const marginTop = ballRadius
  const maxSpeed = 90
  const maxRotVel = 10
  const frameStepMs = 25 // 40 fps physics updates
  const collisionElasticity = 0.3
  const prizeRowFrequency = 6
  const prizeRowColPerSec = 1.5
  const spikesPerCol = 7
  let gameHeight = 100
  let scale = 1
  let lastFrameTime = 0
  let totalPlayTime = 0
  let gameState: PlinkoState = {
    state: 'ready', // ready / playing / done / paused
    frame: 0,
    ms: 0,
    ball: {
      pos: { x: -2 * ballRadius, y: -rowHeight },
      rot: 0,
      rotVel: 0,
      vel: { x: 0, y: 0 },
      acc: { x: 0, y: 100 }
    },
    nextPrizeRow: 0,
    prizesWon: 0,
    prizesTotal: 0
  }
  let futureGameState: PlinkoState | null = null
  let prizesWonMessage = '0'
  let prizesTotalMessage = '$0'
  let prizeBubbles: { top: string; left: string; content: string; backgroundColor: string }[] = []

  // Prize Info
  const maxPrizeSize = Math.max(...prizes.map((x) => x.size))
  let endPrizeRowIndex = 0
  let prizeRows: PrizeRowTile[][] = []
  let prizeRowPathOffset: number[] = []
  const defaultPrizeRow = Array(columns).fill('^') // spikes
  defaultPrizeRow[0] = ' ' // gap
  defaultPrizeRow[Math.floor(columns / 2)] = ' ' // gap

  // Build Prize Rows
  let lowestWinOdds = 1
  prizes.forEach((prize, i) => {
    // Fill with prizes they won
    for (let p = 0; p < prize.userWon; p++) {
      const prizeRow = Array(columns).fill('^') // spikes
      prizeRow[0] = i // prize
      prizeRow[Math.floor(columns / 2)] = ' ' // gap
      prizeRows.push(prizeRow)
    }

    // Then add prizes they could have won statistically
    const notWon = prize.count - prize.userWon
    if (notWon > 0) {
      for (let n = 0; n < notWon; n++) {
        if (Math.random() <= prize.userOdds) {
          const prizeRow = Array(columns).fill('^') // spikes
          prizeRow[0] = ' ' // gap
          prizeRow[Math.floor(columns / 2)] = i // prize
          prizeRows.push(prizeRow)
        }
      }
    }

    // Record lowest chance if they won
    if (prize.userWon > 0 && prize.userOdds < lowestWinOdds) {
      lowestWinOdds = prize.userOdds
    }
  })

  // Add empty rows equal to the lowest chance prize that they won
  const minRows = 1 + Math.log(1 / lowestWinOdds) / Math.log(columns / 2) // 2 gaps every row defines the odds of passing the row
  while (prizeRows.length < minRows) {
    prizeRows.push(defaultPrizeRow)
  }

  // Shuffle Prize Rows
  for (let i = 0; i < prizeRows.length; i++) {
    const randIndex = Math.floor(Math.random() * prizeRows.length)
    const randRow = prizeRows[randIndex]
    prizeRows[randIndex] = prizeRows[i]
    prizeRows[i] = randRow
  }

  // Ensure the ball hits spikes after the last prize won
  prizeRows.forEach((prizeRow, i) => {
    if (Number.isInteger(prizeRow[0]) && i >= endPrizeRowIndex) {
      endPrizeRowIndex = i + 1
    }
  })
  const offsetRowToRandomSpike = (row: any) => {
    let randomOffset = Math.floor(Math.random() * row.length)
    while (row[randomOffset] !== '^') {
      randomOffset++
    }
    return [...row.slice(randomOffset % row.length, row.length), ...row.slice(0, randomOffset % row.length)]
  }
  while (endPrizeRowIndex > prizeRows.length - 3) {
    prizeRows.push(defaultPrizeRow)
  }
  prizeRows[endPrizeRowIndex] = offsetRowToRandomSpike(prizeRows[endPrizeRowIndex])

  // Define game Y offset function
  const calculateGameYOffset = (ballPos: VectorMath.Vector2) => {
    let gameYOffset = -rowHeight - marginTop - ballRadius
    if (ballPos.y >= rowHeight * 2) gameYOffset += ballPos.y - rowHeight * 2
    return gameYOffset
  }

  // Define prize scale function
  const calculatePrizeLogScale = (prizeSize: number) => {
    return Math.log(prizeSize + 1) / Math.log(maxPrizeSize + 1)
  }

  // Define render call
  const render = (ballPos: VectorMath.Vector2, ballRotation: number, gameMs: number) => {
    // Set camera position
    const gameYOffset = calculateGameYOffset(ballPos)

    // Create 2D context
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Missing 2D context...')

    // clear and scale
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(1 / scale, 1 / scale)

    // render pegs
    const topPegRow = Math.max(0, Math.floor(gameYOffset / rowHeight))
    for (let row = topPegRow; row <= topPegRow + Math.ceil(gameHeight / rowHeight); row++) {
      const rowY = row * rowHeight - gameYOffset

      // Check if Prize Row
      const isPrizeRow = row > 0 && row % prizeRowFrequency == 0
      if (isPrizeRow) {
        const prizeRowIndex = row / prizeRowFrequency - 1
        const prizeRow = prizeRows[prizeRowIndex]
        if (prizeRow) {
          const prizeColDir = prizeRowIndex % 2 == 0 ? -1 : 1
          const prizeRowOffset = ((prizeColDir * columnWidth * (prizeRowColPerSec * gameMs)) / 1000) % gameWidth
          for (let i = 0; i < columns * 2; i++) {
            const prizeIndex = (i + prizeRowPathOffset[prizeRowIndex]) % columns
            const pegX = i * columnWidth + prizeRowOffset - (prizeColDir > 0 ? gameWidth : 0) // start behind by 1 row if moving forward
            if (pegX + columnWidth > 0 && pegX - columnWidth < gameWidth) {
              if (prizeRow[prizeIndex] === '^') {
                // Draw spikes
                ctx.fillStyle = plinko.computedStyleMap().get('--spike-color')?.toString() ?? ''
                ctx.beginPath()
                ctx.moveTo(pegX, rowY + pegRadius)
                ctx.lineTo(pegX + pegRadius, rowY)
                for (let s = 1; s <= spikesPerCol * 2; s++) {
                  ctx.lineTo(
                    pegX + pegRadius + (s * (columnWidth - pegRadius * 2)) / (spikesPerCol * 2),
                    s % 2 == 0 ? rowY : rowY - pegRadius
                  )
                }
                ctx.lineTo(pegX + columnWidth, rowY + pegRadius)
                ctx.fill()
              } else if (Number.isInteger(prizeRow[prizeIndex])) {
                // Draw Prize
                const prize = prizes[prizeRow[prizeIndex] as number]
                const prizeLogScale = calculatePrizeLogScale(prize.size)
                const prizeRadius = pegRadius + (ballRadius - pegRadius) * prizeLogScale
                ctx.fillStyle =
                  plinko
                    .computedStyleMap()
                    .get(`--prize-${Math.floor((1 - prizeLogScale) * 8)}-color`)
                    ?.toString() ?? ''
                ctx.strokeStyle = `hsla(${Math.floor((360 * gameMs) / 1000) % 360}, 100%, 50%, 0.6)`
                ctx.lineWidth = 0.5
                ctx.setLineDash([1, 1])
                ctx.lineDashOffset = gameMs / 500

                ctx.beginPath()
                ctx.ellipse(pegX + columnWidth / 2, rowY, (columnWidth - pegRadius * 3) / 2, pegRadius / 2, 0, Math.PI, Math.PI * 2)
                ctx.stroke()

                if (ballPos.y - gameYOffset < rowY || prizeIndex > 0) {
                  ctx.beginPath()
                  ctx.ellipse(pegX + columnWidth / 2, rowY + prizeRadius / 2, prizeRadius, prizeRadius, 0, 0, Math.PI * 2)
                  ctx.fill()
                }

                ctx.beginPath()
                ctx.ellipse(pegX + columnWidth / 2, rowY, (columnWidth - pegRadius * 3) / 2, pegRadius / 2, 0, 0, Math.PI)
                ctx.stroke()
              }

              // Draw peg
              ctx.fillStyle = plinko.computedStyleMap().get('--peg-color')?.toString() ?? ''
              ctx.beginPath()
              ctx.ellipse(pegX, rowY, pegRadius, pegRadius, 0, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      } else {
        // Normal Row Rendering
        for (let col = 0; col <= columns; col++) {
          // Draw peg
          ctx.fillStyle = plinko.computedStyleMap().get('--peg-color')?.toString() ?? ''
          const evenRow = row % 2 == 0
          ctx.beginPath()
          ctx.ellipse((evenRow ? col : col + 0.5) * columnWidth, rowY, pegRadius, pegRadius, 0, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // render ball
    ctx.fillStyle = plinko.computedStyleMap().get('--ball-color')?.toString() ?? ''
    ctx.beginPath()
    ctx.ellipse(ballPos.x, ballPos.y - gameYOffset, ballRadius, ballRadius, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.save()
    ctx.translate(ballPos.x, ballPos.y - gameYOffset)
    ctx.rotate(ballRotation)
    ctx.translate(-ballPos.x, gameYOffset - ballPos.y)
    ctx.drawImage(
      poolLogo,
      ballPos.x - ballRadius * 0.66,
      ballPos.y - gameYOffset - ballRadius * 0.66,
      ballRadius * 1.32,
      ballRadius * 1.32
    )
    ctx.restore()

    // Reset current transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  // Define prize bubble placement
  const placePrizeBubbles = (prizeRowIndex: number, ballPos: VectorMath.Vector2, gameMs: number) => {
    const prizeRow = prizeRows[prizeRowIndex]
    if (prizeRow) {
      const prizeColDir = prizeRowIndex % 2 == 0 ? -1 : 1
      for (let i = 0; i < prizeRow.length; i++) {
        const prizeIndex = prizeRow[i]
        if (Number.isInteger(prizeIndex)) {
          const prize = prizes[prizeIndex as number]
          let prizeX = (i + 0.5 - prizeRowPathOffset[prizeRowIndex] + (prizeColDir * prizeRowColPerSec * gameMs) / 1000) * columnWidth
          prizeX = ((prizeX % gameWidth) + gameWidth) % gameWidth
          const prizeScale = calculatePrizeLogScale(prize.size)
          const rowY = (prizeRowIndex + 1) * prizeRowFrequency * rowHeight - calculateGameYOffset(ballPos)
          const createBubble = (leftOffset: number) => {
            const bubble = {
              top: `${Math.min(100, (100 * rowY) / gameHeight)}%`,
              left: `${(100 * prizeX) / gameWidth + leftOffset}%`,
              content: `$${Number.isInteger(prize.size) ? prize.size : prize.size.toFixed(2)}`,
              backgroundColor:
                plinko
                  .computedStyleMap()
                  .get(`--prize-${Math.floor((1 - prizeScale) * 8)}-color`)
                  ?.toString() ?? ''
            }
            prizeBubbles.push(bubble)
          }
          createBubble(0)
          createBubble(-100)
          createBubble(100)
        }
      }
    }
  }

  // Function to get the game state for the next frame
  const getNextFrameState = (state: PlinkoState): PlinkoState => {
    const n = JSON.parse(JSON.stringify(state))
    n.frame++
    n.ms = state.ms + frameStepMs

    // Update velocity
    n.ball.vel.x += (n.ball.acc.x * frameStepMs) / 1000
    n.ball.vel.y += (n.ball.acc.y * frameStepMs) / 1000

    // Cap speed
    const speed = Math.sqrt(n.ball.vel.x * n.ball.vel.x + n.ball.vel.y * n.ball.vel.y)
    if (speed > maxSpeed) {
      n.ball.vel.x = (maxSpeed * n.ball.vel.x) / speed
      n.ball.vel.y = (maxSpeed * n.ball.vel.y) / speed
    }

    // Move ball
    n.ball.pos.x += (n.ball.vel.x * frameStepMs) / 1000
    n.ball.pos.y += (n.ball.vel.y * frameStepMs) / 1000

    // Rotate ball
    n.ball.rot += (n.ball.rotVel * frameStepMs) / 1000

    // Check for wall collisions
    if (n.ball.pos.x < ballRadius) {
      n.ball.pos.x = ballRadius
      if (n.ball.vel.x < 0) {
        n.ball.vel.x *= -1
      }
      n.ball.vel.x *= collisionElasticity
      n.ball.rotVel += 2
    }
    if (n.ball.pos.x > gameWidth - ballRadius) {
      n.ball.pos.x = gameWidth - ballRadius
      if (n.ball.vel.x > 0) {
        n.ball.vel.x *= -1
      }
      n.ball.vel.x *= collisionElasticity
      n.ball.rotVel -= 2
    }

    // Check for peg collisions
    const nearestPegRow = Math.round(n.ball.pos.y / rowHeight)
    if (nearestPegRow > 0) {
      let colOffset,
        pegVelocity = { x: 0, y: 0 }

      // Check if prize row is closest
      if (nearestPegRow > 0 && nearestPegRow % prizeRowFrequency == 0) {
        const prizeRowIndex = nearestPegRow / prizeRowFrequency - 1

        // set col offset
        pegVelocity = {
          x: prizeRowColPerSec * columnWidth * (prizeRowIndex % 2 == 0 ? -1 : 1),
          y: 0
        }
        colOffset = ((pegVelocity.x * n.ms) / 1000) % columnWidth
      } else {
        colOffset = nearestPegRow % 2 == 0 ? 0 : columnWidth / 2
      }
      const nearestPegCol = Math.round((n.ball.pos.x - colOffset) / columnWidth)
      const pegPos = {
        x: nearestPegCol * columnWidth + colOffset,
        y: nearestPegRow * rowHeight
      }
      if (VectorMath.dist(n.ball.pos, pegPos) < ballRadius + pegRadius) {
        // Bounce
        const diff = { x: pegPos.x - n.ball.pos.x, y: pegPos.y - n.ball.pos.y }
        const angleOfHit = VectorMath.angleBetween(diff, n.ball.vel)
        if (angleOfHit < Math.PI / 2) {
          const perpendicularVel = VectorMath.project(n.ball.vel, diff)
          const parallelVel = VectorMath.sub(n.ball.vel, perpendicularVel)
          n.ball.vel = VectorMath.add(parallelVel, VectorMath.smul(perpendicularVel, -collisionElasticity))

          // Check if peg transfers velocity to ball
          if (pegVelocity.x != 0) {
            const negDiff = VectorMath.neg(diff)
            const angleOfTransfer = VectorMath.angleBetween(pegVelocity, negDiff)
            if (angleOfTransfer < Math.PI / 2) {
              n.ball.vel = VectorMath.add(n.ball.vel, VectorMath.smul(pegVelocity, Math.cos(angleOfTransfer)))
            }
          }

          // Spin ball based on collision
          n.ball.rotVel *= 0.5
          n.ball.rotVel += 0.25 * VectorMath.mag(parallelVel) * (parallelVel.y > 0 ? -1 : 1) * (n.ball.vel.x > 0 ? -1 : 1)
        }

        // Push ball away
        const pushedDiff = VectorMath.smul(VectorMath.norm(diff), -1 * (ballRadius + pegRadius))
        n.ball.pos = VectorMath.add(pegPos, pushedDiff)
      }
    }

    // Cap ball rotational velocity
    if (n.ball.rotVel > maxRotVel) {
      n.ball.rotVel = maxRotVel
    }
    if (n.ball.rotVel < -maxRotVel) {
      n.ball.rotVel = -maxRotVel
    }

    // Check if ball has passed the next prize row
    if (n.ball.pos.y >= (n.nextPrizeRow + 1) * rowHeight * prizeRowFrequency) {
      if (n.nextPrizeRow == endPrizeRowIndex) {
        n.state = 'done'
      }
      const prizeRow = prizeRows[n.nextPrizeRow]
      if (prizeRow && Number.isInteger(prizeRow[0])) {
        const prize = prizes[prizeRow[0] as number]
        n.prizesWon++
        n.prizesTotal += prize.size
      }
      n.nextPrizeRow++
    }

    return n
  }

  // Define game loop
  const play = () => {
    if ((gameState.state === 'playing' || gameState.state === 'done') && mounted) {
      // Request next frame
      requestAnimationFrame(play)
      const now = performance.now()
      const timeSinceLastFrame = Math.min(frameStepMs, now - lastFrameTime) // limit animation frame time to frame step
      totalPlayTime += timeSinceLastFrame
      lastFrameTime = now

      if (gameState.state === 'playing') {
        // Get next game state
        const nextState = getNextFrameState(gameState)
        if (totalPlayTime >= nextState.ms) {
          gameState = nextState
        }

        // Update stats
        prizesWonMessage = `${gameState.prizesWon}`
        prizesTotalMessage = `$${gameState.prizesTotal.toFixed(2)}`

        // Simulate future game states until out of frame
        let _futureGameState = futureGameState ?? nextState
        futureGameState = _futureGameState
        while (_futureGameState.ball.pos.y < nextState.ball.pos.y + gameHeight * 1.5) {
          const nextPrizeRow = _futureGameState.nextPrizeRow
          _futureGameState = getNextFrameState(_futureGameState)
          futureGameState = _futureGameState
          if (_futureGameState.nextPrizeRow > nextPrizeRow) {
            // record prize offset
            let goalPegX = ((prizeRowColPerSec * columnWidth * (nextPrizeRow % 2 == 0 ? -1 : 1) * futureGameState.ms) / 1000) % gameWidth
            if (goalPegX < 0) {
              goalPegX += gameWidth
            }
            prizeRowPathOffset[nextPrizeRow] = Math.floor((_futureGameState.ball.pos.x - goalPegX) / columnWidth) % columns
            if (prizeRowPathOffset[nextPrizeRow] < 0) {
              prizeRowPathOffset[nextPrizeRow] += columns
            }
            prizeRowPathOffset[nextPrizeRow] = (columns - prizeRowPathOffset[nextPrizeRow]) % columns
          }
        }

        // Render frame with interpolated ball position
        const frameTime = Math.min(totalPlayTime, nextState.ms)
        const t = (frameTime - gameState.ms) / frameStepMs
        const iBallPos = VectorMath.add(VectorMath.smul(gameState.ball.pos, 1 - t), VectorMath.smul(nextState.ball.pos, t))
        render(iBallPos, gameState.ball.rot, frameTime)

        // Place prize bubbles
        prizeBubbles = []
        for (let prizeRowIndex = gameState.nextPrizeRow; prizeRowIndex < gameState.nextPrizeRow + 2; prizeRowIndex++) {
          if (prizeRowIndex >= 0) {
            placePrizeBubbles(prizeRowIndex, iBallPos, frameTime)
          }
        }
      } else {
        // Render with ball out of frame
        render({ x: -gameWidth, y: gameState.ball.pos.y }, 0, totalPlayTime)
        plinko.classList.remove('playing')
        plinko.classList.add('done')
      }
    }
  }

  const setCanvasSize = (width: number, height: number) => {
    canvas.width = width
    canvas.height = height

    scale = gameWidth / canvas.width
    gameHeight = scale * canvas.height

    plinko.style.setProperty('--start-btn-size', `${(0.8 * width) / columns}px`)

    // re-render frame
    render(gameState.ball.pos, gameState.ball.rot, totalPlayTime)
  }

  const start = (position: number) => {
    gameState.state = 'playing'
    lastFrameTime = performance.now()
    plinko.classList.remove('ready')
    plinko.classList.add('playing')
    gameState.ball.pos.x = (gameWidth * (position + 0.4 + 0.2 * Math.random())) / columns
    play()
  }
</script>

<div id="plinko" bind:this={plinko} class="ready" style:width="{width}px" style:height="{height}px">
  <canvas bind:this={canvas}></canvas>
  <div class="prize-bubble-container">
    {#each prizeBubbles as bubble}
      <div class="prize-bubble" style:top={bubble.top} style:left={bubble.left} style:background-color={bubble.backgroundColor}>
        {bubble.content}
      </div>
    {/each}
  </div>
  <div class="ui">
    <div class="start-btn-container">
      {#each new Array(columns).fill(0) as _, position}
        <button class="start-btn" on:click={() => start(position)}>|<br />V</button>
      {/each}
    </div>
    <div class="prize-info-container">
      <h3>Drop a ball to reveal your prizes!</h3>
    </div>
    <div class="prize-results-container hidden">
      <div>Prizes Won: <span class="prizes-won">{prizesWonMessage}</span></div>
      <div>Prize Total: <span class="prizes-total">{prizesTotalMessage}</span></div>
    </div>
  </div>
  <img src="/pool-logo.svg" alt="" bind:this={poolLogo} style:display="none" />
</div>

<style>
  #plinko * {
    box-sizing: border-box;
  }

  #plinko {
    /* Game Style (can be overridden through query params) */
    --background-color: rgb(48, 48, 48);
    --text-color: white;
    --ball-color: #b220d6;
    --spike-color: #646464;
    --peg-color: #9b9b9b;
    --prize-0-color: #ff0000;
    --prize-1-color: #ffae00;
    --prize-2-color: #eeff00;
    --prize-3-color: #66ff00;
    --prize-4-color: #00ffdd;
    --prize-5-color: #008cff;
    --prize-6-color: #3700ff;
    --prize-7-color: #e100ff;
    --prize-8-color: #ff69f7;

    /* Game Generated Params (defined in js) */
    --start-btn-size: 10vw;

    position: relative;
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 300px;
    max-width: 100vmin;
    overflow: hidden;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  #plinko > .ui,
  #plinko > .prize-bubble-container {
    position: absolute;
    inset: 0;
  }

  #plinko > .ui .start-btn {
    border: 1px dashed var(--text-color);
    border-radius: 50%;
    width: var(--start-btn-size);
    height: var(--start-btn-size);
    font-weight: bold;
    margin-top: 1rem;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  #plinko > .ui .start-btn:hover {
    border-style: solid;
  }

  #plinko > .ui .start-btn-container {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: nowrap;
  }

  #plinko:not(.ready) > .ui .start-btn-container {
    display: none;
  }

  #plinko > .ui .prize-results-container {
    position: relative;
    top: -100%;
    min-height: 0%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: var(--background-color);
    border-bottom: 1px solid var(--text-color);
    transition: all 1s ease-out;
  }

  #plinko.playing > .ui .prize-results-container {
    top: 0;
  }

  #plinko.done > .ui .prize-results-container {
    top: 0;
    min-height: 100%;
  }

  #plinko > .ui .prize-info-container {
    width: 100%;
    bottom: -100%;
    height: 60%;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    background-color: var(--background-color);
    border-top: 1px solid var(--text-color);
    padding: 1rem;
    transition: all 1s ease-out;
  }

  #plinko.ready > .ui .prize-info-container {
    bottom: 0;
  }

  #plinko > .prize-bubble-container > .prize-bubble {
    position: absolute;
    padding: 1rem 1rem;
    font-weight: bold;
    font-size: large;
    transform: translate(-50%, -150%);
    pointer-events: none;
    border-radius: 1rem;
    color: var(--text-color);
    text-shadow: 1px 1px 0 var(--background-color);
    opacity: 0.9;
  }

  #plinko > .prize-bubble-container > .prize-bubble::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    width: 1rem;
    height: 1rem;
    border-radius: 0.2rem;
    transform: translate(-50%, -50%) rotate(45deg);
    background-color: inherit;
  }
</style>
