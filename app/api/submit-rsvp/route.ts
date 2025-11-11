import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const EMAIL_USER = "batrbekk@gmail.com"
const EMAIL_PASS = "yoja sxoy hrbq prae"
const RECIPIENT_EMAIL = "uabylaykhan@mail.ru"

interface Guest {
  name: string
  attendance: string
  timestamp: string
}

const GUESTS_FILE = path.join(process.cwd(), 'data', 'guests.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read guests from file
function readGuests(): Guest[] {
  ensureDataDirectory()
  if (!fs.existsSync(GUESTS_FILE)) {
    return []
  }
  const data = fs.readFileSync(GUESTS_FILE, 'utf-8')
  return JSON.parse(data)
}

// Write guests to file
function writeGuests(guests: Guest[]) {
  ensureDataDirectory()
  fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2))
}

export async function POST(request: Request) {
  try {
    const { name, attendance } = await request.json()

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Аты-жөнін жазыңыз' },
        { status: 400 }
      )
    }

    if (!attendance) {
      return NextResponse.json(
        { error: 'Тойға келесіз бе? таңдаңыз' },
        { status: 400 }
      )
    }

    // Add new guest to the list
    const guests = readGuests()
    const newGuest: Guest = {
      name: name.trim(),
      attendance,
      timestamp: new Date().toISOString()
    }
    guests.push(newGuest)
    writeGuests(guests)

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })

    // Build guest list for email
    const guestListHTML = guests.map((guest, index) => {
      const attendanceText =
        guest.attendance === 'yes' ? 'Әрине, келемін' :
        guest.attendance === 'maybe' ? 'Жұбайыммен келемін' :
        'Өкінішке орай, келе алмаймын'

      return `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${guest.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${attendanceText}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(guest.timestamp).toLocaleString('ru-RU')}</td>
      </tr>`
    }).join('')

    const totalGuests = guests.length

    // Email content
    const mailOptions = {
      from: EMAIL_USER,
      to: RECIPIENT_EMAIL,
      subject: `Жаңа қонақ тіркелді: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h2 style="color: #654321;">Тойға келетін қонақтар тізімі</h2>

          <div style="background-color: #f5e6d3; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #8b0000; margin-top: 0;">Жаңа қонақ:</h3>
            <p><strong>Аты-жөні:</strong> ${name}</p>
            <p><strong>Келу:</strong> ${
              attendance === 'yes' ? 'Әрине, келемін' :
              attendance === 'maybe' ? 'Жұбайыммен келемін' :
              'Өкінішке орай, келе алмаймын'
            }</p>
          </div>

          <h3 style="color: #654321;">Барлық қонақтар:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #654321; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">№</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Аты-жөні</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Келу</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Уақыты</th>
              </tr>
            </thead>
            <tbody>
              ${guestListHTML}
            </tbody>
          </table>

          <div style="background-color: #d4a574; padding: 15px; border-radius: 5px; text-align: center;">
            <h3 style="margin: 0; color: white;">Барлығы: ${totalGuests} қонақ</h3>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Рахмет! Сіздің жауабыңыз қабылданды.',
      totalGuests
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Қате орын алды. Қайталап көріңіз.' },
      { status: 500 }
    )
  }
}
