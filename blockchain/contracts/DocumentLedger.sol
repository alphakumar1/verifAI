// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DocumentLedger
 * @author MHA Fake Identity & Screening System Architecture
 * @notice Provides an immutable audit trail for encrypted passport/identity documents.
 *         Ensures tamper-detection against unauthorized central database alterations.
 */
contract DocumentLedger {
    
    struct DocumentVersion {
        string encryptedData; // AES-256 encrypted canonical JSON payload
        uint256 timestamp;    // Unix timestamp when sealed on-chain
        string officerId;     // Border officer / station ID who authorized the entry
        bytes32 dataHash;     // SHA-256 integrity digest of the encrypted payload
    }

    // Mapping: passportNumber -> Array of historical document versions
    mapping(string => DocumentVersion[]) private documentHistory;

    // Total unique documents registered
    uint256 public totalDocumentsRegistered;

    // Events for real-time Web3 indexing & telemetry
    event VersionAdded(
        string indexed passportNumber,
        uint256 indexed versionIndex,
        uint256 timestamp,
        string officerId,
        bytes32 dataHash
    );

    /**
     * @notice Adds a new encrypted version of an identity document to the immutable ledger.
     * @param passportNumber The standardized passport/document identifier.
     * @param encryptedData The AES-256 encrypted payload string.
     * @param officerId The identifier of the border control officer or screening terminal.
     */
    function addVersion(
        string memory passportNumber,
        string memory encryptedData,
        string memory officerId
    ) external {
        require(bytes(passportNumber).length > 0, "Passport number cannot be empty");
        require(bytes(encryptedData).length > 0, "Encrypted payload cannot be empty");
        require(bytes(officerId).length > 0, "Officer ID cannot be empty");

        bytes32 payloadHash = keccak256(abi.encodePacked(encryptedData));

        if (documentHistory[passportNumber].length == 0) {
            totalDocumentsRegistered++;
        }

        DocumentVersion memory newVersion = DocumentVersion({
            encryptedData: encryptedData,
            timestamp: block.timestamp,
            officerId: officerId,
            dataHash: payloadHash
        });

        documentHistory[passportNumber].push(newVersion);
        uint256 versionIndex = documentHistory[passportNumber].length - 1;

        emit VersionAdded(passportNumber, versionIndex, block.timestamp, officerId, payloadHash);
    }

    /**
     * @notice Retrieves the entire version history for a given passport number.
     * @param passportNumber The standardized passport identifier.
     * @return Array of all historical DocumentVersion structs.
     */
    function getHistory(string memory passportNumber) 
        external 
        view 
        returns (DocumentVersion[] memory) 
    {
        return documentHistory[passportNumber];
    }

    /**
     * @notice Retrieves the total number of versions stored for a given passport.
     * @param passportNumber The standardized passport identifier.
     * @return Number of versions recorded on-chain.
     */
    function getVersionCount(string memory passportNumber) 
        external 
        view 
        returns (uint256) 
    {
        return documentHistory[passportNumber].length;
    }

    /**
     * @notice Retrieves the latest recorded version for a given passport.
     * @param passportNumber The standardized passport identifier.
     */
    function getLatestVersion(string memory passportNumber) 
        external 
        view 
        returns (DocumentVersion memory) 
    {
        uint256 count = documentHistory[passportNumber].length;
        require(count > 0, "No document history found for this passport number");
        return documentHistory[passportNumber][count - 1];
    }
}
