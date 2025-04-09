import { NextResponse } from 'next/server';

export const config = {
  matcher: '/((?!csp|_next|static|favicon).*)',
};

const middleware = (): Promise<NextResponse> => {
  console.info('Next Middleware was called');

  return Promise.resolve(NextResponse.next());
};

export default middleware;