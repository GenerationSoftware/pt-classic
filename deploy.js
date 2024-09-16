import fs from 'fs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as path from 'path'

import { turboDeployDirectory } from './turboDeployDirectory.js'

const __dirname = process.cwd()

const argv = yargs(hideBin(process.argv)).option('deploy-dir', {
  alias: 'd',
  type: 'string',
  description: 'Directory to deploy.',
  default: './dist'
}).argv

// const ARWEAVE_BASE_64_JWK = process.env.ARWEAVE_BASE_64_JWK

const run = async () => {
  if (argv.deployDir.length == 0) {
    console.error('deploy directory must not be an empty string')
    return
  }

  if (!fs.existsSync(argv.deployDir)) {
    console.error(`deploy directory [${argv.deployDir}] does not exist`)
    return
  }

  const walletFile = path.resolve(`${__dirname}/wallet.json`)
  if (!fs.existsSync(walletFile)) {
    console.error(`wallet.json does not exist`)
    return
  }

  // if (!ARWEAVE_BASE_64_JWK) {
  //   console.error('ARWEAVE_BASE_64_JWK is missing')
  //   return
  // }

  // let jwk = JSON.parse(Buffer.from(ARWEAVE_BASE_64_JWK, 'base64').toString('utf-8'))
  const jwk = JSON.parse(fs.readFileSync(walletFile))

  try {
    const manifestResponse = await turboDeployDirectory(argv.deployDir, jwk)

    console.log(`Deployed!`)
    console.log(`Transaction id: [${manifestResponse.id}]`)
    console.log(``)
    console.log(`__Make sure to update ENS contentHash with this new ID__`)
  } catch (e) {
    console.error(e)
  }
}

run()
