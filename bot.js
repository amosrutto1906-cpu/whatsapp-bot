const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true   // 🔥 THIS IS IMPORTANT
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection } = update

        if (connection === "open") {
            console.log("✅ Connected to WhatsApp")
        }

        if (connection === "close") {
            console.log("❌ Connection closed, retrying...")
            startBot()
        }
    })
}

startBot()
