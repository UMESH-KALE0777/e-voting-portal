// client/src/utils/generateVoteHash.js

 
const generateVoteHash = async (voteData) => {
   
  const payload = JSON.stringify({
    ...voteData,
    _ts: Date.now(), 
  });

   
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);

   
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
};

export default generateVoteHash;

 