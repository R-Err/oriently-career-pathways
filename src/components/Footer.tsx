
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Chi siamo</h3>
            <p className="text-gray-400 leading-relaxed">
              Oriently è la piattaforma leader per l'orientamento professionale in Italia. 
              Ti aiutiamo a scoprire il percorso formativo più adatto alle tue aspirazioni.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contatti</h3>
            <p className="text-gray-400">
              Email: info@oriently.com
            </p>
            <p className="text-gray-400">
              Supporto: supporto@oriently.com
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors block">
                Termini di Servizio
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Oriently. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
