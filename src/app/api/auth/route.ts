export async function POST(request: Request) {
  const res = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    body: request.body,
    headers: {
        'content-type': 'application/json'
    },
  }).then(async (response)=> {
    const res = await response.json()
    console.log(res)
    return res
  });
  return new Response(res);
}
