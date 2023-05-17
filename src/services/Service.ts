import Cookies from "js-cookie";

export class Service {
  URL = process.env.NEXT_PUBLIC_URL;
  async get(url: string) {
    console.log(`Bearer ${Cookies.get("token")}`);
    return await fetch(this.URL + url, {
      next: { revalidate: 0 },
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
        "content-type": "application/json",
      },
    });
  }
  async post(url: string, body: object = {}) {
    console.log(`Bearer ${Cookies.get("token")}`);
    return await fetch(this.URL + url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
}
