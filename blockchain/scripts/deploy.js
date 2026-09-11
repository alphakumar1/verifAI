const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=================================================");
  console.log("🚀 DEPLOYING MHA IMMUTABLE DOCUMENT LEDGER");
  console.log("=================================================");

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployer Account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer Balance:", hre.ethers.formatEther(balance), "ETH");

  const DocumentLedger = await hre.ethers.getContractFactory("DocumentLedger");
  const contract = await DocumentLedger.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ DocumentLedger Successfully Deployed at:", contractAddress);

  // Read the compiled artifact ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/DocumentLedger.sol/DocumentLedger.json");
  if (!fs.existsSync(artifactPath)) {
    console.error("❌ Artifact not found at:", artifactPath);
    return;
  }
  const contractArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const exportData = {
    contractAddress: contractAddress,
    abi: contractArtifact.abi,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString()
  };

  // Export to backend app directory
  const backendOutputDir = path.join(__dirname, "../../backend/app");
  if (!fs.existsSync(backendOutputDir)) {
    fs.mkdirSync(backendOutputDir, { recursive: true });
  }
  const backendConfigPath = path.join(backendOutputDir, "blockchain_config.json");
  fs.writeFileSync(backendConfigPath, JSON.stringify(exportData, null, 2));
  console.log("📦 Exported Blockchain Config to Backend:", backendConfigPath);

  // Export to frontend src directory if exists or when created
  const frontendOutputDir = path.join(__dirname, "../../frontend/src");
  if (!fs.existsSync(frontendOutputDir)) {
    fs.mkdirSync(frontendOutputDir, { recursive: true });
  }
  const frontendConfigPath = path.join(frontendOutputDir, "blockchain_config.json");
  fs.writeFileSync(frontendConfigPath, JSON.stringify(exportData, null, 2));
  console.log("📦 Exported Blockchain Config to Frontend:", frontendConfigPath);

  console.log("=================================================");
  console.log("✨ BLOCKCHAIN DEPLOYMENT READY");
  console.log("=================================================");
}

main().catch((error) => {
  console.error("❌ Deployment failed with error:", error);
  process.exitCode = 1;
});
