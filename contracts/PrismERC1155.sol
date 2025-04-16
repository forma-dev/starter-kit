// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ContractMetadata } from "@forma-dev/sdk/contracts/metadata/ContractMetadata.sol";
import { ERC1155Cementable } from "@forma-dev/sdk/contracts/token/ERC1155/ERC1155Cementable.sol";
import { Ownable, Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { ERC1155 as ERC1155OZ } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract PrismERC1155 is Ownable2Step, ContractMetadata, ERC1155Cementable {
    struct Storage {
        mapping(address => bool) minters;
        uint256 maxSupply;
    }

    mapping(uint256 => Storage) private _storage;

    modifier onlyMinter(uint256 _tokenId) {
        require(_storage[_tokenId].minters[_msgSender()], "Invalid minter");
        _;
    }

    constructor(address _initialOwner) ERC1155OZ("") Ownable(_initialOwner) {}

    function create(
        uint256 _tokenId,
        string calldata _metadata,
        bool _cemented,
        uint256 _maxSupply,
        address _minter
    ) external onlyOwner returns (uint256) {
        require(!_exists(_tokenId), "Token already exists");
        _setTokenMetadata(_tokenId, _metadata);
        if (_cemented) {
            _cementTokenMetadata(_tokenId);
        }
        if (_maxSupply > 0) {
            _storage[_tokenId].maxSupply = _maxSupply;
        }
        if (_minter != address(0)) {
            _storage[_tokenId].minters[_minter] = true;
        }
        return _tokenId;
    }

    function mint(address _to, uint256 _tokenId, uint256 _amount) public onlyMinter(_tokenId) {
        require(_exists(_tokenId), "Invalid tokenId");
        require(balanceOf(_to, _tokenId) == 0, "Address has already minted this token");
        _mint(_to, _tokenId, _amount, "");
    }

    function grantMinter(uint256 _tokenId, address _minter) external onlyOwner {
        _storage[_tokenId].minters[_minter] = true;
    }

    function revokeMinter(uint256 _tokenId, address _minter) external onlyOwner {
        delete _storage[_tokenId].minters[_minter];
    }

    function renounceMinter(uint256 _tokenId) external onlyOwner {
        delete _storage[_tokenId].minters[_msgSender()];
    }

    function setMaxSupply(uint256 _tokenId, uint256 _maxSupply) external onlyOwner {
        require(_exists(_tokenId), "Invalid tokenId");
        require(
            _maxSupply == 0 || _maxSupply >= totalSupply(_tokenId),
            "Max supply cannot be less than current supply"
        );

        _storage[_tokenId].maxSupply = _maxSupply;
    }

    function getMaxSupply(uint256 _tokenId) external view returns (uint256) {
        return _storage[_tokenId].maxSupply;
    }

    function _canSetContractMetadata() internal view override returns (bool) {
        return owner() == _msgSender();
    }

    /// @dev Returns whether token metadata can be set in the given execution context.
    function _canSetTokenMetadata(uint256) internal view override returns (bool) {
        return owner() == _msgSender();
    }

    /**
     * @dev See {ERC1155-_update}.
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        // Only allow minting (from = address(0))
        if (from != address(0)) {
            revert("Token transfers not allowed");
        }

        // Check max supply for all tokens being minted
        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 maxSupply = _storage[ids[i]].maxSupply;
                if (maxSupply > 0) {
                    uint256 newSupply = totalSupply(ids[i]) + values[i];
                    require(newSupply <= maxSupply, "Exceeds max supply");
                }
            }
        }

        super._update(from, to, ids, values);
    }
}
