let cacheBD = 'staticV1';
self.addEventListener('install', event=>{
	console.log('Installed');
	event.waitUntil(self.skipWaiting())
	event.waitUntil(
		caches.open(cacheBD).then( cache =>{
			return cache.addAll([
				'/index.html',
				'/fonts/Poppins-Bold.ttf',
				'/fonts/Poppins-Medium.ttf',
				'/fonts/Poppins-Regular.ttf',
				'/fonts/Poppins-Semibold.ttf',
				'/fonts/Roboto-Black.ttf',
				'/fonts/roboto-bold.woff2',
				'/fonts/Roboto-Medium.ttf',
				'/fonts/roboto-regular.woff2',
				'/fonts/roboto-semibold.woff2',
			//	'/libs/G.js',
			//	'/libs/G_Bus.js',
			//	'/libs/G_Control.js',
				'/libs/G_G.js',
			//	'/front.js',
			//	'/mixins.js',
			//	'/router.js',
		//		'/front.css',
		//			'/components.css',
			//	'/pages/login/login.page.js',
			//	'/pages/login/loginModel.js',
			]);
		}),
	)
})

self.addEventListener('activate', (event) => {
	let cacheKeeplist = [cacheBD];
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
			if (cacheKeeplist.indexOf(key) === -1) {
				return caches.delete(key);
				}
			}));
		})
	);
});
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', event => {
	event.respondWith(async function() {
		const cachedResponse = await caches.match(event.request);
		if (cachedResponse) return cachedResponse;
		let request = event.request;
		const newRequest = new Request(request, {
	
			credentials: "include"
		});
		newRequest['credentials'] = 'include';
		return fetch(newRequest);
	}());
});