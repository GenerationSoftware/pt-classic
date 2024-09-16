import { TurboFactory } from '@ardrive/turbo-sdk'
import * as path from 'path'

const __dirname = process.cwd()

export const turboDeployDirectory = async function (deployDir, jwk) {
  const turbo = TurboFactory.authenticated({ privateKey: jwk })

  const folderPath = path.resolve(`${__dirname}/${deployDir}`)
  console.log(`Deploying: ${folderPath} to Arweave ...`)
  console.log()

  const { manifest, fileResponses, manifestResponse } = await turbo.uploadFolder({
    folderPath
  })
  console.log('manifest')
  console.log(manifest)
  console.log('fileResponses')
  console.log(fileResponses)
  console.log('manifestResponse')
  console.log(manifestResponse)
}
