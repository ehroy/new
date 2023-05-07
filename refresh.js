const ALMIRA = require("./lib/index");
var GibberishAES = require("./aes");
const fs = require("fs-extra");
const { randomBytes } = require("crypto");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Asia/Jakarta");
var delay = require("delay");
const randstrs = (length) =>
  new Promise((resolve, reject) => {
    var text = "";
    var possible = "1234567890qwertyuiopasdfghjklzxcvbnm";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    resolve(text);
  });
function bulk(
  tokendata,
  pharse,
  privatekeybot,
  address,
  privatekeyasli,
  addressbtc,
  addresstrx
) {
  (async () => {
    const data = new ALMIRA();
    // console.log(data);
    const Claim = await data.Refresh(tokendata);
    // console.log(Claim);
    if (Claim["message"]) {
      console.log(Claim["message"]);
      fs.appendFileSync(
        "dataalmirareferesh.txt",
        `${Claim.data.my_refferal_code}|${Claim.data.access_token}|${Claim.data.device_token}|${pharse}|${Claim.data.refresh_token}|${privatekeybot}|${address}|${privatekeyasli}|${addressbtc}|${addresstrx}|${privatekeyasli}\n`
      );
      await delay(500);
      console.log(address);
      console.log(Claim.data.access_token);

      GibberishAES.size(256);
      const encription = GibberishAES.enc(
        JSON.stringify({
          wallet_address: address,
          amount: "100",
        }),
        "ceb7rqsYhMZ03ENDfQZUo0C6oHeh3Oyq",
        randomBytes(8)
      );
      let tokendatas = "";
      let dataawal = encription.split("\n");
      for (i in dataawal) {
        tokendatas += dataawal[i];
      }
      const Wd = await data.ClaimReward(tokendatas, Claim.data.access_token);
      console.log(Wd);
      fs.appendFileSync("logstatus.txt", `${address} => ${Wd}\n`);
    } else {
      console.log("Gagal Login");
    }
  })();
}
(async () => {
  while (true) {
    console.log(new Date().toLocaleTimeString());
    if (new Date().toLocaleTimeString() == "07:00:00") {
      const dataakun = fs.readFileSync("data.txt", "utf8").split("\r\n");

      for (let i in dataakun) {
        // console.log(dataakun[i].split("|"));
        const token = dataakun[i].split("|")[1];
        const address = dataakun[i].split("|")[6];
        const privatekeybot = dataakun[i].split("|")[5];
        const privatekeyasli = dataakun[i].split("|")[7];
        const addressbtc = dataakun[i].split("|")[8];
        const addresstrx = dataakun[i].split("|")[9];
        const devicetoken = dataakun[i].split("|")[2];
        const pharse = dataakun[i].split("|")[3];

        GibberishAES.size(256);
        const encription = GibberishAES.enc(
          JSON.stringify({
            wallet_address: address,
            device_id: randstrs(16),
            btc_address: addressbtc,
            eth_address: address,
            bnb_address: address,
            trx_address: addresstrx,
            address_type: "eth",
            device_token: devicetoken,
            device_type: 1,
            is_production: 1,
            addressList: [
              {
                symbol: "eth",
                address: address,
              },
              {
                symbol: "bnb",
                address: address,
              },
              {
                symbol: "btc",
                address: addressbtc,
              },
              { symbol: "trx", address: addresstrx },
            ],
          }),
          "ceb7rqsYhMZ03ENDfQZUo0C6oHeh3Oyq",
          randomBytes(8)
        );
        let tokendata = "";
        let dataawal = encription.split("\n");
        for (i in dataawal) {
          tokendata += dataawal[i];
        }
        // console.log(address);
        // console.log(email);
        bulk(
          tokendata,
          pharse,
          privatekeybot,
          address,
          privatekeyasli,
          addressbtc,
          addresstrx,
          devicetoken
        );
      }
      break;
    } else {
      continue;
    }
  }
})();
