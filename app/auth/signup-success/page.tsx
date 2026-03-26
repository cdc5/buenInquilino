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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">B</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold">BuenInquilino</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                ¡Cuenta creada exitosamente!
              </CardTitle>
              <CardDescription>Verifica tu correo electrónico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Te hemos enviado un correo de confirmación a tu dirección de email. 
                  Por favor, verifica tu cuenta haciendo clic en el enlace incluido en el mensaje.
                </p>
                <p className="text-sm text-muted-foreground">
                  Una vez confirmado, podrás iniciar sesión y comenzar a evaluar inquilinos.
                </p>
                <div className="pt-4">
                  <Link href="/auth/login" className="w-full block">
                    <Button className="w-full">Volver a iniciar sesión</Button>
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
