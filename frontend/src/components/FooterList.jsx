import { Link } from 'react-router-dom'

function FooterList({ title, items }) {
  return (
    <div>
      <h3 className="text-[14px] font-bold text-[#18361d] sm:text-[16px]">{title}</h3>
      <ul className="mt-5 space-y-3 text-[12px] font-medium leading-[1.55] text-[#5e6b63] sm:text-[15px]">
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
