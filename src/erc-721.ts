import {
  Transfer
} from "../generated/ERC721/ERC721"
import { NFT, Wallet } from "../generated/schema"


export function handleTransfer(event: Transfer): void {
  // TODO how to get collection address
  const contractAddress = event.address.toHex();
  const tokenId = event.params.tokenId.toHex();

  const NFTId = contractAddress + "-" + tokenId;

  const newOwner = event.params.to.toHex();
  const ownerEntity = Wallet.load(newOwner);
  if ( ownerEntity == null ) {
    // Ensure owner exists
    const newOwnerEntity = new Wallet(newOwner);
    newOwnerEntity.save();
  }

  let NFTentity = NFT.load(NFTId);
  if ( NFTentity == null ) {
    NFTentity = new NFT(NFTId);
    NFTentity.contractAddress = contractAddress;
    NFTentity.tokenId = tokenId;
  }


  NFTentity.owner = newOwner;

  NFTentity.save()
}
