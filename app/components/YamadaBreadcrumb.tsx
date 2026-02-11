interface YamadaBreadcrumbProps {
  storeName?: string
}

export default function YamadaBreadcrumb({ storeName = "ヤマダデンキ" }: YamadaBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <a href="/" className="hover:text-red-600">
        ホーム
      </a>
      <span className="w-4 h-4">›</span>
      <span className="text-gray-900 font-bold">{storeName}</span>
    </nav>
  )
}
