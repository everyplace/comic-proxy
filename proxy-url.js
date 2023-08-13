
export const handler = async (event) => {
  console.log({
    file: 'proxy-url.js',
    action: 'handler(event)',
    event: event.queryStringParameters
  })

  try {
    const url = event.queryStringParameters.url
    const html = await fetch(url).then(r => r.text())
    const outputBuffer = Buffer.from(html, 'utf8')

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
        'Content-Encoding': 'base64'
      },
      isBase64Encoded: true,
      body: outputBuffer.toString('base64')
    };
  } catch (err) {
    console.log(err)
    res.status(500).json({ type: "Error fetching url", message: err.message })
  }
};
