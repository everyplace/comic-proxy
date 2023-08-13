import sharp from 'sharp'

export const handler = async (event) => {
  console.log({
    file: 'proxy-image.js',
    action: 'handler(event)',
    params: event.queryStringParameters
  })

  try {
    const url = event.queryStringParameters.url
    let original = await fetch(url)
    let original_buffer = Buffer.from(await original.arrayBuffer())

    let outputBuffer

    if (event.queryStringParameters.x && event.queryStringParameters.y) {
      outputBuffer = await sharp(original_buffer)
        .resize({
          width: parseInt(event.queryStringParameters.x),
          height: parseInt(event.queryStringParameters.y),
          withoutEnlargement: true
        })
        .webp({ smartSubsample: true })
        .toBuffer()
    } else if (event.queryStringParameters.x) {
      outputBuffer = await sharp(original_buffer)
        .resize({
          width: parseInt(event.queryStringParameters.x),
          height: undefined,
          withoutEnlargement: true
        })
        .webp({ smartSubsample: true })
        .toBuffer()
    } else {
      outputBuffer = await sharp(original_buffer)
        .webp({ smartSubsample: true, effort: 0 })
        .toBuffer()
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Content-Encoding': 'base64'
      },
      isBase64Encoded: true,
      body: outputBuffer.toString('base64')
    };
  } catch (err) {
    console.log(err)
    res.status(500).json({ type: "Error fetching image", message: err.message })
  }
};
