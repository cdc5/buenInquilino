'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline">BuenInquilino</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Inicia sesión</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Regístrate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">
            Toma decisiones inteligentes sobre tus inquilinos
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            BuenInquilino te proporciona una evaluación completa y confiable de tus potenciales inquilinos. 
            Acceso a antecedentes, estabilidad financiera y referencias en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Comenzar evaluación
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Ver demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Características principales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Evaluación Integral',
                description: 'Cuestionario detallado que cubre antecedentes, ingresos y referencias de inquilinos',
              },
              {
                title: 'Puntuación Automática',
                description: 'Sistema de calificación transparente basado en múltiples criterios de evaluación',
              },
              {
                title: 'Datos Seguros',
                description: 'Protección de datos de grado empresarial con encriptación end-to-end',
              },
              {
                title: 'Historial Completo',
                description: 'Acceso a un historial detallado de todas las evaluaciones realizadas',
              },
              {
                title: 'Reportes Claros',
                description: 'Reportes visuales y detallados de cada evaluación de inquilino',
              },
              {
                title: 'Soporte Rápido',
                description: 'Equipo de soporte disponible para responder tus preguntas',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-background rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Cómo funciona
          </h2>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Crea tu cuenta',
                description: 'Regístrate con tu correo y contraseña. Verifica tu identidad en menos de 2 minutos.',
              },
              {
                step: 2,
                title: 'Inicia una evaluación',
                description: 'Completa el formulario con la información del inquilino potencial.',
              },
              {
                step: 3,
                title: 'Obtén tu informe',
                description: 'Recibe una evaluación completa con puntuación y recomendaciones.',
              },
              {
                step: 4,
                title: 'Toma tu decisión',
                description: 'Usa los resultados para tomar la mejor decisión sobre tu propiedad.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Listo para encontrar el inquilino perfecto?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Únete a cientos de propietarios que ya confían en BuenInquilino
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Comienza ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">BuenInquilino</h3>
              <p className="text-muted-foreground text-sm">
                Evaluación de inquilinos de confianza
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Precios
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2026 BuenInquilino. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
