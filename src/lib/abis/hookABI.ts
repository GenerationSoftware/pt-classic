export const hookABI = [
  {
    inputs: [
      { internalType: 'contract IOracle', name: 'baseOracle_', type: 'address' },
      { internalType: 'contract ISwapperFactory', name: 'swapperFactory_', type: 'address' },
      { internalType: 'uint32', name: 'defaultScaledOfferFactor_', type: 'uint32' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newTokenOut', type: 'address' },
      { indexed: true, internalType: 'contract ISwapper', name: 'newSwapper', type: 'address' },
      { indexed: false, internalType: 'address', name: 'previousSwapper', type: 'address' }
    ],
    name: 'SetSwapper',
    type: 'event'
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
      { internalType: 'address', name: 'winner', type: 'address' },
      { internalType: 'uint8', name: '', type: 'uint8' },
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
    inputs: [],
    name: 'defaultScaledOfferFactor',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
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
    inputs: [{ internalType: 'address', name: '_tokenOut', type: 'address' }],
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
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'swappers',
    outputs: [{ internalType: 'address', name: 'swapper', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
