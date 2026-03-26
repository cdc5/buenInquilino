'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, FileText } from 'lucide-react'

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
      <div className="flex h-screen items-center justify-center bg-[#f5f3ee]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4eca8b]" />
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20',
      processing: 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20',
      completed: 'bg-[#4eca8b]/10 text-[#4eca8b] border border-[#4eca8b]/20',
      cancelled: 'bg-red-500/10 text-red-500 border border-red-500/20',
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
    <div className="min-h-screen bg-[#f5f3ee]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#1a2234]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1a2234] mb-2">Mis Evaluaciones</h1>
            <p className="text-[#5a6478]">
              Historial de todas tus evaluaciones de inquilinos
            </p>
          </div>
          <Link href="/dashboard/evaluation/new">
            <Button className="bg-[#4eca8b] hover:bg-[#3db978] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva evaluación
            </Button>
          </Link>
        </div>

        {evaluations.length === 0 ? (
          <Card className="text-center py-12 border-0 shadow-sm bg-white">
            <CardContent>
              <div className="w-16 h-16 bg-[#f5f3ee] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#5a6478]" />
              </div>
              <p className="text-[#5a6478] mb-6">
                No has realizado evaluaciones aún
              </p>
              <Link href="/dashboard/evaluation/new">
                <Button className="bg-[#4eca8b] hover:bg-[#3db978] text-white">
                  Crea tu primera evaluación
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evaluation) => (
              <Card key={evaluation.id} className="hover:shadow-lg transition-shadow border-0 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-[#1a2234] mb-2">
                        {evaluation.tenant_full_name}
                      </h3>
                      <div className="space-y-1 text-sm text-[#5a6478]">
                        <p>
                          DNI: <span className="text-[#1a2234]">{evaluation.tenant_dni}</span>
                        </p>
                        <p>
                          Propiedad:{' '}
                          <span className="text-[#1a2234]">
                            {evaluation.property_address}, {evaluation.property_city}
                          </span>
                        </p>
                        <p>
                          Alquiler:{' '}
                          <span className="text-[#1a2234]">
                            ${evaluation.monthly_rent}
                          </span>
                        </p>
                        <p>
                          Fecha:{' '}
                          <span className="text-[#1a2234]">
                            {new Date(evaluation.created_at).toLocaleDateString('es-AR')}
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
                        <Button variant="outline" size="sm" className="border-[#1a2234] text-[#1a2234] hover:bg-[#1a2234] hover:text-white">
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
