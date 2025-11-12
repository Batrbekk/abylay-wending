import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const EMAIL_USER = "batrbekk@gmail.com"
const EMAIL_PASS = "yoja sxoy hrbq prae"
const RECIPIENT_EMAIL = "uabylaykhan@mail.ru"

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

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })

    const attendanceText =
      attendance === 'yes' ? 'Әрине, келемін' :
      attendance === 'maybe' ? 'Жұбайыммен келемін' :
      'Өкінішке орай, келе алмаймын'

    // Email content
    const mailOptions = {
      from: EMAIL_USER,
      to: RECIPIENT_EMAIL,
      subject: `Жаңа қонақ тіркелді: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #654321;">Жаңа қонақ тіркелді</h2>

          <div style="background-color: #f5e6d3; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #654321;">Аты-жөні:</strong> ${name.trim()}</p>
            <p style="margin: 10px 0;"><strong style="color: #654321;">Келу:</strong> ${attendanceText}</p>
            <p style="margin: 10px 0;"><strong style="color: #654321;">Уақыты:</strong> ${new Date().toLocaleString('ru-RU')}</p>
          </div>

          <div style="background-color: #d4a574; padding: 15px; border-radius: 5px; text-align: center;">
            <p style="margin: 0; color: white; font-size: 14px;">Абылайхан & Дільназ үйлену тойы</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Рахмет! Сіздің жауабыңыз қабылданды.'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Қате орын алды. Қайталап көріңіз.' },
      { status: 500 }
    )
  }
}
