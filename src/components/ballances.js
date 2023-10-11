import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { loadContract } from "../utils/load-contract";
import detectEthereumProvider from "@metamask/detect-provider";
import { Link } from "react-router-dom";
const textModal = ["withdraw from", "transfer on"];
const web3Problem = () => (
  <>
    <main className="h-100 is-flex ai-c jc-c">
      <div className="box is-flex flex-column ai-c jc-c">
        <h4>MetaMask is not installed!</h4>
        <a className="button is-light is-info" href="/some">
          Install MetaMask
        </a>
      </div>
    </main>
  </>
);
const Ballances = () => {
  const [web3Api, setWeb3] = useState({
    web3: null,
    provider: null,
    contract: null,
    isProviderLoaded: false,
  });
  const [account, setAccount] = useState(null);
  const [shouldReload, reload] = useState(false);
  const [ballance, setBallance] = useState(0);
  const [showModal, setModal = () => (showModal ? false : true)] =
    useState(false);
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);
  const [chainFunc, setFunc] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [cannotConnect, setConnect] = useState(false);
  const [isRequstHere, setRequest] = useState(false);
  const [transactionSucces, setSucces] = useState(false);
  const [txInput, setInput] = useState("");
  const func = [
    async () => {
      const { contract, web3 } = web3Api;
      console.log(account);
      await contract.methods
        .withdraw(web3.utils.toWei(txInput, "ether"))
        .send({ from: account });
      reloadEffect();
    },

    async () => {
      const { contract, web3 } = web3Api;
      await contract.methods.addFunds().send({
        from: account,
        value: web3.utils.toWei(txInput, "ether"),
      });
      reloadEffect();
    },
  ];

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());
  };

  const requestAccount = async () => {
    const time = setTimeout(() => {
      setLoading(false);
      setConnect(true);
    }, 6500);
    try {
      await web3Api.provider.request({ method: "eth_requestAccounts" });
    } catch (e) {
      setRequest(true);
    }
    setLoading(false);
    window.clearTimeout(time);
  };
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        const contract = await loadContract("Faucet", web3);
        // console.log(contract);
        setAccountListener(provider);
        setWeb3({
          web3,
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3((api) => ({ ...api, isProviderLoaded: true }));
        console.error("Please, install Metamask.");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    // const { web3 } = web3Api;
    if (web3Api.web3) {
      const getAccount = async () => {
        const accounts = await web3Api.web3.eth.getAccounts();
        if (accounts[0]) {
          const ballance = await web3Api.web3.eth.getBalance(accounts[0]);
          setBallance(
            Number(web3Api.web3.utils.fromWei(ballance, "ether")).toFixed(4)
          );
        }
        setAccount(accounts[0]);
      };
      getAccount();
    }
  }, [web3Api.web3, shouldReload]);

  const sendTransaction = async () => {
    setRequest(false);
    setConnect(false);
    setLoading(true);
    setSucces(false);
    const time = setTimeout(() => {
      setLoading(false);
      setConnect(true);
      setSucces(false);
    }, 3500);

    try {
      await func[chainFunc]();
      window.clearTimeout(time);
      setLoading(false);
      setSucces(true);
      setTimeout(() => {
        setModal(false);
        setSucces(false);
      }, 1000);
    } catch (e) {
      setConnect(true);
    }
  };
  const modal = () => (
    <>
      <div className={`modal ${showModal && "is-active"}`}>
        <div
          className="modal-background"
          onClick={() => {
            setModal();
          }}
        ></div>
        <div className="modal-content box is-flex ai-c jc-c fg-4 flex-column">
          <h4>
            {transactionSucces
              ? "Transaction succesefull."
              : isLoading
              ? "Loading..."
              : cannotConnect
              ? "Check your MetaMask"
              : isRequstHere
              ? "Something wend wrong. Check your connection..."
              : `Choose value to ${textModal[chainFunc]} the chain`}
          </h4>
          <input
            className="input is-primary mt-2"
            value={txInput}
            onChange={(e) => {
              setInput(e.target.value);
              console.log(e.target.value);
            }}
            type="text"
            placeholder="0.01"
          />
          <div className="mx--2 w-100 is-flex sp-b">
            <button
              className={`w-120 button is-primary mt-2 as-c ${
                isLoading && "is-loading"
              }`}
              onClick={() => {
                sendTransaction();
                setInput("");
              }}
            >
              Submit
            </button>
            <button
              className={` ${
                isLoading && "is-light"
              } w-120 button is-danger mt-2 as-c`}
              onClick={() => {
                setModal(!showModal);
                setInput("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
  const ballances = () => (
    <>
      {modal()}
      <main className="h-100 is-flex flex-column ai-c jc-c ">
        <div className="box is-flex flex-column">
          <p>
            <strong>Address:</strong> {account}
          </p>
          <p>
            <strong>Ballance:</strong> {ballance} ETH
          </p>
          <div className="is-flex fg-4 sp-b">
            <button
              className="w-120 button is-primary is-light mt-4 as-c"
              onClick={() => {
                setFunc(1);
                setModal(!showModal);
              }}
            >
              Add Funds
            </button>
            <Link className="w-120 button is-info is-light mt-4 as-c" to="/">
              Go Back
            </Link>
            <button
              className="w-120 button is-danger is-light mt-4 as-c"
              onClick={() => {
                setFunc(0);
                setModal(!showModal);
              }}
            >
              Withdraw
            </button>
          </div>
        </div>
      </main>
    </>
  );
  const accountProblem = () => (
    <>
      <main className="h-100 is-flex ai-c jc-c ">
        <div className="box is-flex ai-c jc-c flex-column">
          <h4>
            {isLoading
              ? "Loading..."
              : cannotConnect
              ? isRequstHere
                ? "Check your MetaMask extension"
                : "Something went worng. Try again"
              : "Account is not connected!"}
          </h4>
          <button
            className={`button is-light is-info mt-3 ${
              isLoading && "is-loading"
            }`}
            onClick={() => {
              setLoading(true);
              requestAccount();
            }}
          >
            Connect Account
          </button>
        </div>
      </main>
    </>
  );
  const getContent = () => <>{account ? ballances() : accountProblem()}</>;
  return <>{web3Api.web3 ? getContent() : web3Problem()}</>;
};
export default Ballances;
