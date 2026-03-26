'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Check, Star, FileText, User, Briefcase, FileCheck, CreditCard } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Dark Navy Background */}
      <section className="bg-[#1a2234] min-h-[90vh] px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#2a3344] rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-[#4eca8b] rounded-full" />
            <span className="text-white text-sm">Nuevo · Informes en 24 hs</span>
          </div>

          {/* Main headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Alquilá con</span>
            <br />
            <span className="text-[#4eca8b]">total confianza</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#8a94a6] text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
            Verificá a tu próximo inquilino antes de firmar. Analizamos ingresos, historial crediticio, antecedentes y reputación en un informe profesional.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-[#4eca8b] hover:bg-[#3db978] text-white px-8 py-6 text-lg rounded-lg">
                Evaluar un inquilino →
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#3a4456] bg-transparent text-white hover:bg-[#2a3344] px-8 py-6 text-lg rounded-lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Ver informe de ejemplo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-8 border-t border-[#2a3344]">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#4eca8b] border-2 border-[#1a2234] flex items-center justify-center text-white font-bold text-sm">MG</div>
              <div className="w-10 h-10 rounded-full bg-[#3b82f6] border-2 border-[#1a2234] flex items-center justify-center text-white font-bold text-sm">LP</div>
              <div className="w-10 h-10 rounded-full bg-[#f59e0b] border-2 border-[#1a2234] flex items-center justify-center text-white font-bold text-sm">AR</div>
              <div className="w-10 h-10 rounded-full bg-[#ec4899] border-2 border-[#1a2234] flex items-center justify-center text-white font-bold text-sm">CR</div>
            </div>
            <p className="text-[#8a94a6]">
              <span className="text-white font-bold">+3.400 propietarios</span> ya evaluaron a sus inquilinos con BuenInquilino este mes
            </p>
          </div>
        </div>
      </section>

      {/* Process Section - Cream Background */}
      <section className="bg-[#f5f3ee] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Label */}
          <p className="text-[#1a2234] text-sm font-semibold tracking-wider uppercase mb-4">
            PROCESO SIMPLE
          </p>
          
          {/* Section Title */}
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1a2234] mb-12">
            4 pasos. Menos de 10 minutos.
          </h2>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: User,
                number: 1,
                title: 'Datos del inquilino',
                description: 'Completá el nombre, DNI, datos de contacto y familiares a cargo que van a convivir en el inmueble.',
                bgColor: 'bg-[#1a2234]'
              },
              {
                icon: Briefcase,
                number: 2,
                title: 'Situación laboral',
                description: 'Subí el recibo de sueldo o indicá si es monotributista con la categoría. Opcional pero mejora el informe.',
                bgColor: 'bg-[#1a2234]'
              },
              {
                icon: FileCheck,
                number: 3,
                title: 'Contrato de locación',
                description: 'Adjuntá el contrato para que el análisis esté contextualizado al inmueble y el valor del alquiler.',
                bgColor: 'bg-[#1a2234]'
              },
              {
                icon: CreditCard,
                number: 4,
                title: 'Pago y resultado',
                description: 'Abonás $25.000 y en 24 hs recibís el informe completo en PDF listo para descargar.',
                bgColor: 'bg-[#4eca8b]'
              },
            ].map((step, i) => (
              <Card key={i} className="bg-white rounded-xl p-6 relative border-0 shadow-sm">
                {/* Step Number - positioned at top right */}
                <span className="absolute top-4 right-4 text-6xl font-serif text-[#e8e6e1] font-bold">
                  {step.number}
                </span>
                
                {/* Icon */}
                <div className={`w-12 h-12 ${step.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-[#1a2234] text-lg mb-2">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-[#5a6478] text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report Section - Dark Navy */}
      <section className="bg-[#1a2234] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Label */}
          <p className="text-[#4eca8b] text-sm font-semibold tracking-wider uppercase mb-4">
            INFORME DE EJEMPLO
          </p>
          
          {/* Section Title */}
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">
            Descargá una muestra gratuita
          </h2>
          
          {/* Subtitle */}
          <p className="text-[#8a94a6] text-lg mb-10 max-w-xl mx-auto">
            Mirá exactamente qué información incluye el informe antes de pagar. Sin registro, sin compromiso.
          </p>
          
          {/* CTA Button */}
          <Button size="lg" className="bg-[#4eca8b] hover:bg-[#3db978] text-white px-8 py-6 text-lg rounded-lg">
            <FileText className="w-5 h-5 mr-2" />
            Descargar PDF de muestra
          </Button>
        </div>
      </section>

      {/* Pricing Section - Cream Background */}
      <section className="bg-[#f5f3ee] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Label */}
          <p className="text-[#1a2234] text-sm font-semibold tracking-wider uppercase mb-4">
            PRECIO ÚNICO
          </p>
          
          {/* Section Title */}
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1a2234] mb-12">
            Sin suscripción. Pagás por informe.
          </h2>

          {/* Pricing Card */}
          <Card className="max-w-lg mx-auto bg-white rounded-2xl p-8 border-2 border-[#1a2234] shadow-lg">
            {/* Badge */}
            <div className="inline-block bg-[#e8f0fe] text-[#1a2234] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              INFORME COMPLETO
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-[#1a2234]">$25.000</span>
              <p className="text-[#5a6478] mt-2">pago único · por evaluación</p>
            </div>

            {/* Features List */}
            <ul className="text-left space-y-4 mb-8">
              {[
                'Verificación BCRA e historial crediticio',
                'Situación AFIP, ingresos y actividad laboral',
                'Antecedentes penales y judiciales',
                'Reputación entre locadores anteriores',
                'Análisis del ratio alquiler/ingreso',
                'Scoring con semáforo verde / amarillo / rojo',
                'PDF profesional descargable',
                'Entrega en menos de 24 horas hábiles',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#4eca8b] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1a2234]">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link href="/auth/signup" className="block">
              <Button size="lg" className="w-full bg-[#4eca8b] hover:bg-[#3db978] text-white py-6 text-lg rounded-lg">
                Empezar evaluación →
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Testimonials Section - Cream Background */}
      <section className="bg-[#f5f3ee] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Label */}
          <p className="text-[#1a2234] text-sm font-semibold tracking-wider uppercase mb-4">
            OPINIONES DE PROPIETARIOS
          </p>
          
          {/* Section Title */}
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1a2234] mb-12">
            Lo que dicen nuestros usuarios
          </h2>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                stars: 5,
                quote: '"Tuve una mala experiencia anterior con un inquilino que nunca pagó. Con BuenInquilino me sentí mucho más tranquila. El informe fue clarísimo y el scoring me ayudó a decidir al instante."',
                name: 'Marcela G.',
                role: 'Propietaria · Palermo, CABA',
                initials: 'MG',
                color: 'bg-[#3b82f6]'
              },
              {
                stars: 5,
                quote: '"Muy fácil de usar, en 5 minutos cargué todo. Al día siguiente tenía el PDF con un análisis súper detallado. Lo recomiendo a cualquier propietario que quiera evitar dolores de cabeza."',
                name: 'Roberto P.',
                role: 'Propietario · Córdoba Capital',
                initials: 'RP',
                color: 'bg-[#4eca8b]'
              },
              {
                stars: 4,
                quote: '"El informe es muy profesional. Me ayudó a negociar mejor las condiciones del contrato al ver que el inquilino tenía un ratio alquiler/ingreso algo justo. Muy buena herramienta."',
                name: 'Ana L.',
                role: 'Propietaria · Rosario, Santa Fe',
                initials: 'AL',
                color: 'bg-[#f59e0b]'
              },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-white rounded-xl p-6 border-0 shadow-sm">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star 
                      key={starIndex} 
                      className={`w-5 h-5 ${starIndex < testimonial.stars ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#e8e6e1]'}`} 
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-[#1a2234] italic mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[#1a2234]">{testimonial.name}</p>
                    <p className="text-[#5a6478] text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Dark Navy */}
      <section className="bg-[#1a2234] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">
            ¿Listo para alquilar con confianza?
          </h2>
          <p className="text-[#8a94a6] text-lg mb-10 max-w-xl mx-auto">
            Comenzá ahora y recibí tu informe en menos de 24 horas hábiles.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-[#4eca8b] hover:bg-[#3db978] text-white px-10 py-6 text-lg rounded-lg">
              Empezar evaluación →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2234] border-t border-[#2a3344] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">BuenInquilino</h3>
              <p className="text-[#8a94a6] text-sm">
                Evaluación de inquilinos de confianza para propietarios en Argentina.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#8a94a6] hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#" className="text-[#8a94a6] hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="text-[#8a94a6] hover:text-white transition-colors">Ejemplo de informe</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#8a94a6] hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="text-[#8a94a6] hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="text-[#8a94a6] hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#8a94a6] hover:text-white transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="text-[#8a94a6] hover:text-white transition-colors">Política de privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2a3344] pt-8 text-center text-[#8a94a6] text-sm">
            <p>© 2026 BuenInquilino. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
