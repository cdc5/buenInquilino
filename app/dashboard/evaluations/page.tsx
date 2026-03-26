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

interface Evaluation {
  id: string
  tenant_full_name: string
  tenant_dni: string
  property_address: string
  property_city: string
  monthly_rent: number
  status: string
  created_at: string
}

export default function EvaluationsList() {
  const [user, setUser] = useState<any>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)

      // Load evaluations
      const { data, error } = await supabase
        .from('tenant_evaluations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setEvaluations(data)
      }

      setIsLoading(false)
    }

    loadData()
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

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completada',
      cancelled: 'Cancelada',
    }
    return labels[status] || status
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline">BuenInquilino</span>
            </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis Evaluaciones</h1>
            <p className="text-muted-foreground">
              Historial de todas tus evaluaciones de inquilinos
            </p>
          </div>
          <Link href="/dashboard/evaluation/new">
            <Button className="bg-primary hover:bg-primary/90">
              Nueva evaluación
            </Button>
          </Link>
        </div>

        {evaluations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-6">
                No has realizado evaluaciones aún
              </p>
              <Link href="/dashboard/evaluation/new">
                <Button className="bg-primary hover:bg-primary/90">
                  Crea tu primera evaluación
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evaluation) => (
              <Card key={evaluation.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        {evaluation.tenant_full_name}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          DNI: <span className="text-foreground">{evaluation.tenant_dni}</span>
                        </p>
                        <p>
                          Propiedad:{' '}
                          <span className="text-foreground">
                            {evaluation.property_address}, {evaluation.property_city}
                          </span>
                        </p>
                        <p>
                          Alquiler:{' '}
                          <span className="text-foreground">
                            ${evaluation.monthly_rent}
                          </span>
                        </p>
                        <p>
                          Fecha:{' '}
                          <span className="text-foreground">
                            {new Date(evaluation.created_at).toLocaleDateString('es-ES')}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(
                          evaluation.status
                        )}`}
                      >
                        {getStatusLabel(evaluation.status)}
                      </span>
                      <Link href={`/dashboard/evaluation/${evaluation.id}`}>
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
