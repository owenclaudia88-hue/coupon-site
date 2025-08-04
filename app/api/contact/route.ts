import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "placeholder@gmail.com",
      pass: "placeholder-app-password",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    const { firstName, lastName, email, subject, message } = body

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: "Alla fält är obligatoriska" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Ogiltig e-postadress" }, { status: 400 })
    }

    // Create email content
    const emailContent = `
      Nytt meddelande från kontaktformuläret på Discount Nation

      Från: ${firstName} ${lastName}
      E-post: ${email}
      Ämne: ${subject}

      Meddelande:
      ${message}

      ---
      Skickat från: ${request.headers.get("host")}
      Tid: ${new Date().toLocaleString("sv-SE")}
      IP: ${request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Okänd"}
    `

    // Send email to support
    try {
      const transporter = createTransporter()

      await transporter.sendMail({
        from: "placeholder@gmail.com",
        to: "support@discountnation.se",
        subject: `Kontaktformulär: ${subject}`,
        text: emailContent,
        replyTo: email,
      })

      // Send confirmation email to user
      await transporter.sendMail({
        from: "placeholder@gmail.com",
        to: email,
        subject: "Tack för ditt meddelande - Discount Nation",
        text: `
Hej ${firstName},

Tack för att du kontaktade oss! Vi har mottagit ditt meddelande och kommer att svara dig inom 24 timmar.

Ditt meddelande:
Ämne: ${subject}
${message}

Med vänliga hälsningar,
Discount Nation Team

---
Detta är ett automatiskt meddelande. Svara inte på detta e-postmeddelande.
        `,
      })

      console.log("Email sent successfully to support@discountnation.se")
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Continue without failing the request - we'll still save the message
    }

    // Save message to file system as backup
    try {
      const fs = require("fs").promises
      const path = require("path")

      const contactsDir = path.join(process.cwd(), "contacts")

      // Create contacts directory if it doesn't exist
      try {
        await fs.access(contactsDir)
      } catch {
        await fs.mkdir(contactsDir, { recursive: true })
      }

      const timestamp = new Date().toISOString()
      const filename = `contact_${timestamp.replace(/[:.]/g, "-")}.json`
      const filepath = path.join(contactsDir, filename)

      const contactData = {
        ...body,
        timestamp,
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown",
        userAgent: request.headers.get("user-agent") || "Unknown",
      }

      await fs.writeFile(filepath, JSON.stringify(contactData, null, 2))
      console.log(`Contact form saved to: ${filepath}`)
    } catch (fileError) {
      console.error("File saving failed:", fileError)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Meddelandet har skickats framgångsrikt!",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Ett fel uppstod när meddelandet skulle skickas" }, { status: 500 })
  }
}
