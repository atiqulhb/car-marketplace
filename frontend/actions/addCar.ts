'use server'

import sharp from 'sharp'
import { addCarMutation, keystoneFetch, getSessionHeader, getAuthedUser } from "@/lib/keystone"
import { ADD_CAR_MUTATION } from '@/queries'
import { env } from '@/config/env'

async function processCarImage(buffer: Buffer) {
    const image = sharp(buffer, { limitInputPixels: 268402689 }).rotate()
    return image.resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
  }

export async function addCar( prevState: any, formData: FormData) {
  const brandName = formData.get('brandName') as string
  const model = formData.get('model') as string
  const year = Number(formData.get('year'))
  const price = formData.get('price') as string
  const images = formData.getAll('images') as File[]

  console.log('Form Data:', { brandName, model, year, price, images })

  const authedUser = await getAuthedUser()

  const processedBuffers = await Promise.all(images.map(async (img) => {
    const inputBuffer = Buffer.from(await img.arrayBuffer())
    return processCarImage(inputBuffer)
  }))

  const imagesList = processedBuffers.map((_, i) => ({ image: { upload: null }}))

  const operations = JSON.stringify({
    query: ADD_CAR_MUTATION,
    variables: {
      data: {
        brand: brandName,
        model,
        year,
        price,
        images: {
          create: imagesList
        },
        dealer: {
          connect: {
            id: authedUser.id
          }
        }
      }
    }
  })

  const map = {}
  processedBuffers.forEach((_, i) => {
    map[String(i)] = [`variables.data.images.create.${i}.image.upload`]
  })

  const uploadForm = new FormData()
  uploadForm.append('operations', operations)
  uploadForm.append('map', JSON.stringify(map))
  processedBuffers.forEach((buffer, i) => {
    uploadForm.append(String(i), new Blob([buffer], { type: 'image/webp' }), `car-${i}.webp`)
  })

  const sessionHeader = await getSessionHeader()

  const res = await fetch(env.BACKEND_URL!, {
    method: 'POST',
    headers: {
      "apollo-require-preflight": 'true',
      ...sessionHeader
    },
    body: uploadForm
  })

  const json = await res.json()
  console.log(json)
  if (json.errors) {
    return { success: false as const, error: true }
  }

  // const res = await addCarMutation({
  //   brand,
  //   model,
  //   mileage: parseInt(mileage),   
  //   year: parseInt(year),
  //   price,
  // })


  // const res = await keystoneFetch(`
  //   mutation AddCar($data: CarCreateInput!) {
  //     createCar(data: $data) {
  //       id
  //     }
  //   }
  // `, { data: { brand, model, year: parseInt(year), price } })

  return { success: true, error: false }
}
