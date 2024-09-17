import fs from 'fs'
import yargs from 'yargs'
import * as path from 'path'
import { hideBin } from 'yargs/helpers'
import { TurboFactory } from '@ardrive/turbo-sdk'

const __dirname = process.cwd()

const argv = yargs(hideBin(process.argv)).option('deploy-dir', {
  alias: 'd',
  type: 'string',
  description: 'Directory to deploy.',
  default: './build'
}).argv

// const ARWEAVE_BASE_64_JWK = process.env.ARWEAVE_BASE_64_JWK

const runDeploy = async () => {
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
  const turbo = TurboFactory.authenticated({ privateKey: jwk })

  const folderPath = path.resolve(`${__dirname}/${argv.deployDir}`)
  console.log(`Deploying: ${folderPath} to Arweave ...`)
  console.log()

  try {
    const { manifest, fileResponses, manifestResponse } = await turbo.uploadFolder({
      folderPath
    })

    console.log(`Deployed!`)
    console.log(``)

    console.log(`Transaction id:`)
    console.log(manifestResponse.id)
    console.log(``)
    console.log(`__Make sure to update ENS contentHash with this new ID!__`)
  } catch (e) {
    console.error(e)
  }
}

runDeploy()
