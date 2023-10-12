const NETWORK_ID = 11155111;
export const loadContract = async (name, provider) => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();
  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new provider.eth.Contract(
      Artifact.abi,
      "0xf018D0FcE830eb2CC64d8240Fd4b30363903313E"
    );
    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded!`);
  }
};
