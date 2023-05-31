const fetch = require("node-fetch");
const readline = require("readline-sync");
const delay = require("delay");

function formatRupiah(amount) {
  const rupiah = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp${rupiah}`;
}
const Cekstock = (idproduct, idtokoh) =>
  new Promise((resolve, reject) => {
    fetch(
      `https://mall.shopee.co.id/api/v4/pdp/get?apm_fs=true&apm_p=7&apm_pid=shopee%2F%40shopee-rn%2Fproduct-page%2FPRODUCT_PAGE&item_id=${idtokoh}&shop_id=${idproduct}`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9",
          "sec-ch-ua":
            '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
      }
    )
      .then((res) => resolve(res.json()))
      .catch((err) => reject(err));
  });
const GetId = (link) =>
  new Promise((resolve, reject) => {
    fetch(link, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua":
          '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      redirect: "manual",
    })
      .then((res) => resolve(res.headers.raw()))
      .catch((err) => reject(err));
  });
const tokenbot = "5355944753:AAEtRCVtJH7Og-9oMEtzIWxLwncIc2ZCtdU"; //buat & ambil tokenbot dari BotFather https://t.me/BotFather
const idTele = "991756526"; //ambil id akun Telegram mu menggunakan https://t.me/get_id_bot

const sendNotifier = (pesan) => {
  fetch(
    `https://api.telegram.org/bot${tokenbot}/sendMessage?chat_id=${idTele}&text=${pesan}&parse_mode=MarkDown`,
    {
      method: "GET",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
      },
    }
  );
};
(async () => {
  let validasi;
  const link = readline.question("Masukan Link : ");
  do {
    await delay(2000);
    const CekProduct = await GetId(link);
    // console.log(decodeURIComponent(CekProduct.location[0]));
    const id = decodeURIComponent(CekProduct.location[0]).split("/product/");
    const CekData = await Cekstock(
      id[1].split("/")[0],
      id[1].split("/")[1].split("?")[0]
    );
    // console.log(CekData);
    let nominal = CekData.data.item.price;
    console.log("Name Product : " + CekData.data.item.title);
    console.log("Harga : Rp. " + nominal);
    console.log("Stock : " + CekData.data.item.stock);
    if (CekData.data.item.stock > 0) {
      const pesan = `
      *Info ngab!!*\n
       -Name Product :  ${
         CekData.data.item.title
       } \n -Harga : Rp. ${nominal} \n -Stock : ${
        CekData.data.item.stock
      }\n -Link Product :  https://shopee.co.id/universal-link/product/${
        id[1].split("/")[0]
      }/${id[1].split("/")[1].split("?")[0]}`;
      console.log(pesan);
      for (let index = 0; index < 10; index++) {
        await sendNotifier(pesan);
        await delay(2000);
      }
      break;
    } else {
      console.log("Not Found !! Sleep Again 5 Second");
    }
  } while (true);
})();
