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
import { User, Briefcase, FileCheck, CreditCard, Check } from 'lucide-react'

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
      <div className="flex h-screen items-center justify-center bg-[#f5f3ee]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4eca8b]" />
      </div>
    )
  }

  const stepperItems = [
    { key: 'tenant', label: 'Datos del Inquilino', icon: User },
    { key: 'income', label: 'Situación Laboral', icon: Briefcase },
    { key: 'contract', label: 'Contrato', icon: FileCheck },
    { key: 'review', label: 'Pago y Resultado', icon: CreditCard },
  ]

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
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-[#2a3344] hover:text-white">
                Volver al dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {stepperItems.map((item, index) => {
              const StepIcon = item.icon
              const isActive = currentStep === item.key
              const isPast = stepperItems.findIndex(s => s.key === currentStep) > index

              return (
                <div key={item.key} className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        isActive
                          ? 'bg-[#4eca8b] text-white'
                          : isPast
                          ? 'bg-[#1a2234] text-white'
                          : 'bg-white text-[#5a6478] border-2 border-[#e8e6e1]'
                      }`}
                    >
                      {isPast ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    {index < stepperItems.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          isPast ? 'bg-[#1a2234]' : 'bg-[#e8e6e1]'
                        }`}
                      />
                    )}
                  </div>
                  <p className={`text-xs mt-2 text-center ${isActive ? 'text-[#1a2234] font-semibold' : 'text-[#5a6478]'}`}>
                    {item.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-[#e8e6e1]">
            <CardTitle className="text-[#1a2234] font-serif text-2xl">
              {stepperItems.find(s => s.key === currentStep)?.label}
            </CardTitle>
            <CardDescription>
              Paso {stepperItems.findIndex(s => s.key === currentStep) + 1} de {stepperItems.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 mb-8">
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
                        className="border-[#e8e6e1]"
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
                        className="border-[#e8e6e1]"
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
                        className="border-[#e8e6e1]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tenant_phone">Teléfono</Label>
                      <Input
                        id="tenant_phone"
                        name="tenant_phone"
                        value={formData.tenant_phone}
                        onChange={handleChange}
                        placeholder="+54 11 1234-5678"
                        className="border-[#e8e6e1]"
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
                        className="flex h-10 w-full rounded-md border border-[#e8e6e1] bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4eca8b] focus-visible:ring-offset-2"
                        required
                      >
                        <option value="relacion">Relación de dependencia</option>
                        <option value="monotributo">Monotributo</option>
                        <option value="autonomo">Autónomo</option>
                        <option value="sin">Sin ingresos declarados</option>
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
                            placeholder="Empresa XYZ S.A."
                            className="border-[#e8e6e1]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="monthly_salary">Salario mensual (ARS)</Label>
                          <Input
                            id="monthly_salary"
                            name="monthly_salary"
                            type="number"
                            value={formData.monthly_salary}
                            onChange={handleChange}
                            placeholder="500000"
                            className="border-[#e8e6e1]"
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
                            placeholder="Categoría A, B, C..."
                            className="border-[#e8e6e1]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="monthly_salary">Ingresos mensuales aproximados (ARS)</Label>
                          <Input
                            id="monthly_salary"
                            name="monthly_salary"
                            type="number"
                            value={formData.monthly_salary}
                            onChange={handleChange}
                            placeholder="400000"
                            className="border-[#e8e6e1]"
                          />
                        </div>
                      </>
                    )}

                    {formData.income_type === 'autonomo' && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="activity_name">Rubro de actividad</Label>
                          <Input
                            id="activity_name"
                            name="activity_name"
                            value={formData.activity_name}
                            onChange={handleChange}
                            placeholder="Consultor IT, Abogado, etc."
                            className="border-[#e8e6e1]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="monthly_salary">Ingresos mensuales aproximados (ARS)</Label>
                          <Input
                            id="monthly_salary"
                            name="monthly_salary"
                            type="number"
                            value={formData.monthly_salary}
                            onChange={handleChange}
                            placeholder="600000"
                            className="border-[#e8e6e1]"
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
                        placeholder="Av. Corrientes 1234, Piso 5 Dto B"
                        required
                        className="border-[#e8e6e1]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="property_city">Ciudad</Label>
                      <Input
                        id="property_city"
                        name="property_city"
                        value={formData.property_city}
                        onChange={handleChange}
                        placeholder="CABA"
                        required
                        className="border-[#e8e6e1]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="monthly_rent">Alquiler mensual (ARS)</Label>
                      <Input
                        id="monthly_rent"
                        name="monthly_rent"
                        type="number"
                        value={formData.monthly_rent}
                        onChange={handleChange}
                        placeholder="250000"
                        required
                        className="border-[#e8e6e1]"
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
                        className="border-[#e8e6e1]"
                      />
                    </div>
                  </>
                )}

                {currentStep === 'review' && (
                  <div className="space-y-6">
                    <div className="bg-[#e8f0fe] border border-[#1a2234]/20 rounded-lg p-4 mb-6">
                      <p className="text-[#1a2234] font-semibold">Precio: $25.000</p>
                      <p className="text-sm text-[#5a6478]">Pago único por evaluación. Recibirás el informe en menos de 24 horas hábiles.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#1a2234] mb-4">Datos del Inquilino</h3>
                      <div className="grid md:grid-cols-2 gap-4 bg-[#f5f3ee] p-4 rounded-lg">
                        <div>
                          <p className="text-sm text-[#5a6478]">Nombre</p>
                          <p className="font-medium text-[#1a2234]">{formData.tenant_full_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a6478]">DNI</p>
                          <p className="font-medium text-[#1a2234]">{formData.tenant_dni}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a6478]">Email</p>
                          <p className="font-medium text-[#1a2234]">{formData.tenant_email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a6478]">Teléfono</p>
                          <p className="font-medium text-[#1a2234]">{formData.tenant_phone || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#1a2234] mb-4">Información de Ingresos</h3>
                      <div className="grid md:grid-cols-2 gap-4 bg-[#f5f3ee] p-4 rounded-lg">
                        <div>
                          <p className="text-sm text-[#5a6478]">Tipo de Ingreso</p>
                          <p className="font-medium text-[#1a2234] capitalize">{formData.income_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a6478]">Ingresos Mensuales</p>
                          <p className="font-medium text-[#1a2234]">${formData.monthly_salary || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#1a2234] mb-4">Detalles del Contrato</h3>
                      <div className="grid md:grid-cols-2 gap-4 bg-[#f5f3ee] p-4 rounded-lg">
                        <div>
                          <p className="text-sm text-[#5a6478]">Dirección</p>
                          <p className="font-medium text-[#1a2234]">{formData.property_address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a6478]">Ciudad</p>
                          <p className="font-medium text-[#1a2234]">{formData.property_city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a6478]">Alquiler Mensual</p>
                          <p className="font-medium text-[#1a2234]">${formData.monthly_rent}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a6478]">Inicio del Contrato</p>
                          <p className="font-medium text-[#1a2234]">{formData.contract_start_date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-500 mb-6">{error}</p>}

              <div className="flex gap-4 justify-between pt-4 border-t border-[#e8e6e1]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 'tenant'}
                  className="border-[#1a2234] text-[#1a2234] hover:bg-[#1a2234] hover:text-white"
                >
                  Anterior
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#4eca8b] hover:bg-[#3db978] text-white px-8"
                >
                  {isSaving
                    ? 'Procesando...'
                    : currentStep === 'review'
                    ? 'Confirmar y Pagar $25.000'
                    : 'Siguiente →'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
