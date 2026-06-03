import { Sora, Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['italic'],
  weight: ['400', '600'],
  display: 'swap',
})

export const metadata = {
  title: 'RG Performance — Assessoria de Crescimento Digital para Médicos',
  description:
    'Estruturamos o sistema comercial de médicos para gerar um fluxo previsível de consultas particulares com custo de aquisição controlado.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${sora.variable} ${manrope.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  )
}
