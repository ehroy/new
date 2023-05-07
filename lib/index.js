const fetch = require("node-fetch");
var randomize = require("randomatic");
// const { timeout = 0 } = options;

const controller = new AbortController();
const id = setTimeout(() => controller.abort(), 0);
class ALMIRA {
  constructor(Token) {
    this.Token = Token;
  }
  async ClaimReward(dataenc, Token) {
    const request = fetch(
      "https://api.almirawallet.com/api/v1/wallet/claim_rewards",
      {
        headers: {
          "X-Forwarded-For": `${""}${randomize("0", 3)}${"."}${randomize(
            "0",
            3
          )}${"."}${randomize("0", 3)}${"."}${randomize("0", 3)}${""}`,
          Host: "api.almirawallet.com",
          Authorization: Token,
          "Content-Type": "application/json",
          "User-Agent": "okhttp/4.9.0",
        },
        // redirect: "manual",
        body: JSON.stringify({ data: dataenc }),
        method: "POST",
      }
    ).then((res) => res.text());
    return await request;
  }
  async Refresh(dataenc) {
    const request = fetch("https://api.almirawallet.com/api/v1/user/login1", {
      headers: {
        "X-Forwarded-For": `${""}${randomize("0", 3)}${"."}${randomize(
          "0",
          3
        )}${"."}${randomize("0", 3)}${"."}${randomize("0", 3)}${""}`,
        Host: "api.almirawallet.com",
        Authorization: "",
        "Content-Type": "application/json",
        "User-Agent": "okhttp/4.9.0",
      },
      body: JSON.stringify({ data: dataenc }),
      method: "POST",
    }).then((res) => res.json());
    return await request;
  }
}
module.exports = ALMIRA;
