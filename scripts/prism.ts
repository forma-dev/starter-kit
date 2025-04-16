export const prismErc1155Config = {
  address: "0xB3cC208fE876baB66f0f1e2920eE3b9E7c2E198A", // address of the deployed contract (fill in after deploying)
  contractMetadata: {
    name: "Prism",
    description: "Contract/collection description here.",
    image: "ipfs://QmWJychYXmPe1uyhhVH4Y2EbqDLZJTBCqn76rVC9S4okHK",
  },
  tokens: [
    {
      id: 1,

      // initial max supply of token; can be updated later
      maxSupply: 1000,

      // whether the token is cemented (metadata cannot be changed after creation)
      cemented: false,

      // token metadata
      metadata: {
        name: "Token Name Goes Here",
        description: "Token description goes here.",

        // full size image
        image: "ipfs://...",

        // thumbnail image
        thumbnail: "ipfs://...",

        // add any tags here (remove if not needed)
        tags: [],

        // add creator addresses here (remove if not needed)
        creators: [],

        // add any token attributes here (remove if not needed)
        attributes: [
          {
            trait_type: "Attribute Name",
            value: "Attribute Value",
          },
        ],

        // add any file formats here (e.g, of image and thumbnail)
        formats: [
          {
            uri: "ipfs://...",
            mime_type: "image/png",
            file_size: 123456789, // file size in bytes
            file_name: "prism-full.png", // file name
            dimensions: {
              value: "2048x2048", // dimensions in pixels
              unit: "px", // unit of measurement
            },
            hash: {
              // sha-256 hash of the file
              value: "18e2439ecb29e08cb1fd939e068d1a73120e84f0c0577da3347f69f874798e42",
              algo: "sha-256",
            },
          },
          {
            uri: "ipfs://...",
            mime_type: "image/png",
            file_size: 123456789, // file size in bytes
            file_name: "prism-thumbnail.png", // file name
            dimensions: {
              value: "600x600", // dimensions in pixels
              unit: "px", // unit of measurement
            },
            hash: {
              // sha-256 hash of the file
              value: "18e2439ecb29e08cb1fd939e068d1a73120e84f0c0577da3347f69f874798e42",
              algo: "sha-256",
            },
          },
        ],
      },
    },
  ],
};
