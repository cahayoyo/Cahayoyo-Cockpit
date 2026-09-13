import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { applyAuthCookies } from '$lib/server/auth-cookies';

export const POST = async (event) => {
	const response = await auth.api.signOut({
		headers: event.request.headers,
		asResponse: true
	});

	applyAuthCookies(event.cookies, response);
	redirect(303, '/login');
};
