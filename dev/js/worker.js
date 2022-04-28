self.addEventListener('install', event=>{
	console.log('Installing [Service Worker]',event);
	
	
	event.waitUntil(
	caches.open('static').then( cache =>{
		console.log('Precaching App Shell');
		cache.addAll([
			'/front.js',
			'/mixins.js',
			'/router.js',
			'/front.css',
			'/components.css',
			'/pages/login/login.page.js',
			'/pages/login/loginModel.js',
		]);
	})
	)
	
	
})
const enableNavigationPreload = async () => {
	if (self.registration.navigationPreload) {
		// Enable navigation preloads!
		await self.registration.navigationPreload.enable();
	}
};
self.addEventListener('activate', (event) => {
	event.waitUntil(enableNavigationPreload());
});


self.addEventListener('fetch', event => {
	console.log(event);
	event.respondWith(
	caches.match(event.request)
	.then(response => {
		console.log(response);
		if (response) {
			return response;
		} else {
			return fetch(event.request);
		}
	})
	);
});