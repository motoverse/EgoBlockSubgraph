import { Address } from "@graphprotocol/graph-ts";
import {
  ERC721,
  Transfer
} from "../generated/ERC721/ERC721"
import { NFT, Wallet } from "../generated/schema"


export function handleTransfer(event: Transfer): void {
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

    // Get metadata
    const contract = ERC721.bind(Address.fromString(contractAddress));
    const tokenURI = contract.try_tokenURI(event.params.tokenId);
    if (!tokenURI.reverted) {
      NFTentity.tokenURI = tokenURI.value;
    }
  }


  NFTentity.owner = newOwner;

  NFTentity.save()
}
