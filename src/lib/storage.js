import { v4 as uuidv4 } from 'uuid'
import admin from 'firebase-admin'
import Image from '../models/Image'
import path from 'path'

const saveImage = async (image) => {
    const upload = await image
    const stream = upload.createReadStream()

    const file = admin
        .storage()
        .bucket()
        .file(uuidv4() + path.extname(upload.filename))

    // Upload the file to gcs
    await new Promise((resolve, reject) => {
        const writeStream = file.createWriteStream()
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
        stream.pipe(writeStream)
    })

    return file.publicUrl()
}

export { saveImage }
