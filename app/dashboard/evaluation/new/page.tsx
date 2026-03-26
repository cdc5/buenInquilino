'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Step = 'tenant' | 'income' | 'contract' | 'review'

export default function NewEvaluation() {
  const [currentStep, setCurrentStep] = useState<Step>('tenant')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    tenant_full_name: '',
    tenant_dni: '',
    tenant_email: '',
    tenant_phone: '',
    income_type: 'relacion',
    employer_name: '',
    monthly_salary: '',
    monotributo_category: '',
    activity_name: '',
    property_address: '',
    property_city: '',
    monthly_rent: '',
    contract_start_date: '',
  })

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === 'review') {
      // Save to database
      setIsSaving(true)
      setError(null)

      try {
        const { error } = await supabase
          .from('tenant_evaluations')
          .insert({
            user_id: user.id,
            ...formData,
          })

        if (error) throw error

        router.push('/dashboard/evaluations')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al guardar')
      } finally {
        setIsSaving(false)
      }
    } else {
      // Move to next step
      const steps: Step[] = ['tenant', 'income', 'contract', 'review']
      const nextIndex = steps.indexOf(currentStep) + 1
      setCurrentStep(steps[nextIndex])
    }
  }

  const handlePrevious = () => {
    const steps: Step[] = ['tenant', 'income', 'contract', 'review']
    const prevIndex = steps.indexOf(currentStep) - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const stepperItems = [
    { key: 'tenant', label: 'Datos del Inquilino' },
    { key: 'income', label: 'Información de Ingresos' },
    { key: 'contract', label: 'Detalles del Contrato' },
    { key: 'review', label: 'Revisión' },
  ]

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
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {stepperItems.map((item, index) => (
              <div key={item.key} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep === item.key
                        ? 'bg-primary text-primary-foreground'
                        : stepperItems.findIndex(s => s.key === currentStep) > index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < stepperItems.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        stepperItems.findIndex(s => s.key === currentStep) > index
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
                <p className="text-sm mt-2 text-center text-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {stepperItems.find(s => s.key === currentStep)?.label}
            </CardTitle>
            <CardDescription>
              Paso {stepperItems.findIndex(s => s.key === currentStep) + 1} de {stepperItems.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 mb-6">
                {currentStep === 'tenant' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="tenant_full_name">Nombre completo del inquilino</Label>
                      <Input
                        id="tenant_full_name"
                        name="tenant_full_name"
                        value={formData.tenant_full_name}
                        onChange={handleChange}
                        placeholder="Juan García López"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tenant_dni">DNI</Label>
                      <Input
                        id="tenant_dni"
                        name="tenant_dni"
                        value={formData.tenant_dni}
                        onChange={handleChange}
                        placeholder="12345678"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tenant_email">Correo electrónico</Label>
                      <Input
                        id="tenant_email"
                        name="tenant_email"
                        type="email"
                        value={formData.tenant_email}
                        onChange={handleChange}
                        placeholder="juan@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tenant_phone">Teléfono</Label>
                      <Input
                        id="tenant_phone"
                        name="tenant_phone"
                        value={formData.tenant_phone}
                        onChange={handleChange}
                        placeholder="+34 666 123 456"
                      />
                    </div>
                  </>
                )}

                {currentStep === 'income' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="income_type">Tipo de ingreso</Label>
                      <select
                        id="income_type"
                        name="income_type"
                        value={formData.income_type}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="relacion">Relación Laboral</option>
                        <option value="monotributo">Monotributo</option>
                        <option value="autonomo">Autónomo</option>
                        <option value="sin">Sin Ingresos Declarados</option>
                      </select>
                    </div>

                    {formData.income_type === 'relacion' && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="employer_name">Nombre del empleador</Label>
                          <Input
                            id="employer_name"
                            name="employer_name"
                            value={formData.employer_name}
                            onChange={handleChange}
                            placeholder="Empresa XYZ"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="monthly_salary">Salario mensual</Label>
                          <Input
                            id="monthly_salary"
                            name="monthly_salary"
                            type="number"
                            value={formData.monthly_salary}
                            onChange={handleChange}
                            placeholder="2500"
                          />
                        </div>
                      </>
                    )}

                    {formData.income_type === 'monotributo' && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="monotributo_category">Categoría de Monotributo</Label>
                          <Input
                            id="monotributo_category"
                            name="monotributo_category"
                            value={formData.monotributo_category}
                            onChange={handleChange}
                            placeholder="Categoría"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="monthly_salary">Ingresos mensuales aproximados</Label>
                          <Input
                            id="monthly_salary"
                            name="monthly_salary"
                            type="number"
                            value={formData.monthly_salary}
                            onChange={handleChange}
                            placeholder="2500"
                          />
                        </div>
                      </>
                    )}

                    {formData.income_type === 'autonomo' && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="activity_name">Ramo de actividad</Label>
                          <Input
                            id="activity_name"
                            name="activity_name"
                            value={formData.activity_name}
                            onChange={handleChange}
                            placeholder="Consultor de IT"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="monthly_salary">Ingresos mensuales aproximados</Label>
                          <Input
                            id="monthly_salary"
                            name="monthly_salary"
                            type="number"
                            value={formData.monthly_salary}
                            onChange={handleChange}
                            placeholder="3000"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                {currentStep === 'contract' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="property_address">Dirección de la propiedad</Label>
                      <Input
                        id="property_address"
                        name="property_address"
                        value={formData.property_address}
                        onChange={handleChange}
                        placeholder="Calle Principal 123, Apartamento 4B"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="property_city">Ciudad</Label>
                      <Input
                        id="property_city"
                        name="property_city"
                        value={formData.property_city}
                        onChange={handleChange}
                        placeholder="Madrid"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="monthly_rent">Alquiler mensual</Label>
                      <Input
                        id="monthly_rent"
                        name="monthly_rent"
                        type="number"
                        value={formData.monthly_rent}
                        onChange={handleChange}
                        placeholder="1200"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contract_start_date">Fecha de inicio del contrato</Label>
                      <Input
                        id="contract_start_date"
                        name="contract_start_date"
                        type="date"
                        value={formData.contract_start_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                {currentStep === 'review' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-4">Datos del Inquilino</h3>
                      <div className="grid md:grid-cols-2 gap-4 bg-muted p-4 rounded">
                        <div>
                          <p className="text-sm text-muted-foreground">Nombre</p>
                          <p className="font-medium">{formData.tenant_full_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">DNI</p>
                          <p className="font-medium">{formData.tenant_dni}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{formData.tenant_email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Teléfono</p>
                          <p className="font-medium">{formData.tenant_phone || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-4">Información de Ingresos</h3>
                      <div className="grid md:grid-cols-2 gap-4 bg-muted p-4 rounded">
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de Ingreso</p>
                          <p className="font-medium">{formData.income_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                          <p className="font-medium">${formData.monthly_salary || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-4">Detalles del Contrato</h3>
                      <div className="grid md:grid-cols-2 gap-4 bg-muted p-4 rounded">
                        <div>
                          <p className="text-sm text-muted-foreground">Dirección</p>
                          <p className="font-medium">{formData.property_address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ciudad</p>
                          <p className="font-medium">{formData.property_city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Alquiler Mensual</p>
                          <p className="font-medium">${formData.monthly_rent}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Inicio del Contrato</p>
                          <p className="font-medium">{formData.contract_start_date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-destructive mb-6">{error}</p>}

              <div className="flex gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 'tenant'}
                >
                  Anterior
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSaving
                    ? 'Guardando...'
                    : currentStep === 'review'
                    ? 'Enviar Evaluación'
                    : 'Siguiente'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
