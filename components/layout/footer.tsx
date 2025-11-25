import { Facebook, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-calypso dark:bg-calypso/90 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Empresa */}
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-2">ALCONSTRUCCIONES SRL</h3>
            <p className="text-morning-glory text-xs sm:text-sm px-4">
              Construyendo sueños con calidad y compromiso
            </p>
          </div>

          {/* Redes Sociales */}
          <div className="flex gap-4">
            <a
              href="https://facebook.com/alconstrucciones"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-boston-blue hover:bg-calypso p-3 rounded-full transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://instagram.com/alconstrucciones"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-boston-blue hover:bg-calypso p-3 rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-white" />
            </a>
          </div>
        </div>

        <div className="border-t border-boston-blue mt-6 pt-6 text-center text-morning-glory text-sm">
          <p>
            &copy; {new Date().getFullYear()} ALCONSTRUCCIONES SRL. Todos los derechos reservados.
          </p>
          <p className="mt-2">
            Desarrollado por:{' '}
            <a
              href="https://botoncreativo.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-morning-glory hover:text-white transition-colors underline"
            >
              Botón Creativo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
