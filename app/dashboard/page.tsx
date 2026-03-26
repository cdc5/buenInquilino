'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f3ee]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4eca8b]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#1a2234] border-b border-[#2a3344]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-[#1a2234] font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-lg text-white hidden sm:inline">BuenInquilino</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#8a94a6] hidden sm:inline">
                {user?.email}
              </span>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-white hover:bg-[#2a3344] hover:text-white"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#1a2234] mb-2">
            Bienvenido a tu Dashboard
          </h1>
          <p className="text-[#5a6478]">
            Gestiona y realiza evaluaciones de inquilinos
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-[#4eca8b] bg-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#1a2234] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#4eca8b]" />
                Nueva Evaluación
              </CardTitle>
              <CardDescription>
                Comienza a evaluar a un nuevo inquilino potencial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#5a6478] mb-6">
                Completa nuestro formulario detallado para obtener una evaluación completa del inquilino.
              </p>
              <Link href="/dashboard/evaluation/new">
                <Button className="w-full bg-[#4eca8b] hover:bg-[#3db978] text-white">
                  Iniciar evaluación →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#1a2234] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1a2234]" />
                Mis Evaluaciones
              </CardTitle>
              <CardDescription>
                Historial de evaluaciones realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#5a6478] mb-6">
                Accede a todas las evaluaciones que has realizado y sus resultados.
              </p>
              <Link href="/dashboard/evaluations">
                <Button variant="outline" className="w-full border-[#1a2234] text-[#1a2234] hover:bg-[#1a2234] hover:text-white">
                  Ver historial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#5a6478] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Evaluaciones Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-bold text-[#1a2234]">0</div>
              <p className="text-xs text-[#5a6478] mt-1">
                Evaluaciones realizadas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#5a6478] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Evaluaciones Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-bold text-[#f59e0b]">0</div>
              <p className="text-xs text-[#5a6478] mt-1">
                En proceso
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#5a6478] flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Evaluaciones Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-bold text-[#4eca8b]">0</div>
              <p className="text-xs text-[#5a6478] mt-1">
                Con resultado final
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-[#1a2234] border-0">
          <CardHeader>
            <CardTitle className="text-lg text-white">¿Cómo comenzar?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3 text-[#8a94a6]">
                <span className="font-bold text-[#4eca8b]">1.</span>
                <span>Haz clic en "Nueva Evaluación" para comenzar</span>
              </li>
              <li className="flex gap-3 text-[#8a94a6]">
                <span className="font-bold text-[#4eca8b]">2.</span>
                <span>Completa todos los datos del inquilino potencial</span>
              </li>
              <li className="flex gap-3 text-[#8a94a6]">
                <span className="font-bold text-[#4eca8b]">3.</span>
                <span>Revisa el informe detallado con puntuación</span>
              </li>
              <li className="flex gap-3 text-[#8a94a6]">
                <span className="font-bold text-[#4eca8b]">4.</span>
                <span>Usa los resultados para tomar tu decisión</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
