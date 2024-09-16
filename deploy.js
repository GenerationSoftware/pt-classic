#!/usr/bin/env node

import fs from 'fs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import TurboDeploy from './turboDeploy.js'

const argv = yargs(hideBin(process.argv)).option('deploy-dir', {
  alias: 'd',
  type: 'string',
  description: 'Directory to deploy.',
  default: './dist'
}).argv

const DEPLOY_KEY = process.env.DEPLOY_KEY

const run = async () => {
  if (!DEPLOY_KEY) {
    console.error('DEPLOY_KEY not configured')
    return
  }

  if (argv.deployFolder.length == 0) {
    console.error('deploy folder must not be an empty string')
    return
  }

  if (!fs.existsSync(argv.deployFolder)) {
    console.error(`deploy folder [${argv.deployFolder}] does not exist`)
    return
  }

  // let jwk = JSON.parse(Buffer.from(DEPLOY_KEY, 'base64').toString('utf-8'))
  const jwk = JSON.parse(fs.readFileSync('./wallet.json'))
  try {
    const manifestResponse = await TurboDeploy(argv, jwk)

    console.log(`Deployed!`)
    console.log(`Transaction id: [${manifestResponse.id}]`)
    console.log(``)
    console.log(`__Make sure to update ENS contentHash with this new ID__`)
  } catch (e) {
    console.error(e)
  }
}

run()
