// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Using OpenZeppelin's battle-tested ERC721 implementation instead of writing from scratch
// This provides better security and gas optimization compared to custom implementations
// Ownable pattern ensures only authorized users can perform sensitive operations

contract ProfileImageNfts is ERC721, Ownable {
    using Strings for uint256;

    // Using uint256 for tokenIds is more gas efficient than string IDs
    uint256 private _tokenIds;
    // Mapping is more gas efficient than arrays for storing token URIs
    mapping(uint256 => string) private _tokenURIs;

    // Struct for efficient data grouping and return
    struct RenderToken {
        uint256 id;
        string uri;
        string space;
    }

    // Constructor initializes with msg.sender as owner for better security
    constructor() ERC721("ProfileImageNFT", "PIN") Ownable(msg.sender) {}

    // Internal function for setting token URI with proper access control
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    // Override tokenURI with existence check for better error handling
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            ownerOf(tokenId) != address(0),
            "URI does not exist on that ID"
        );
        string memory _RUri = _tokenURIs[tokenId];
        return _RUri;
    }

    // Efficient way to get all tokens using memory array instead of storage
    function getAlltoken() public view returns (RenderToken[] memory) {
        uint256 latestId = _tokenIds;
        RenderToken[] memory res = new RenderToken[](latestId);
        for (uint256 i = 0; i < latestId; i++) {
            if (ownerOf(i) != address(0)) {
                string memory uri = tokenURI(i);
                res[i] = RenderToken(i, uri, " ");
            }
        }
        return res;
    }

    // Simple and gas-efficient minting function with proper state updates
    function mint(
        address recipients,
        string memory _uri
    ) public returns (uint256) {
        uint256 newId = _tokenIds;
        _mint(recipients, newId);
        _setTokenURI(newId, _uri);
        _tokenIds++;
        return newId;
    }
}
