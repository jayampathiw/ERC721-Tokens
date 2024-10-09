# NFT Minting and Auction Platform

This project consists of two main components:
1. Minty: A tool for minting NFTs and interacting with the smart contract
2. Frontend: A web interface for users to interact with the NFT platform

Minty is an example of how to _mint_ non-fungible tokens (NFTs) while storing the associated data on IPFS. You can also use Minty to pin your data on an IPFS pinning service such as [nft.storage](https://nft.storage) and [Pinata](https://pinata.cloud).

## Project Structure

```
root-project/
│
├── frontend/
│   └── (frontend files and folders)
│
└── minty/
    ├── src/
    │   ├── index.js
    │   ├── minty.js
    │   └── deploy.js
    ├── contracts/
    │   ├── Minty.sol
    │   └── Auction.sol
    ├── asserts/
    │   ├── Eagle.jpg
    │   └── Rabbit.jpg
    ├── hardhat.config.js
    └── package.json
```

## Minty

Minty is a command-line tool for minting NFTs and interacting with the smart contract.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- IPFS daemon running locally (or access to a remote IPFS node)

### Installation

1. Clone this repository and move into the `minty` directory:

    ```shell
    git clone https://github.com/your-repo/nft-project
    cd minty
    ```

2. Install the NPM dependencies:

    ```shell
    npm install
    ```

3. Add the `minty` command to your `$PATH`. This makes it easier to run Minty from anywhere on your computer:

    ```
    npm link
    ```

4. Run the `start-local-environment.sh` script to start the local Ethereum testnet and IPFS daemon:

    ```shell
    ./start-local-environment.sh
    ```

   This command continues to run. All further commands must be entered in another terminal window.

### Usage

Run `minty help` to see full usage instructions or `minty help <command>` for help on a specific command.

1. Deploy the smart contracts:
   ```
   minty deploy --name "Animal" --symbol "ANM"
   ```

2. Mint an NFT:
   ```
   minty mint ./asserts/Eagle.jpg
   ```
   Follow the prompts to enter the name and description for your NFT.

3. View NFT details:
   ```
   minty show <token-id>
   ```

4. Transfer an NFT:
   ```
   minty transfer <token-id> <to-address>
   ```

5. Pin NFT data to IPFS:
   ```
   minty pin <token-id>
   ```

## Frontend

The frontend provides a web interface for users to interact with the NFT platform.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Usage

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000` (or the port specified in your frontend configuration).

## Configuration

Configuration files are stored in [`./config/default.js`](./config/default.js).

The `pinningService` configuration option is used by the `minty pin` command to persist IPFS data to a remote pinning service. See the [Configuration section in the original README](#configuration) for more details on setting up environment variables for pinning services.

## Smart Contracts

- `Minty.sol`: ERC721 token implementation for NFTs
- `Auction.sol`: Smart contract for NFT auctions

## Development

- To modify smart contracts, edit the files in the `minty/contracts/` directory.
- After modifying contracts, recompile them:
  ```
  npx hardhat compile
  ```
- To update the frontend to interact with new contract functions, modify the relevant components and API calls in the frontend code.

## Testing

- Run Minty tests:
  ```
  cd minty
  npx hardhat test
  ```

- Run Frontend tests:
  ```
  cd frontend
  npm test
  ```

## Troubleshooting

- Ensure IPFS daemon is running when minting NFTs
- Check that you're connected to the correct Ethereum network in MetaMask when using the frontend
- Verify that smart contract addresses in the frontend configuration match the deployed contract addresses

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.