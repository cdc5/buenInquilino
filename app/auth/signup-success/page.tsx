import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#f5f3ee]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#1a2234] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">B</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#1a2234]">BuenInquilino</h1>
            </Link>
          </div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1a2234]">
                ¡Cuenta creada exitosamente!
              </CardTitle>
              <CardDescription>Verifica tu correo electrónico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-[#5a6478]">
                  Te hemos enviado un correo de confirmación a tu dirección de email. 
                  Por favor, verifica tu cuenta haciendo clic en el enlace incluido en el mensaje.
                </p>
                <p className="text-sm text-[#5a6478]">
                  Una vez confirmado, podrás iniciar sesión y comenzar a evaluar inquilinos.
                </p>
                <div className="pt-4">
                  <Link href="/auth/login" className="w-full block">
                    <Button className="w-full bg-[#4eca8b] hover:bg-[#3db978] text-white">
                      Volver a iniciar sesión
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
