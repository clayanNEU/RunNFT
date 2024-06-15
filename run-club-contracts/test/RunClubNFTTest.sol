// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/RunClubNFT.sol";

contract RunClubNFTTest is Test {
    RunClubNFT nft;
    address testAddress = address(0x123);

    function setUp() public {
        nft = new RunClubNFT(address(this));
    }

    function testMint() public {
        nft.mint(testAddress, "https://example.com/nft-metadata");
        assertEq(nft.ownerOf(0), testAddress);
    }

    function testSetRoyaltyInfo() public {
        nft.setRoyaltyInfo(address(this), 500);
        (address receiver, uint256 royaltyAmount) = nft.royaltyInfo(0, 10000);
        assertEq(receiver, address(this));
        assertEq(royaltyAmount, 500);
    }
}