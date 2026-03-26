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
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline">BuenInquilino</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.email}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Bienvenido a tu Dashboard
          </h1>
          <p className="text-muted-foreground">
            Gestiona y realiza evaluaciones de inquilinos
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-primary/20 hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>Nueva Evaluación</CardTitle>
              <CardDescription>
                Comienza a evaluar a un nuevo inquilino potencial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Completa nuestro formulario detallado para obtener una evaluación completa del inquilino.
              </p>
              <Link href="/dashboard/evaluation/new">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Iniciar evaluación
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mis Evaluaciones</CardTitle>
              <CardDescription>
                Historial de evaluaciones realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Accede a todas las evaluaciones que has realizado y sus resultados.
              </p>
              <Link href="/dashboard/evaluations">
                <Button variant="outline" className="w-full">
                  Ver historial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Evaluaciones Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Evaluaciones realizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Evaluaciones Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                En proceso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Evaluaciones Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Con resultado final
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">¿Cómo comienza?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Haz clic en "Nueva Evaluación" para comenzar</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>Completa todos los datos del inquilino potencial</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>Revisa el informe detallado con puntuación</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>Usa los resultados para tomar tu decisión</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
