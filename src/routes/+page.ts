// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;
import { redirect } from '@sveltejs/kit';

export function load() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      throw redirect(302, '/home');  // Redirect to your desired page
    }
  }
}
