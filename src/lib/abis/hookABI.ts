export const hookABI = [
  {
    inputs: [
      { internalType: 'contract IUniswapV3Router', name: 'uniV3Router_', type: 'address' },
      { internalType: 'contract IUniV3Oracle', name: 'uniV3Oracle_', type: 'address' },
      { internalType: 'contract ISwapperFactory', name: 'swapperFactory_', type: 'address' },
      { internalType: 'contract PrizeVault', name: 'compoundVault_', type: 'address' },
      { internalType: 'uint32', name: 'scaledOfferFactor_', type: 'uint32' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [{ internalType: 'address', name: 'target', type: 'address' }], name: 'AddressEmptyCode', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'AddressInsufficientBalance', type: 'error' },
  { inputs: [], name: 'FailedInnerCall', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'actualReward', type: 'uint256' },
      { internalType: 'uint256', name: 'minReward', type: 'uint256' }
    ],
    name: 'MinRewardNotMet',
    type: 'error'
  },
  { inputs: [{ internalType: 'address', name: 'token', type: 'address' }], name: 'SafeERC20FailedOperation', type: 'error' },
  {
    inputs: [
      { internalType: 'uint8', name: 'currentNumTiers', type: 'uint8' },
      { internalType: 'uint256', name: 'dailyPrizeSize', type: 'uint256' },
      { internalType: 'uint256', name: 'minDesiredPrizeSize', type: 'uint256' }
    ],
    name: 'VoteToLowerPrizeTiers',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'currentNumTiers', type: 'uint8' },
      { internalType: 'uint256', name: 'dailyPrizeSize', type: 'uint256' },
      { internalType: 'uint256', name: 'minDesiredPrizeSize', type: 'uint256' }
    ],
    name: 'VoteToStayAtCurrentPrizeTiers',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'contract PrizeVault', name: 'vault', type: 'address' },
      { indexed: true, internalType: 'uint8', name: 'tier', type: 'uint8' },
      { indexed: true, internalType: 'address', name: 'winner', type: 'address' },
      { indexed: false, internalType: 'uint32', name: 'prizeIndex', type: 'uint32' },
      { indexed: false, internalType: 'bytes', name: 'reason', type: 'bytes' }
    ],
    name: 'ClaimError',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'minDesiredPrizeSize', type: 'uint256' }
    ],
    name: 'SetPrizeSizeVote',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newSwapper', type: 'address' },
      { indexed: true, internalType: 'address', name: 'previousSwapper', type: 'address' }
    ],
    name: 'SetSwapper',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }],
    name: 'SwapperNotSetForAccount',
    type: 'event'
  },
  {
    inputs: [],
    name: 'CLAIM_FALLBACK_TIME_THRESHOLD',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'FACTOR_DENOMINATOR',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_CLAIM_REWARD_FACTOR',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint8', name: '', type: 'uint8' },
      { internalType: 'uint32', name: '', type: 'uint32' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'bytes', name: '', type: 'bytes' }
    ],
    name: 'afterClaimPrize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'baseOracle',
    outputs: [{ internalType: 'contract IOracle', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_winner', type: 'address' },
      { internalType: 'uint8', name: '_tier', type: 'uint8' },
      { internalType: 'uint32', name: '', type: 'uint32' },
      { internalType: 'uint96', name: '', type: 'uint96' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'beforeClaimPrize',
    outputs: [
      { internalType: 'address', name: 'prizeRecipient', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'tier', type: 'uint8' },
      { internalType: 'address[]', name: 'winners', type: 'address[]' },
      { internalType: 'uint32[][]', name: 'prizeIndices', type: 'uint32[][]' },
      { internalType: 'address', name: 'rewardRecipient', type: 'address' },
      { internalType: 'uint256', name: 'minReward', type: 'uint256' }
    ],
    name: 'claimPrizes',
    outputs: [{ internalType: 'uint256', name: 'totalReward', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'accounts', type: 'address[]' },
      { internalType: 'address', name: 'rewardRecipient', type: 'address' },
      { internalType: 'uint256', name: 'minReward', type: 'uint256' }
    ],
    name: 'compoundAccounts',
    outputs: [{ internalType: 'uint256', name: 'totalReward', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'compoundVault',
    outputs: [{ internalType: 'contract PrizeVault', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'base', type: 'address' },
      { internalType: 'address', name: 'quote', type: 'address' }
    ],
    name: 'fetchUniV3PoolFee',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'address', name: 'base', type: 'address' },
              { internalType: 'address', name: 'quote', type: 'address' }
            ],
            internalType: 'struct QuotePair',
            name: 'quotePair',
            type: 'tuple'
          },
          { internalType: 'uint128', name: 'baseAmount', type: 'uint128' },
          { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        internalType: 'struct QuoteParams[]',
        name: 'quoteParams',
        type: 'tuple[]'
      }
    ],
    name: 'getQuoteAmounts',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'prizePool',
    outputs: [{ internalType: 'contract PrizePool', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'prizeSizeVotes',
    outputs: [{ internalType: 'uint256', name: 'minDesiredPrizeSize', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'removeAndRecoverSwapper',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'scaledOfferFactor',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'minDesiredPrizeSize', type: 'uint256' }],
    name: 'setPrizeSizeVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'minDesiredPrizeSize', type: 'uint256' }],
    name: 'setPrizeSizeVoteAndSwapper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'setSwapper',
    outputs: [{ internalType: 'contract ISwapper', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'swapperFactory',
    outputs: [{ internalType: 'contract ISwapperFactory', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenToBeneficiary', type: 'address' },
      { internalType: 'uint256', name: 'amountToBeneficiary', type: 'uint256' },
      { internalType: 'bytes', name: '', type: 'bytes' }
    ],
    name: 'swapperFlashCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'swappers',
    outputs: [{ internalType: 'address', name: 'swapper', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'uniV3Router',
    outputs: [{ internalType: 'contract IUniswapV3Router', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
