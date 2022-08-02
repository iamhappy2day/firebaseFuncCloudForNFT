const functions = require("firebase-functions");

const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { Metaplex, isErrorWithLogs } = require("@metaplex-foundation/js");

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const metaplex = new Metaplex(connection);

exports.checkNftOriginal = functions.https.onRequest(
  async (request, response) => {
    try {
      const { mintAddress } = request.body;

      if (!mintAddress) {
        return response.status(400).send({
          status: "Fail",
          message: "Please provide correct NFT address",
        });
      }

      const mintPubKey = new PublicKey(mintAddress);
      const task = metaplex.nfts().findByMint(mintPubKey);
      const nft = await task.run();

      // check if nft original by "verified" field
      nft.creators[0].verified
        ? response.status(200).send({
            status: "Success",
            message: "NFT verified. It's original",
          })
        : response.status(200).send({
            status: "Attention",
            message: "NFT is not original and not verified",
          });
    } catch (err) {
      response.send(err.message);
    }
  }
);
