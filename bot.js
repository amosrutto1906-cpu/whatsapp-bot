const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
})
    })
    
    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update

        if (qr) {
            console.log("📱 Scan this QR code:")
            qrcode.generate(qr, { small: true })
        }

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
