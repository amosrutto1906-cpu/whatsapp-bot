const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        auth: state,
        version
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
        const { connection } = update

        if (connection === "open") {
            console.log("✅ Connected to WhatsApp")
        }

        if (connection === "close") {
            console.log("❌ Connection closed, retrying...")
            startBot()
        }
    })

    // 🔥 THIS IS THE IMPORTANT PART (PAIRING CODE)
    if (!sock.authState.creds.registered) {
        const phoneNumber = "2547XXXXXXXX" // 👉 PUT YOUR NUMBER HERE

        const code = await sock.requestPairingCode(phoneNumber)
        console.log("📲 Your pairing code:", code)
    }
}

startBot()
