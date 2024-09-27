import { prizeHook, prizePool, prizeVault } from '$lib/config'
import { clients, userSetSwapperEvents } from '$lib/stores'
import { erc20Abi, zeroAddress, type Address } from 'viem'
import { updateUserSetSwapperEvents } from './events'
import { validateClientNetwork } from './providers'
import { vaultABI } from '$lib/abis'
import { lower } from './formatting'
import { get } from 'svelte/store'

export const getPrizeHookStatus = async (
  userAddress: Address
): Promise<
  | {
      isPrizeHookSet: boolean
      isSwapperSet: false
      pastSwapperAddresses: Address[]
      swappersWithBalance: { address: Address; balance: bigint }[]
    }
  | {
      isPrizeHookSet: boolean
      isSwapperSet: true
      swapperAddress: Address
      pastSwapperAddresses: Address[]
      swappersWithBalance: { address: Address; balance: bigint }[]
    }
> => {
  const publicClient = get(clients).public
  validateClientNetwork(publicClient)

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

  const setSwapperEvents = await updateUserSetSwapperEvents(userAddress, get(userSetSwapperEvents) ?? [])

  if (!!setSwapperEvents.length) {
    const swapperAddresses = [...new Set<Address>(setSwapperEvents.map((e) => e.args.newSwapper))]

    const swapperAddress = swapperAddresses.pop()
    const pastSwapperAddresses = swapperAddresses.filter((a) => a !== zeroAddress)

    const swappersWithBalance = await getSwappersWithBalance(swapperAddresses)

    if (!!swapperAddress && swapperAddress !== zeroAddress) {
      return { isPrizeHookSet, isSwapperSet: true, swapperAddress, pastSwapperAddresses, swappersWithBalance }
    } else {
      return { isPrizeHookSet, isSwapperSet: false, pastSwapperAddresses, swappersWithBalance }
    }
  }

  return { isPrizeHookSet, isSwapperSet: false, pastSwapperAddresses: [], swappersWithBalance: [] }
}

export const getSwappersWithBalance = async (swapperAddresses: Address[]) => {
  const swappersWithBalance: { address: Address; balance: bigint }[] = []

  const validSwapperAddresses = swapperAddresses.filter((a) => a !== zeroAddress)

  if (!!validSwapperAddresses.length) {
    const publicClient = get(clients).public
    validateClientNetwork(publicClient)

    const multicall = await publicClient.multicall({
      contracts: validSwapperAddresses.map((swapperAddress) => ({
        address: prizePool.prizeToken.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [swapperAddress]
      }))
    })

    validSwapperAddresses.forEach((address, i) => {
      if (multicall[i].status === 'success' && typeof multicall[i].result === 'bigint') {
        const balance = multicall[i].result

        if (balance > 0n) {
          swappersWithBalance.push({ address, balance })
        }
      }
    })
  }

  return swappersWithBalance
}
