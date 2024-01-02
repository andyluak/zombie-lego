/* eslint-disable @next/next/no-img-element */
import React from "react"
import { Loader2 } from "lucide-react"
import { useMutation } from "react-query"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [uploadedImage, setUploadedImage] = React.useState<string>()

  const {
    data: imageUrl,
    error,
    isLoading,
    mutate,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log(formData)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      return res.json()
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!uploadedImage) return

    const formData = new FormData(event.currentTarget)

    mutate(formData)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setUploadedImage(reader.result as string)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center h-[70dvh] gap-16">
      <form
        className="flex flex-col items-center justify-center w-full max-w-[500px] gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
        />
        <Button type="submit" className="self-start flex gap-2">
          <Loader2
            className={cn("animate-spin text-orange-500", {
              hidden: !isLoading,
            })}
          />{" "}
          Upload
        </Button>
      </form>
      <div className="flex flex-row gap-8">
        <img
          src={uploadedImage ?? "/jk-placeholder-image.jpg"}
          alt="placeholder"
          className="w-[300px] h-[250px]"
        />
        <img
          src={imageUrl ?? "/jk-placeholder-image.jpg"}
          alt="placeholder"
          className="w-[300px] h-[250px]"
        />
      </div>
    </section>
  )
}
