// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract RunClubNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 public nextTokenId;

    constructor(address initialOwner) ERC721("RunClubNFT", "RCN") Ownable(initialOwner) {}

    /**
     * @notice Mint a new NFT
     * @param to The address to mint the NFT to
     * @param tokenURI The URI of the token metadata
     */
    function mint(address to, string memory tokenURI) external onlyOwner {
        _safeMint(to, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        nextTokenId++;
    }

    /**
     * @notice Set default royalty information
     * @param receiver The address to receive royalty payments
     * @param feeNumerator The royalty fee in basis points (e.g., 500 = 5%)
     */
    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}