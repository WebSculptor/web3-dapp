import { useState } from "react";

import { ethers } from "ethers";
import toast from "react-hot-toast";

import CONTRACT_ABI from "./abi.json";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [reteriveredMessage, setReteriveredMessage] = useState("");

  const { Contract, BrowserProvider } = ethers;
  const CONTRACT_ADDRESS = "0x921cf7dEe0FfbD1f2A727F7E587668e6424A195e";

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function sendMessageHandler() {
    setIsLoading(true);
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      try {
        if (initialMessage === "") {
          setIsError("Message field must not be empty!");
          return;
        } else {
          const transaction = await contract.setMessage(initialMessage);
          await transaction.wait();
          toast.success("Message set successfully!");
          setIsError("");
          setInitialMessage("");
          setIsSuccess(true);
        }
      } catch (err) {
        setIsError("Could not set initial message");
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function getMessageHandler() {
    setIsGetting(true);
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      try {
        const transaction = await contract.getMessage();
        setReteriveredMessage(transaction);
        toast.success("Message reterivered successfully!");
      } catch (err) {
        setIsError("Could not get transaction");
      } finally {
        setIsGetting(false);
      }
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-6 border rounded-md">
        <div className="flex flex-col space-y-3">
          <div className="">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder=""
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
              />
              <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Enter your message
              </label>
            </div>
            {isError && (
              <p className="flex items-center gap-1 mt-2 font-sans text-[13px] antialiased font-normal leading-normal text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 -mt-px">
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"></path>
                </svg>
                {isError}
              </p>
            )}
          </div>

          <button
            className="middle none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
            onClick={sendMessageHandler}
            disabled={isLoading}>
            {isLoading ? "Please wait..." : "Send Message"}
          </button>
        </div>

        {isSuccess && (
          <>
            <div className="h-[1px] w-full bg-gray-300 my-4" />

            <button
              className="middle none rounded-lg bg-gray-900 mb-4 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
              onClick={getMessageHandler}
              disabled={isGetting}>
              {isGetting ? "Getting Message..." : "Reterivere Message"}
            </button>

            <p>
              Reterivered Message:{" "}
              <span className="font-medium text-blue-600">
                {reteriveredMessage}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
