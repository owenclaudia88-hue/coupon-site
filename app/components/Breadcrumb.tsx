interface BreadcrumbProps {
  storeName?: string
}

export default function Breadcrumb({ storeName = "Elgiganten" }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <a href="/" className="hover:text-green-600">
        Hem
      </a>
      <span className="w-4 h-4">›</span>
      <span className="text-gray-900 font-bold">{storeName}</span>
    </nav>
  )
}
