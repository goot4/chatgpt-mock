
export async function chat(apiKey:string, messages: object[]){
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-3.5-turbo",
        "messages": messages,
      })
    })
    if (!response.ok) {
      console.log(response.statusText)
      return
    }
    const data = await response.json()
    console.log(data)
    return data.choices[0].message.content
  }
  catch (error){
    console.error(error)
  }
}