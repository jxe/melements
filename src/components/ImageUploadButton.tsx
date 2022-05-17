import { CameraIcon } from "@radix-ui/react-icons"

export async function cloudify(file: File) {
  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", "pf3mos3z")
  const res = await fetch("https://api.cloudinary.com/v1_1/meaning-supplies/image/upload", {
    method: "POST",
    body: data,
  })
  const json = await res.json()
  return json.secure_url as string
}

export function cloudinaryImg(src: string, w = 300, h = 300) {
  if (!src.includes("cloudinary.com")) return src
  if (src.includes("upload")) {
    const [head, tail] = src.split("/upload/")
    return `${head}/upload/w_${w},h_${h},c_fill,r_max/${tail}`
  } else {
    const [head, tail] = src.split("/twitter/")
    return `${head}/twitter/w_${w},h_${h},c_fill,r_max/${tail}`
  }
}

export function ImageUploadButton({ image, setImage }: { image?: File, setImage: (image: File) => void }) {
  return (
    <label>
      {image ?
        <img
          width={100}
          src={URL.createObjectURL(image)}
        />
        : <CameraIcon />}
      <input
        style={{ display: "none" }}
        accept="image/*"
        type="file"
        onChange={(e) => setImage(e.target.files?.item(0)!)}
      />
    </label>
  )
}
