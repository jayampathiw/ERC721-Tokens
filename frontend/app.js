const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let tokenContract;

const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace with your contract address
const tokenAbi = [
  "constructor(string tokenName, string symbol)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  "event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)",
  "event MetadataUpdate(uint256 _tokenId)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function balanceOf(address owner) view returns (uint256)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function mintToken(address owner, string metadataURI) returns (uint256)",
  "function name() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)",
  "function setApprovalForAll(address operator, bool approved)",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function transferFrom(address from, address to, uint256 tokenId)",
];

async function connectWallet() {
  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("Connected wallet address:", address);

    tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
    console.log("Contract instance created");

    document.getElementById("walletStatus").textContent =
      "Wallet Connected: " + address;
    await updateContractInfo();
    await displayNFTs();
    await verifyContract();
  } catch (error) {
    console.error("Error connecting wallet:", error);
    document.getElementById("walletStatus").textContent =
      "Error Connecting Wallet";
  }
}

async function verifyContract() {
  try {
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();
    console.log("Contract verified. Name:", name, "Symbol:", symbol);
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

async function updateContractInfo() {
  try {
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();

    document.getElementById("contractName").textContent = name;
    document.getElementById("contractSymbol").textContent = symbol;
    // Remove totalSupply as it's not in the ABI
    document.getElementById("totalSupply").textContent = "N/A";
  } catch (error) {
    console.error("Error updating contract info:", error);
    document.getElementById("contractName").textContent = "Error";
    document.getElementById("contractSymbol").textContent = "Error";
    document.getElementById("totalSupply").textContent = "Error";
  }
}

const IPFS_GATEWAYS = ["http://localhost:8080/ipfs/"];

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function tryFetchMetadata(uri) {
  console.log("Attempting to fetch metadata from URI:", uri);

  if (uri.startsWith("http")) {
    try {
      const response = await fetchWithTimeout(uri);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${uri}:`, error);
    }
  }

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = uri.replace("ipfs://", gateway);
      console.log("Trying gateway:", url);
      const response = await fetchWithTimeout(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${gateway}:`, error);
    }
  }
  throw new Error("Failed to fetch metadata from all sources");
}

async function displayNFTs() {
  const address = await signer.getAddress();
  const balance = await tokenContract.balanceOf(address);
  console.log("NFT balance:", balance.toString());
  const gallery = document.getElementById("nftGallery");
  gallery.innerHTML = "";

  for (let i = 0; i < balance; i++) {
    try {
      const tokenId = i + 1;
      const owner = await tokenContract.ownerOf(tokenId);

      if (owner.toLowerCase() === address.toLowerCase()) {
        const tokenURI = await tokenContract.tokenURI(tokenId);
        console.log(`Token URI for NFT ${tokenId}:`, tokenURI);

        let metadata;
        try {
          metadata = await tryFetchMetadata(tokenURI);
          console.log(`Metadata for NFT ${tokenId}:`, metadata);
        } catch (error) {
          console.error(`Failed to fetch metadata for NFT ${tokenId}:`, error);
          continue; // Skip this NFT and move to the next one
        }

        const nftElement = document.createElement("div");
        nftElement.className = "bg-white p-4 rounded shadow";
        nftElement.innerHTML = `
                    <h3 class="font-bold">${metadata.name || "Unnamed NFT"}</h3>
                    <p class="text-sm">${
                      metadata.description || "No description"
                    }</p>
                    <p class="text-xs mt-2">Token ID: ${tokenId}</p>
                `;

        if (metadata.image) {
          const imgElement = document.createElement("img");
          imgElement.src = metadata.image.replace("ipfs://", IPFS_GATEWAYS[0]);
          imgElement.alt = metadata.name || "NFT Image";
          imgElement.className = "w-full h-40 object-cover mb-2";
          imgElement.onerror = () => {
            imgElement.src =
              "https://via.placeholder.com/400x300?text=Image+Not+Available";
          };
          nftElement.prepend(imgElement);
        }

        gallery.appendChild(nftElement);
      }
    } catch (error) {
      console.error(`Error processing NFT ${i + 1}:`, error);
    }
  }
}

document
  .getElementById("connectWallet")
  .addEventListener("click", connectWallet);
document.getElementById("mintButton").addEventListener("click", mintToken);
document
  .getElementById("transferButton")
  .addEventListener("click", transferToken);
document
  .getElementById("approveButton")
  .addEventListener("click", approveToken);
