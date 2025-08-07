import { NextRequest, NextResponse } from "next/server"
import { offerRedirects } from "@/app/elgiganten/offerRedirects"

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return new NextResponse("Invalid content type", { status: 400 })
    }

    const body = await req.json()
    const { id } = body

    if (!id || typeof id !== "string") {
      return new NextResponse("Missing or invalid 'id'", { status: 400 })
    }

    const destination = offerRedirects[id]

    if (!destination) {
      return new NextResponse("Offer not found", { status: 404 })
    }

    return NextResponse.json({ url: destination })
  } catch (error) {
    console.error("Error in API:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
