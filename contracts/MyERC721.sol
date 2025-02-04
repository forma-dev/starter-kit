// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ContractMetadata } from "@forma-dev/sdk/contracts/metadata/ContractMetadata.sol";
import { ERC721Cementable } from "@forma-dev/sdk/contracts/token/ERC721/ERC721Cementable.sol";
import { Ownable, Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { ERC721 as ERC721OpenZeppelin } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyERC721 is Ownable2Step, ContractMetadata, ERC721Cementable {
    uint256 private _nextTokenId;

    constructor(
        string memory _name,
        string memory _symbol,
        address _initialOwner,
        address _defaultRoyaltyReceiver,
        uint96 _defaultRoyaltyFeeNumerator
    ) ERC721OpenZeppelin(_name, _symbol) Ownable(_initialOwner) {
        _setDefaultRoyalty(_defaultRoyaltyReceiver, _defaultRoyaltyFeeNumerator);
        _nextTokenId = 1;
    }

    function mint(address _to, string memory _metadata) external onlyOwner {
        _mint(_to, _nextTokenId);
        _setTokenMetadata(_nextTokenId, _metadata);
        _nextTokenId++;
    }

    /**
     * @dev Sets the royalty information that all ids in this contract will default to.
     *
     * Requirements:
     *
     * - `receiver` cannot be the zero address.
     * - `feeNumerator` is the number of basis points (1/10000).
     */
    function setDefaultRoyalty(address _receiver, uint96 _feeNumerator) external onlyOwner {
        _setDefaultRoyalty(_receiver, _feeNumerator);
    }

    function setTokenRoyalty(uint256 _tokenId, address _receiver, uint96 _feeNumerator) external onlyOwner {
        _setTokenRoyalty(_tokenId, _receiver, _feeNumerator);
    }

    function name() public view override(ERC721OpenZeppelin, ContractMetadata) returns (string memory) {
        return ContractMetadata.name();
    }

    function _canSetContractMetadata() internal view override returns (bool) {
        return owner() == _msgSender();
    }

    /// @dev Returns whether token metadata can be set in the given execution context.
    function _canSetTokenMetadata(uint256) internal view override returns (bool) {
        return owner() == _msgSender();
    }
}
