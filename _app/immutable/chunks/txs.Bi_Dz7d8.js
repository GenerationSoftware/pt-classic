import{m as P,u as p,v as F,n as x,b as y,o as d,q as o,z as A,r as z,w as M,p as C,x as R,l as T,y as I,A as v,C as b}from"./vectorMath.cE2fEfcG.js";import{g as r}from"./scheduler.0_Y8enYz.js";const w=[{inputs:[{internalType:"contract IUniswapV3Router",name:"uniV3Router_",type:"address"},{internalType:"contract IUniV3Oracle",name:"uniV3Oracle_",type:"address"},{internalType:"contract ISwapperFactory",name:"swapperFactory_",type:"address"},{internalType:"contract PrizeVault",name:"compoundVault_",type:"address"},{internalType:"uint32",name:"scaledOfferFactor_",type:"uint32"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[{internalType:"address",name:"target",type:"address"}],name:"AddressEmptyCode",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"AddressInsufficientBalance",type:"error"},{inputs:[],name:"FailedInnerCall",type:"error"},{inputs:[{internalType:"uint256",name:"actualReward",type:"uint256"},{internalType:"uint256",name:"minReward",type:"uint256"}],name:"MinRewardNotMet",type:"error"},{inputs:[{internalType:"address",name:"token",type:"address"}],name:"SafeERC20FailedOperation",type:"error"},{inputs:[{internalType:"uint8",name:"currentNumTiers",type:"uint8"},{internalType:"uint256",name:"dailyPrizeSize",type:"uint256"},{internalType:"uint256",name:"minDesiredPrizeSize",type:"uint256"}],name:"VoteToLowerPrizeTiers",type:"error"},{inputs:[{internalType:"uint8",name:"currentNumTiers",type:"uint8"},{internalType:"uint256",name:"dailyPrizeSize",type:"uint256"},{internalType:"uint256",name:"minDesiredPrizeSize",type:"uint256"}],name:"VoteToStayAtCurrentPrizeTiers",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"contract PrizeVault",name:"vault",type:"address"},{indexed:!0,internalType:"uint8",name:"tier",type:"uint8"},{indexed:!0,internalType:"address",name:"winner",type:"address"},{indexed:!1,internalType:"uint32",name:"prizeIndex",type:"uint32"},{indexed:!1,internalType:"bytes",name:"reason",type:"bytes"}],name:"ClaimError",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!1,internalType:"uint256",name:"minDesiredPrizeSize",type:"uint256"}],name:"SetPrizeSizeVote",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!0,internalType:"address",name:"newSwapper",type:"address"},{indexed:!0,internalType:"address",name:"previousSwapper",type:"address"}],name:"SetSwapper",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"account",type:"address"}],name:"SwapperNotSetForAccount",type:"event"},{inputs:[],name:"CLAIM_FALLBACK_TIME_THRESHOLD",outputs:[{internalType:"uint32",name:"",type:"uint32"}],stateMutability:"view",type:"function"},{inputs:[],name:"FACTOR_DENOMINATOR",outputs:[{internalType:"uint32",name:"",type:"uint32"}],stateMutability:"view",type:"function"},{inputs:[],name:"MAX_CLAIM_REWARD_FACTOR",outputs:[{internalType:"uint32",name:"",type:"uint32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"},{internalType:"uint8",name:"",type:"uint8"},{internalType:"uint32",name:"",type:"uint32"},{internalType:"uint256",name:"",type:"uint256"},{internalType:"address",name:"",type:"address"},{internalType:"bytes",name:"",type:"bytes"}],name:"afterClaimPrize",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"baseOracle",outputs:[{internalType:"contract IOracle",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_winner",type:"address"},{internalType:"uint8",name:"_tier",type:"uint8"},{internalType:"uint32",name:"",type:"uint32"},{internalType:"uint96",name:"",type:"uint96"},{internalType:"address",name:"",type:"address"}],name:"beforeClaimPrize",outputs:[{internalType:"address",name:"prizeRecipient",type:"address"},{internalType:"bytes",name:"data",type:"bytes"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint8",name:"tier",type:"uint8"},{internalType:"address[]",name:"winners",type:"address[]"},{internalType:"uint32[][]",name:"prizeIndices",type:"uint32[][]"},{internalType:"address",name:"rewardRecipient",type:"address"},{internalType:"uint256",name:"minReward",type:"uint256"}],name:"claimPrizes",outputs:[{internalType:"uint256",name:"totalReward",type:"uint256"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address[]",name:"accounts",type:"address[]"},{internalType:"address",name:"rewardRecipient",type:"address"},{internalType:"uint256",name:"minReward",type:"uint256"}],name:"compoundAccounts",outputs:[{internalType:"uint256",name:"totalReward",type:"uint256"}],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"compoundVault",outputs:[{internalType:"contract PrizeVault",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"base",type:"address"},{internalType:"address",name:"quote",type:"address"}],name:"fetchUniV3PoolFee",outputs:[{internalType:"uint24",name:"",type:"uint24"}],stateMutability:"view",type:"function"},{inputs:[{components:[{components:[{internalType:"address",name:"base",type:"address"},{internalType:"address",name:"quote",type:"address"}],internalType:"struct QuotePair",name:"quotePair",type:"tuple"},{internalType:"uint128",name:"baseAmount",type:"uint128"},{internalType:"bytes",name:"data",type:"bytes"}],internalType:"struct QuoteParams[]",name:"quoteParams",type:"tuple[]"}],name:"getQuoteAmounts",outputs:[{internalType:"uint256[]",name:"",type:"uint256[]"}],stateMutability:"view",type:"function"},{inputs:[],name:"prizePool",outputs:[{internalType:"contract PrizePool",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"prizeSizeVotes",outputs:[{internalType:"uint256",name:"minDesiredPrizeSize",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"removeAndRecoverSwapper",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"scaledOfferFactor",outputs:[{internalType:"uint32",name:"",type:"uint32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"minDesiredPrizeSize",type:"uint256"}],name:"setPrizeSizeVote",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"minDesiredPrizeSize",type:"uint256"}],name:"setPrizeSizeVoteAndSwapper",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"setSwapper",outputs:[{internalType:"contract ISwapper",name:"",type:"address"}],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"swapperFactory",outputs:[{internalType:"contract ISwapperFactory",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"tokenToBeneficiary",type:"address"},{internalType:"uint256",name:"amountToBeneficiary",type:"uint256"},{internalType:"bytes",name:"",type:"bytes"}],name:"swapperFlashCallback",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"swappers",outputs:[{internalType:"address",name:"swapper",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"uniV3Router",outputs:[{internalType:"contract IUniswapV3Router",name:"",type:"address"}],stateMutability:"view",type:"function"}],_=[{inputs:[],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"InsufficientFunds_FromTrader",type:"error"},{inputs:[],name:"InsufficientFunds_InContract",type:"error"},{inputs:[],name:"Invalid_AmountsToBeneficiary",type:"error"},{inputs:[],name:"Invalid_QuoteToken",type:"error"},{inputs:[],name:"Paused",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{anonymous:!1,inputs:[{components:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"value",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],indexed:!1,internalType:"struct WalletImpl.Call[]",name:"calls",type:"tuple[]"}],name:"ExecCalls",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"beneficiary",type:"address"},{indexed:!0,internalType:"address",name:"trader",type:"address"},{components:[{components:[{internalType:"address",name:"base",type:"address"},{internalType:"address",name:"quote",type:"address"}],internalType:"struct QuotePair",name:"quotePair",type:"tuple"},{internalType:"uint128",name:"baseAmount",type:"uint128"},{internalType:"bytes",name:"data",type:"bytes"}],indexed:!1,internalType:"struct QuoteParams[]",name:"quoteParams",type:"tuple[]"},{indexed:!1,internalType:"address",name:"tokenToBeneficiary",type:"address"},{indexed:!1,internalType:"uint256[]",name:"amountsToBeneficiary",type:"uint256[]"},{indexed:!1,internalType:"uint256",name:"excessToBeneficiary",type:"uint256"}],name:"Flash",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"oldOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"payer",type:"address"},{indexed:!1,internalType:"uint256",name:"amount",type:"uint256"}],name:"Payback",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint256",name:"amount",type:"uint256"}],name:"ReceiveETH",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"beneficiary",type:"address"}],name:"SetBeneficiary",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"uint32",name:"defaultScaledOfferFactor",type:"uint32"}],name:"SetDefaultScaledOfferFactor",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"contract IOracle",name:"oracle",type:"address"}],name:"SetOracle",type:"event"},{anonymous:!1,inputs:[{components:[{components:[{internalType:"address",name:"base",type:"address"},{internalType:"address",name:"quote",type:"address"}],internalType:"struct QuotePair",name:"quotePair",type:"tuple"},{internalType:"uint32",name:"scaledOfferFactor",type:"uint32"}],indexed:!1,internalType:"struct SwapperImpl.SetPairScaledOfferFactorParams[]",name:"params",type:"tuple[]"}],name:"SetPairScaledOfferFactors",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"bool",name:"paused",type:"bool"}],name:"SetPaused",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"tokenToBeneficiary",type:"address"}],name:"SetTokenToBeneficiary",type:"event"},{inputs:[],name:"beneficiary",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"defaultScaledOfferFactor",outputs:[{internalType:"uint32",name:"",type:"uint32"}],stateMutability:"view",type:"function"},{inputs:[{components:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"value",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],internalType:"struct WalletImpl.Call[]",name:"calls_",type:"tuple[]"}],name:"execCalls",outputs:[{internalType:"uint256",name:"blockNumber",type:"uint256"},{internalType:"bytes[]",name:"returnData",type:"bytes[]"}],stateMutability:"payable",type:"function"},{inputs:[{components:[{components:[{internalType:"address",name:"base",type:"address"},{internalType:"address",name:"quote",type:"address"}],internalType:"struct QuotePair",name:"quotePair",type:"tuple"},{internalType:"uint128",name:"baseAmount",type:"uint128"},{internalType:"bytes",name:"data",type:"bytes"}],internalType:"struct QuoteParams[]",name:"quoteParams_",type:"tuple[]"},{internalType:"bytes",name:"callbackData_",type:"bytes"}],name:"flash",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"nonpayable",type:"function"},{inputs:[{components:[{internalType:"address",name:"base",type:"address"},{internalType:"address",name:"quote",type:"address"}],internalType:"struct QuotePair[]",name:"quotePairs_",type:"tuple[]"}],name:"getPairScaledOfferFactors",outputs:[{internalType:"uint32[]",name:"pairScaledOfferFactors",type:"uint32[]"}],stateMutability:"view",type:"function"},{inputs:[{components:[{internalType:"address",name:"owner",type:"address"},{internalType:"bool",name:"paused",type:"bool"},{internalType:"address",name:"beneficiary",type:"address"},{internalType:"address",name:"tokenToBeneficiary",type:"address"},{internalType:"contract IOracle",name:"oracle",type:"address"},{internalType:"uint32",name:"defaultScaledOfferFactor",type:"uint32"},{components:[{components:[{internalType:"address",name:"base",type:"address"},{internalType:"address",name:"quote",type:"address"}],internalType:"struct QuotePair",name:"quotePair",type:"tuple"},{internalType:"uint32",name:"scaledOfferFactor",type:"uint32"}],internalType:"struct SwapperImpl.SetPairScaledOfferFactorParams[]",name:"pairScaledOfferFactors",type:"tuple[]"}],internalType:"struct SwapperImpl.InitParams",name:"params_",type:"tuple"}],name:"initializer",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"},{internalType:"address",name:"",type:"address"},{internalType:"uint256[]",name:"",type:"uint256[]"},{internalType:"uint256[]",name:"",type:"uint256[]"},{internalType:"bytes",name:"",type:"bytes"}],name:"onERC1155BatchReceived",outputs:[{internalType:"bytes4",name:"",type:"bytes4"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"},{internalType:"address",name:"",type:"address"},{internalType:"uint256",name:"",type:"uint256"},{internalType:"uint256",name:"",type:"uint256"},{internalType:"bytes",name:"",type:"bytes"}],name:"onERC1155Received",outputs:[{internalType:"bytes4",name:"",type:"bytes4"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"},{internalType:"address",name:"",type:"address"},{internalType:"uint256",name:"",type:"uint256"},{internalType:"bytes",name:"",type:"bytes"}],name:"onERC721Received",outputs:[{internalType:"bytes4",name:"",type:"bytes4"}],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"oracle",outputs:[{internalType:"contract IOracle",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"payback",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"beneficiary_",type:"address"}],name:"setBeneficiary",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint32",name:"defaultScaledOfferFactor_",type:"uint32"}],name:"setDefaultScaledOfferFactor",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"contract IOracle",name:"oracle_",type:"address"}],name:"setOracle",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{components:[{components:[{internalType:"address",name:"base",type:"address"},{internalType:"address",name:"quote",type:"address"}],internalType:"struct QuotePair",name:"quotePair",type:"tuple"},{internalType:"uint32",name:"scaledOfferFactor",type:"uint32"}],internalType:"struct SwapperImpl.SetPairScaledOfferFactorParams[]",name:"params_",type:"tuple[]"}],name:"setPairScaledOfferFactors",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bool",name:"paused_",type:"bool"}],name:"setPaused",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"tokenToBeneficiary_",type:"address"}],name:"setTokenToBeneficiary",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"swapperFactory",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"tokenToBeneficiary",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner_",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"}],g=t=>t*R("1.2")/10n**18n,s=async(t,e)=>{var m,u,c;const n=r(P).public,a=r(P).wallet,i=r(p);if(!(!a||!i)){F(a);try{const l=await n.estimateContractGas({account:i,...t}),f=await a.writeContract({chain:x,account:i,...t,gas:g(l)});(m=e==null?void 0:e.onSend)==null||m.call(e,f);const S=await n.waitForTransactionReceipt({hash:f});if(S.status==="success")(u=e==null?void 0:e.onSuccess)==null||u.call(e,S);else throw new Error(`${t.functionName} tx reverted: ${f}`)}catch(l){console.error(l)}finally{(c=e==null?void 0:e.onSettled)==null||c.call(e)}}},k=async(t,e,n,a)=>await s({address:t,abi:M,functionName:"approve",args:[e,n]},a),O=t=>{const{topics:e,data:n}=t.logs.filter(a=>T(a.address)===T(y.address))[1];return I({abi:d,eventName:"Deposit",topics:e,data:n,strict:!0})},E=async(t,e)=>await s({address:y.address,abi:d,functionName:"deposit",args:[t,r(p)]},{...e,onSuccess:n=>{var a;return(a=e==null?void 0:e.onSuccess)==null?void 0:a.call(e,n,O(n))}}),V=async(t,e)=>await s(t,{...e,onSuccess:n=>{var a;return(a=e==null?void 0:e.onSuccess)==null?void 0:a.call(e,n,O(n))}}),h=t=>{const{topics:e,data:n}=t.logs.filter(a=>T(a.address)===T(y.address))[1];return I({abi:d,eventName:"Withdraw",topics:e,data:n,strict:!0})},q=async(t,e)=>await s({address:y.address,abi:d,functionName:"redeem",args:[t,r(p),r(p),t]},{...e,onSuccess:n=>{var a;return(a=e==null?void 0:e.onSuccess)==null?void 0:a.call(e,n,h(n))}}),D=async t=>await s({address:y.address,abi:d,functionName:"setHooks",args:[{useBeforeClaimPrize:!0,useAfterClaimPrize:!1,implementation:o.address}]},t),Q=async t=>await s({address:y.address,abi:d,functionName:"setHooks",args:[{useBeforeClaimPrize:!1,useAfterClaimPrize:!1,implementation:A}]},t),H=async t=>await s({address:o.address,abi:w,functionName:"setPrizeSizeVoteAndSwapper",args:[o.minPrizeSize]},t),L=async(t,e)=>{const n=[],a=r(p);if(t.forEach(({promotionId:i,epochs:m})=>{const u=[];Object.entries(m).forEach(([c,l])=>{l&&u.push(Number(c))}),u.length&&n.push({promotionId:i,epochIds:u})}),!(!a||!n.length))return n.length===1?await s({address:v.address,abi:b,functionName:"claimRewards",args:[a,BigInt(n[0].promotionId),n[0].epochIds]},e):await s({address:v.address,abi:b,functionName:"multicall",args:[n.map(i=>z({abi:b,functionName:"claimRewards",args:[a,BigInt(i.promotionId),i.epochIds]}))]},e)},U=async t=>await s({address:o.address,abi:w,functionName:"compoundAccounts",args:[[r(p)],r(p),1n]},t),W=async t=>await s({address:o.address,abi:w,functionName:"removeAndRecoverSwapper"},t),G=async(t,e)=>{const n=z({abi:M,functionName:"transfer",args:[r(p),t.balance]});return await s({address:t.address,abi:_,functionName:"execCalls",args:[[{to:C.prizeToken.address,value:0n,data:n}]]},e)};export{k as a,E as b,L as c,V as d,H as e,U as f,W as g,G as h,q as r,D as s,Q as u};