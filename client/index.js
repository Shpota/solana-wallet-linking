const getProvider = () => {
    if ('phantom' in window) {
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) {
            return provider;
        }
    }
    window.open('https://phantom.app/', '_blank');
};

const render = async () => {
    const provider = getProvider();
    if (provider?.isConnected) {
        const html = `
            <h1>Your Wallet:</h1> 
            <div>${provider.publicKey.toString()}</div>
            <button onclick="signMessage()">Sign a Message</button>`;
        document.getElementById("app").innerHTML = html;
    } else {
        const html = `
            <h1>Connect your Phantom wallet</h1>
            <button onclick="connectPhantom()">Connect Phantom</button>`;
        document.getElementById("app").innerHTML = html;
    }
};

const connectPhantom = async () => {
    const provider = getProvider();
    await provider.request({ method: "connect" });
    render();
};

const signMessage = async () => {
    const provider = getProvider();
    const encodedMessage = new TextEncoder().encode('You are verifying your wallet with sol4k');
    const signedMessage = await provider.signMessage(encodedMessage, "utf8");
    const base58 = await import("bs58");
    const walletAddress = provider.publicKey.toString();
    console.log("Wallet Address:", walletAddress);
    const signature = base58.encode(signedMessage.signature);
    console.log("Base58-encoded signature:", signature);
    // calling the backend to verify the signature
    const response = await fetch('http://localhost:8080/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signature, walletAddress })
    });
    const verified = await response.text();

    const html = `
        <h1>Your Wallet:</h1> 
        <div>${provider.publicKey.toString()}</div>
        <button onclick="signMessage()">Sign a Message</button>
        <h1>Verifications was ${verified ? "SUCCESSFUL" : "UNSUCCESSFUL"}</h1>`;
    document.getElementById("app").innerHTML = html;
};
