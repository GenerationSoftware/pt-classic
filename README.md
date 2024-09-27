# PT Classic

A simple, static interface for a PoolTogether prize vault with extremely minimal dependencies and zero third party APIs, built with [SvelteKit](https://kit.svelte.dev/).

---

### App Features

- Connecting wallets compatible with [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) and/or [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)
  - Resolving ENS name and avatar for connected wallet
  - Caches provider uuids for efficiently auto-reconnecting
- Depositing into the prize vault
- Withdrawing from the prize vault
- Zapping into the prize vault with any token
  - Swap route lookups are entirely onchain (using [DSKit](https://github.com/Ncookiez/dskit))
- Displaying relevant token prices
  - Token price lookups are entirely onchain (using [DSKit](https://github.com/Ncookiez/dskit))
- Displaying prizes available to be won
- Displaying amount deposited vs amount won
  - Transfer and prize-related events are efficiently cached locally
- Gamified prize checking experience
  - Dynamically generated plinko animation with relative odds
- Auto-compounding of prizes back into prize vault
  - Easy in-app prize hook setup
  - Simple in-app recovery in case of any contract failures
- Claiming bonus rewards
- Displaying claimed bonus rewards

### Dev Commands

- `pnpm i` - Install the app's dependencies
- `pnpm dev` - Start the app's dev environment at [localhost:5173](localhost:5173)
- `pnpm build` - Build the app into the `/build` folder
- `pnpm preview` - Host the built app at [localhost:4173](localhost:4173)
- `pnpm check` - Check the app for any Svelte errors/warnings

### Customization

The app can be pointed at any prize pool and vault combination, configurable through the `src/lib/config.ts` file.

> [!NOTE]
> The app queries other tokens' prices with respect to the prize vault's underlying token. If the underlying token is not a dollar-pegged stablecoin, further customization is required.

### Hosting

The app builds statically, meaning it can easily be hosted on Github Pages, IPFS, IPNS, through an ENS's content hash, Arweave, etc.

> [!IMPORTANT]
> Accessing the app through a subpath (e.g. www.mysite.com/pt-classic/) is not currently supported.
