import { prizeHook, prizeVault } from '$lib/config'
import { zeroAddress, type Address } from 'viem'
import { getSetSwapperEvents } from './events'
import { publicClient } from '$lib/constants'
import { vaultABI } from '$lib/abis'
import { lower } from './formatting'

export const getPrizeHookStatus = async (
  userAddress: Address
): Promise<
  | { isPrizeHookSet: boolean; isSwapperSet: false; pastSwapperAddresses: Address[] }
  | { isPrizeHookSet: boolean; isSwapperSet: true; swapperAddress: Address; pastSwapperAddresses: Address[] }
> => {
  let isPrizeHookSet = false

  const hook = await publicClient.readContract({
    address: prizeVault.address,
    abi: vaultABI,
    functionName: 'getHooks',
    args: [userAddress]
  })

  if (lower(hook.implementation) === prizeHook.address && !!hook.useBeforeClaimPrize) {
    isPrizeHookSet = true
  }

  const setSwapperEvents = await getSetSwapperEvents(userAddress)

  if (!!setSwapperEvents.length) {
    const swapperAddresses = [...new Set<Address>(setSwapperEvents.map((e) => e.args.newSwapper))]

    const swapperAddress = swapperAddresses.pop() // TODO: make sure the last event is the most recent one
    const pastSwapperAddresses = swapperAddresses.filter((a) => a !== zeroAddress)

    if (!!swapperAddress && swapperAddress !== zeroAddress) {
      return { isPrizeHookSet, isSwapperSet: true, swapperAddress, pastSwapperAddresses }
    } else {
      return { isPrizeHookSet, isSwapperSet: false, pastSwapperAddresses }
    }
  }

  return { isPrizeHookSet, isSwapperSet: false, pastSwapperAddresses: [] }
}
