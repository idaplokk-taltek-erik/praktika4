export function decodeHTML(html: string): string {
	const textarea = document.createElement('textarea');
	textarea.innerHTML = html;
	return textarea.value;
}
