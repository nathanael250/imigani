import { FaWhatsapp } from 'react-icons/fa6'

const whatsappNumber = '250785118003'

function FloatingWhatsApp() {
  return (
    <a
      className="floating-whatsapp"
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with IMIGANI on WhatsApp"
    >
      <FaWhatsapp aria-hidden="true" />
      <span>Chat on WhatsApp</span>
    </a>
  )
}

export default FloatingWhatsApp
