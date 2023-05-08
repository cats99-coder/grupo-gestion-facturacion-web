export class Service {
  URL = process.env.URL;
  async get(url: string) {
    return await fetch(this.URL + url);
  }
  async post(url: string, body: object = {}) {
    return await fetch(this.URL + url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
}
