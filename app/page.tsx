"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Star, Sun, Moon, Cloud, Flower2, LucideIcon } from 'lucide-react'
import { toast } from "sonner"

type KartuMemori = {
  id: number
  ikon: LucideIcon
  cocok: boolean
  warna: string
}

const ikonKartu = [
  { ikon: Heart, warna: "text-rose-400" },
  { ikon: Star, warna: "text-amber-400" },
  { ikon: Sun, warna: "text-yellow-400" },
  { ikon: Moon, warna: "text-purple-400" },
  { ikon: Cloud, warna: "text-sky-400" },
  { ikon: Flower2, warna: "text-emerald-400" }
]

const buatKartu = (): KartuMemori[] =>
  ikonKartu.flatMap(({ ikon, warna }, indeks) => [
    { id: indeks * 2, ikon, warna, cocok: false },
    { id: indeks * 2 + 1, ikon, warna, cocok: false }
  ]).sort(() => Math.random() - 0.5)

export default function PermainanMemori() {
  const [kartu, setKartu] = useState<KartuMemori[]>(buatKartu())
  const [indeksTerbuka, setIndeksTerbuka] = useState<number[]>([])
  const [cocokan, setCocokan] = useState(0)
  const [sedangMemeriksa, setSedangMemeriksa] = useState(false)

  const tanganiKlikKartu = (indeksKlik: number) => {
    if (sedangMemeriksa || kartu[indeksKlik].cocok || indeksTerbuka.includes(indeksKlik) || indeksTerbuka.length === 2) return
    
    const baruTerbuka = [...indeksTerbuka, indeksKlik]
    setIndeksTerbuka(baruTerbuka)

    if (baruTerbuka.length === 2) {
      setSedangMemeriksa(true)
      const [indeksPertama, indeksKedua] = baruTerbuka
      const cocok = kartu[indeksPertama].ikon === kartu[indeksKedua].ikon

      setTimeout(() => {
        if (cocok) {
          setKartu(kartu.map((k, i) => (i === indeksPertama || i === indeksKedua ? { ...k, cocok: true } : k)))
          setCocokan(c => {
            const totalCocokan = c + 1;
            if (totalCocokan === kartu.length / 2) {
              toast("🎉 Selamat! Anda menemukan semua pasangan! 🎈", { className: "bg-green-700 text-white" });
            }
            return totalCocokan;
          });
        }
        setIndeksTerbuka([])
        setSedangMemeriksa(false)
      }, cocok ? 500 : 1000)
    }
  }

  const aturUlangPermainan = () => {
    setKartu(buatKartu())
    setIndeksTerbuka([])
    setCocokan(0)
    setSedangMemeriksa(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-10 bg-gradient-to-br from-blue-400 via-indigo- to-black text-white">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold text-white">
          Permainan Kartu Memori
        </h1>
        <p className="text-lg">Pasangan ditemukan: {cocokan} dari {kartu.length / 2}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
        {kartu.map((k, indeks) => (
          <motion.div
            key={k.id}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: k.cocok || indeksTerbuka.includes(indeks) ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            className="perspective-1000"
          >
            <Card
              className={`relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center rounded-xl border-4 shadow-md transform-style-3d transition-all duration-300 cursor-pointer ${
                k.cocok
                  ? "bg-green-800/50 border-green-500"
                  : indeksTerbuka.includes(indeks)
                  ? "bg-purple-800/50 border-purple-500"
                  : "bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-gray-500"
              }`}
              onClick={() => tanganiKlikKartu(indeks)}
            >
              <AnimatePresence>
                {(k.cocok || indeksTerbuka.includes(indeks)) && (
                  <motion.div
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{ opacity: 1, rotateY: 180 }}
                    exit={{ opacity: 0, rotateY: 180 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <k.ikon className={`w-14 h-14 ${k.warna} drop-shadow-lg`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button 
        onClick={aturUlangPermainan} 
        variant="outline" 
        size="lg"
        className="px-6 py-3 rounded-lg bg-indigo-800 border-indigo-500 hover:bg-indigo-600 text-white font-bold"
      >
        🔄 Mulai Ulang Permainan
      </Button>
    </div>
  )
}
