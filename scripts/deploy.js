import { TurboFactory } from '@ardrive/turbo-sdk'
import { hideBin } from 'yargs/helpers'
import * as path from 'path'
import yargs from 'yargs'
import fs from 'fs'

const __dirname = process.cwd()

const argv = yargs(hideBin(process.argv)).option('deploy-dir', {
  alias: 'd',
  type: 'string',
  description: 'Directory to deploy.',
  default: './build'
}).argv

const deploy = async () => {
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

  const jwk = JSON.parse(fs.readFileSync(walletFile))
  const turbo = TurboFactory.authenticated({ privateKey: jwk })

  const folderPath = path.resolve(`${__dirname}/${argv.deployDir}`)
  console.log(`Deploying: ${folderPath} to Arweave ...\n`)

  try {
    const { manifestResponse } = await turbo.uploadFolder({ folderPath })

    console.log(`Deployed!\n`)
    console.log(`Transaction id:`)
    console.log(manifestResponse.id)
    console.log(`\n__Make sure to update ENS contentHash with this new ID!__`)
  } catch (e) {
    console.error(e)
  }
}

deploy()
