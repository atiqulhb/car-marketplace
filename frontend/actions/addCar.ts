'use server'

import sharp from 'sharp'
import { randomBytes } from 'crypto'
import { getSessionHeader, getAuthedUser, addBrandwithModel, addModelToBrand } from "@/lib/keystone"
import { ADD_CAR_MUTATION } from '@/queries'
import { env } from '@/config/env'

async function processCarImage(buffer: Buffer) {
  const image = sharp(buffer, { limitInputPixels: 268402689 }).rotate()
  return image.resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
}

function slugify(brandName, modelName) {
  const base = `${brandName}-${modelName}`.toLowerCase().replace(/\s+/g, '-');
  const suffix = randomBytes(3).toString('hex')
  return `${base}-${suffix}`
}


export async function addCar( prevState: any, formData: FormData) {
  let brandId = null
  let brandName = null
  let modelId = null
  let modelName = null
  
  brandId = formData.get('brandId') as string
  brandName = formData.get('brandName') as string
  modelId = formData.get('modelId') as string
  modelName = formData.get('modelName') as string

  const year = Number(formData.get('year'))
  const price = formData.get('price') as string
  const images = formData.getAll('images') as File[]

  const slug = slugify(brandName, modelName)

  const authedUser = await getAuthedUser()

  if ((!brandId && !brandName) || (!modelId && !modelName)) {
    throw new Error('Check your Input')
  }

  if (!brandId && !modelId) {
    const newBrandWithModel = await addBrandwithModel(brandName, modelName)

    brandId = newBrandWithModel.id
    modelId = newBrandWithModel.models[0].id
  }

  if (brandId && !modelId) {
    const newModel = await addModelToBrand(brandId, modelName)

    modelId = newModel.id
  }

  const processedBuffers = await Promise.all(images.map(async (img) => {
    const inputBuffer = Buffer.from(await img.arrayBuffer())
    return processCarImage(inputBuffer)
  }))

  const imagesList = processedBuffers.map((_, i) => ({ image: { upload: null }}))

  const operations = JSON.stringify({
    query: ADD_CAR_MUTATION,
    variables: {
      data: {
        "brand": {
          "connect": {
            "id": brandId
          },
        },
        "model": {
          "connect": {
            "id": modelId
          }
        },
        year,
        price,
        images: {
          create: imagesList
        },
        slug,
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

  return { success: true, error: false }
}
