"use client"

import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [manuallyPaused, setManuallyPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // RSVP Form state
  const [formData, setFormData] = useState({
    name: '',
    attendance: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    const targetDate = new Date('2025-12-13T15:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  // Preloader effect with scroll lock
  useEffect(() => {
    // Lock scroll during loading
    document.body.style.overflow = 'hidden'

    const timer = setTimeout(() => {
      setIsLoading(false)
      // Unlock scroll after loading
      document.body.style.overflow = 'unset'
    }, 2000)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = 'unset'
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        setManuallyPaused(true)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
        setManuallyPaused(false)
      }
    }
  }

  // Auto-play on first user interaction (only if not manually paused)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying && !manuallyPaused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.log('Auto-play failed:', error)
          })
      }
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
      document.removeEventListener('click', handleFirstInteraction)
    }

    document.addEventListener('touchstart', handleFirstInteraction, { passive: true })
    document.addEventListener('scroll', handleFirstInteraction, { passive: true })
    document.addEventListener('click', handleFirstInteraction)

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
      document.removeEventListener('click', handleFirstInteraction)
    }
  }, [isPlaying, manuallyPaused])

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setFormMessage('')

    try {
      const response = await fetch('/api/submit-rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus('success')
        setFormMessage(data.message)
        setFormData({ name: '', attendance: '' })
      } else {
        setFormStatus('error')
        setFormMessage(data.error || 'Қате орын алды')
      }
    } catch {
      setFormStatus('error')
      setFormMessage('Қате орын алды. Қайталап көріңіз.')
    }
  }

  return (
    <>
      {/* Preloader with Framer Motion */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf9f6]"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-8 border-[#f5e6d3] rounded-full border-t-[#d4a574]"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image src="/images/heart-icon.webp" alt="Loading" width={60} height={60} />
                </motion.div>
              </div>
              <p className="text-2xl text-[#654321]" style={{ fontFamily: 'Great Vibes, cursive' }}>
                Абылайхан & Дильназ
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full min-h-screen relative overflow-x-hidden">
      <div className="w-full h-[650px] relative">
        <Image
          src="/images/IMG_5437.JPG"
          alt="Абылайхан & Дильназ"
          fill
          className="object-cover"
          priority
        />
        {/* Dark glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/60 to-transparent pointer-events-none"></div>

        {/* Names at bottom */}
        <div className="absolute bottom-8 left-0 right-0 pointer-events-none px-4">
          <h1 className="text-6xl md:text-7xl text-white leading-tight" style={{ fontFamily: 'Great Vibes, cursive' }}>
            <div className="text-center">Абылайхан</div>
            <div className="text-center">Дильназ</div>
          </h1>
        </div>
      </div>
      <div className="container mx-auto pt-4 relative overflow-visible">
        {/* Left rotating ornament */}
        <div className="absolute animate-spin-slow" style={{
          width: '280px',
          height: '390px',
          left: '-180px',
          top: '10px'
        }}>
          <Image src="/images/round-oyu.webp" alt="Ornament" width={325} height={390} />
        </div>

        {/* Right rotating ornament */}
        <div className="absolute animate-spin-slow" style={{
          width: '280px',
          height: '390px',
          right: '-180px',
          top: '10px'
        }}>
          <Image src="/images/round-oyu.webp" alt="Ornament" width={325} height={390} />
        </div>

        <h2 className="text-xl uppercase text-center text-[#654321]" style={{ fontFamily: 'EB Garamond, serif' }}>
          Үйлену тойға шақыру!
        </h2>
        <p className="text-center text-lg font-semibold text-[#654321]" style={{ fontFamily: 'EB Garamond, serif' }}>
          13.12.2025
        </p>

        {/* Music Player Section */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex justify-center items-center mb-4">
            <Image src="/images/heart-line.webp" alt="Абылайхан & Дильназ" width={177} height={100} />
          </div>

          <div className="relative flex justify-center" style={{ width: '200px', height: '282px' }}>
            <p className="absolute text-base md:text-lg text-center" style={{
              color: '#654321',
              fontFamily: 'EB Garamond, serif',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '560px',
              zIndex: 10
            }}>
              Әуенді қосу үшін,<br />
              батырманы басыңыз
            </p>

            <button
              onClick={togglePlay}
              className="relative transition-transform hover:scale-105 active:scale-95"
              style={{ width: '200px', height: '300px' }}
            >
              <Image
                src={isPlaying ? "/images/pause-button.webp" : "/images/play-button.webp"}
                alt={isPlaying ? "Pause" : "Play"}
                width={200}
                height={300}
                className="object-contain"
              />
            </button>
          </div>
        </div>

        <Image src="/images/oyu.webp" alt="oyu" width={119} height={167.5} className="absolute -bottom-20 left-1/2 -translate-x-1/2" />
        <Image src="/images/text.webp" alt="oyu" width={358} height={271.5} className="absolute -bottom-[300px] left-1/2 -translate-x-1/2" />

        <Image src="/images/oyu-right.webp" alt="oyu" width={420} height={300} className="absolute -bottom-[820px] -left-[210px] rotate-90" />
        <Image src="/images/oyu-right.webp" alt="oyu" width={420} height={300} className="absolute -bottom-[820px] -right-[210px] -rotate-90" />

        <div className="absolute -bottom-[410px] left-1/2 -translate-x-1/2 text-center" style={{ color: '#654321', fontFamily: 'EB Garamond, serif', zIndex: 10 }}>
          <p className="text-[16px] uppercase text-[#654321]">Сіз(дер)ді</p> <p className="text-[16px] uppercase text-[#654321]">ұлымыз бен келініміз</p>
        </div>

        <div className="absolute -bottom-[620px] left-1/2 -translate-x-1/2 text-center" style={{ color: '#654321', fontFamily: 'Great Vibes, cursive', zIndex: 10 }}>
          <p className="text-6xl text-[#654321]">Абылайхан <br /> мен <br /> Дильназ</p>
        </div>

        <div className="absolute -bottom-[720px] left-1/2 -translate-x-1/2 text-center" style={{ color: '#654321', fontFamily: 'EB Garamond, serif', zIndex: 10 }}>
          <p className="text-[14px] uppercase text-[#654321]">Үйлену тойына арналған <br /> ақ дастарханымыздың <br /> қадірлі қонағы болуға <br /> шақырамыз!</p>
        </div>

        {/* Calendar Section */}
        <div className="absolute -bottom-[1250px] left-1/2 -translate-x-1/2 w-[350px]">
          <div className="relative">
            <Image src="/images/oyu-m.webp" alt="ornament" width={350} height={96} className="absolute -top-12 left-1/2 -translate-x-1/2 z-10" />

            <p className="text-[#654321] text-5xl text-center absolute top-12 left-1/2 -translate-x-1/2 w-full" style={{ fontFamily: 'Great Vibes, cursive' }}>Той салтанаты:</p>
            <p className="text-[#654321] text-3xl text-center absolute top-26 left-1/2 -translate-x-1/2 w-full" style={{ fontFamily: 'Great Vibes, cursive' }}>13.12.2025 жыл</p>

            <div className="pt-40 pb-6 px-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-md" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                <div>ДС</div>
                <div>СС</div>
                <div>СР</div>
                <div>БС</div>
                <div>ЖМ</div>
                <div>СБ</div>
                <div>ЖС</div>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2 text-center text-sm" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                {/* Week 1 - December 2025 starts on Monday */}
                <div className="p-2">1</div>
                <div className="p-2">2</div>
                <div className="p-2">3</div>
                <div className="p-2">4</div>
                <div className="p-2">5</div>
                <div className="p-2">6</div>
                <div className="p-2">7</div>

                {/* Week 2 */}
                <div className="p-2">8</div>
                <div className="p-2">9</div>
                <div className="p-2">10</div>
                <div className="p-2">11</div>
                <div className="p-2">12</div>
                <div className="p-2 relative flex items-center justify-center overflow-visible">
                  <span className="relative z-20">13</span>
                  <Image
                    src="/images/heart-icon.webp"
                    alt="heart"
                    width={80}
                    height={80}
                    className="absolute animate-pulse-heart z-10"
                    style={{ left: '50%', top: '50%' }}
                  />
                </div>
                <div className="p-2">14</div>

                {/* Week 3 */}
                <div className="p-2">15</div>
                <div className="p-2">16</div>
                <div className="p-2">17</div>
                <div className="p-2">18</div>
                <div className="p-2">19</div>
                <div className="p-2">20</div>
                <div className="p-2">21</div>

                {/* Week 4 */}
                <div className="p-2">22</div>
                <div className="p-2">23</div>
                <div className="p-2">24</div>
                <div className="p-2">25</div>
                <div className="p-2">26</div>
                <div className="p-2">27</div>
                <div className="p-2">28</div>

                {/* Week 5 */}
                <div className="p-2">29</div>
                <div className="p-2">30</div>
                <div className="p-2">31</div>
              </div>
            </div>

            <p className="text-[#654321] text-xl text-center absolute -bottom-4 left-1/2 -translate-x-1/2 w-full uppercase" style={{ fontFamily: 'EB Garamond, serif' }}>Тойдың басталуы - 15:00</p>
          </div>
        </div>

        <div className="absolute -bottom-[1720px] left-1/2 -translate-x-1/2 w-full h-[414px]">
          <Image src="/images/arms.webp" alt="oyu" fill className="rotate-90 object-cover" />

          {/* Countdown Timer inside arms image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-[180px]">
            <h2 className="text-xl md:text-2xl mb-4 uppercase" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
              Той салтанатына дейін:
            </h2>

            <div className="flex justify-center gap-3 md:gap-6">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="text-3xl md:text-5xl font-bold mb-1" style={{ color: '#8b0000', fontFamily: 'Playfair Display, serif' }}>
                  {timeLeft.days}
                </div>
                <div className="text-xs md:text-sm uppercase" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                  күн
                </div>
              </div>

              <div className="text-3xl md:text-5xl font-bold" style={{ color: '#8b0000', fontFamily: 'Playfair Display, serif' }}>:</div>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="text-3xl md:text-5xl font-bold mb-1" style={{ color: '#8b0000', fontFamily: 'Playfair Display, serif' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm uppercase" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                  сағат
                </div>
              </div>

              <div className="text-3xl md:text-5xl font-bold" style={{ color: '#8b0000', fontFamily: 'Playfair Display, serif' }}>:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="text-3xl md:text-5xl font-bold mb-1" style={{ color: '#8b0000', fontFamily: 'Playfair Display, serif' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm uppercase" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                  минут
                </div>
              </div>

              <div className="text-3xl md:text-5xl font-bold" style={{ color: '#8b0000', fontFamily: 'Playfair Display, serif' }}>:</div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="text-3xl md:text-5xl font-bold mb-1" style={{ color: '#8b0000', fontFamily: 'Playfair Display, serif' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm uppercase" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                  секунд
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section with Rotating Circle */}
        <div className="absolute -bottom-[2100px] left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
          {/* Rotating ornament background */}
          <div className="relative w-[300px] h-[300px] flex items-center justify-center overflow-hidden">
            <div className="absolute animate-spin-slow">
              <Image src="/images/round-oyu.webp" alt="Ornament" width={300} height={300} />
            </div>

            {/* Address text on top of rotating circle */}
            <a
              href="https://2gis.kz/ekibastuz/geo/70030076805282261/75.346217,51.711949"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex flex-col items-center justify-center text-center px-8 bg-white/80 rounded-full py-6"
            >
              <h3 className="text-3xl md:text-4xl mb-4" style={{ color: '#654321', fontFamily: 'Great Vibes, cursive' }}>
                Мекен-жайымыз:
              </h3>
              <p className="text-xl md:text-2xl font-semibold mb-2" style={{ color: '#8b0000', fontFamily: 'EB Garamond, serif' }}>
                &ldquo;Ресторан Туран&rdquo;
              </p>
              <p className="text-lg md:text-xl" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                Абая 160а
              </p>
              <p className="text-lg md:text-xl" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                Екібастұз қаласы
              </p>

              {/* 2GIS icon/button */}
              <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#4CAF50] rounded-full shadow-md hover:shadow-lg transition-shadow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
                </svg>
                <span className="text-sm font-semibold text-white">2GIS картасын көру</span>
              </div>
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="absolute -bottom-[2350px] left-1/2 -translate-x-1/2 w-full flex flex-col items-center text-center px-4">
          <p className="text-4xl md:text-3xl mb-4" style={{ color: '#654321', fontFamily: 'Great Vibes, cursive' }}>
            Той иелері:
          </p>
          <p className="text-4xl md:text-5xl" style={{ color: '#654321', fontFamily: 'Great Vibes, cursive' }}>
            Толеген-Маххабат
          </p>
          <Image src="/images/oyu-m.webp" alt="ornament" width={350} height={96} />
        </div>

        {/* RSVP Form Section */}
        <div className="absolute -bottom-[2900px] left-1/2 -translate-x-1/2 w-full max-w-[800px] px-4">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Form content */}
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex justify-center mb-6">
                <Image src="/images/form-title.webp" alt="Form title" width={314} height={176} />
              </div>

              <form onSubmit={handleSubmitRSVP} className="space-y-6">
                {/* Name input */}
                <div>
                  <label className="block text-lg mb-2" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                    Аты-жөніңізді жазыңыз
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="аты-жөні"
                    className="w-full px-6 py-4 rounded-full border-2 text-lg outline-none focus:outline-none"
                    style={{
                      borderColor: '#654321',
                      backgroundColor: 'transparent',
                      color: '#654321',
                      fontFamily: 'EB Garamond, serif'
                    }}
                    disabled={formStatus === 'submitting'}
                  />
                  {/* Error message under input */}
                  {formStatus === 'error' && formMessage && (
                    <div className="mt-2 text-red-600 text-sm" style={{ fontFamily: 'EB Garamond, serif' }}>
                      {formMessage}
                    </div>
                  )}
                </div>

                {/* Attendance radio buttons */}
                <div>
                  <label className="block text-lg mb-4" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                    Тойға келесіз бе?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="yes"
                        checked={formData.attendance === 'yes'}
                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                        className="w-5 h-5 mr-4 accent-[#654321]"
                        style={{ accentColor: '#654321' }}
                        disabled={formStatus === 'submitting'}
                      />
                      <span className="text-lg" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                        Әрине, келемін
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="maybe"
                        checked={formData.attendance === 'maybe'}
                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                        className="w-5 h-5 mr-4 accent-[#654321]"
                        style={{ accentColor: '#654321' }}
                        disabled={formStatus === 'submitting'}
                      />
                      <span className="text-lg" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                        Жұбайыммен келемін
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="no"
                        checked={formData.attendance === 'no'}
                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                        className="w-5 h-5 mr-4 accent-[#654321]"
                        style={{ accentColor: '#654321' }}
                        disabled={formStatus === 'submitting'}
                      />
                      <span className="text-lg" style={{ color: '#654321', fontFamily: 'EB Garamond, serif' }}>
                        Өкінішке орай, келе алмаймын
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-3 rounded-full text-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: '#654321',
                    fontFamily: 'EB Garamond, serif'
                  }}
                >
                  {formStatus === 'submitting' ? 'ЖІБЕРІЛУДЕ...' : 'ЖАУАПТЫ ЖІБЕРУ'}
                </button>

                {/* Success message */}
                {formStatus === 'success' && formMessage && (
                  <div
                    className="text-center p-4 rounded-lg bg-green-100 text-green-800"
                    style={{ fontFamily: 'EB Garamond, serif' }}
                  >
                    {formMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Final Message with Rotating Ornaments */}
        <div className="absolute -bottom-[3300px] left-1/2 -translate-x-1/2 w-full flex justify-center items-center">
          <div className="relative flex justify-center items-center overflow-hidden" style={{ width: '100%', maxWidth: '500px', height: '450px' }}>
            {/* Left rotating ornament */}
            <div className="absolute animate-spin-slow" style={{
              width: '280px',
              height: '390px',
              left: '-140px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}>
              <Image src="/images/round-oyu.webp" alt="Ornament" width={325} height={390} />
            </div>

            {/* Center message image */}
            <div className="relative z-10">
              <Image src="/images/final-message.webp" alt="Final message" width={320} height={450} />
            </div>

            {/* Right rotating ornament */}
            <div className="absolute animate-spin-slow" style={{
              width: '280px',
              height: '390px',
              right: '-140px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}>
              <Image src="/images/round-oyu.webp" alt="Ornament" width={325} height={390} />
            </div>
          </div>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} loop>
          <source src="/audio/background-music.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </main>
    </>
  )
}
