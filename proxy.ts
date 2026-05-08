import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow login page and static files
  if (pathname === '/login') {
    return NextResponse.next({ request })
  }

  // Check for auth cookie
  const auth = request.cookies.get('hj_auth')?.value

  if (!auth || auth !== 'true') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}