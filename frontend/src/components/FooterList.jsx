import { Link } from 'react-router-dom'

function FooterList({ title, items }) {
  return (
    <div>
      <h3 className="footer-heading">{title}</h3>
      <ul className="mt-5 space-y-3 text-[15px] font-medium text-[#5e6b63]">
        {items.map((item) => (
          <li key={item.label || item}>
            {item.href ? (
              <Link to={item.href} className="transition hover:text-[#b98531]">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#5e6b63]">{item.label || item}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterList
