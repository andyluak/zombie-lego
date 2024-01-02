// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import formibable, { File, IncomingForm } from "formidable"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new IncomingForm()

  const formData = (await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })) as { fields: formibable.Fields; files: formibable.Files }

  const file = formData.files.image?.[0] as File
  console.log(formData.files)
  const base64Image = fs.readFileSync(file.filepath, "base64")

  if (!base64Image) {
    return res.status(400).json({ error: "No image provided" })
  }

  const descriptionResponse = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe this image as best as possible. Take in consideration all details and make the scenary and the character a bit more like in a zombie apocalypse world but still keeping the essense. Just return back the description of the zombie apocalypse world based on the image and nothing else.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 4000,
  })
  const description = descriptionResponse.choices[0].message.content

  if (!description) {
    return res
      .status(400)
      .json({ error: "Something went wrong with the api call" })
  }

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Generate a Lego like character based on this description : ${description}`,
  })

  if (!image) {
    return res
      .status(400)
      .json({ error: "Something went wrong with the api call" })
  }

  res.status(200).json(image.data[0].url)
}
