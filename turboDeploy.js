import { TurboFactory } from '@ardrive/turbo-sdk'
import * as path from 'path'

const __dirname = process.cwd()

export default async function TurboDeploy(argv, jwk) {
  const turbo = TurboFactory.authenticated({ privateKey: jwk })
  const deployFolder = argv.deployFolder

  console.log('deployFolder')
  console.log(deployFolder)

  const folderPath = path.resolve(`${__dirname}/${deployFolder}`)
  console.log('folderPath')
  console.log(folderPath)

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
