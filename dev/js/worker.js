let cacheBD = 'staticV9';
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
			//	'/libs/G_G.js',
			//	'/front.js',
			//	'/mixins.js',
			//	'/router.js',
			//	'/front.css',
				//	'/components.css',
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
		
		let newR;
		
		if(request.url.match('localhost') || request.url.match('live-prepfuel') ){
			const newRequest = new Request(request, {
				credentials: "include"
			});
			newRequest['credentials'] = 'include';
			newR = newRequest;
		}else{
			newR = new Request(request);
		}
		let response =  await fetch(newR);
		
		let styles= `
			background: #1c1c1c 16px center no-repeat url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJDMTQuNDEgMiAxOCA1LjU5IDE4IDEwQzE4IDE0LjQxIDE0LjQxIDE4IDEwIDE4QzUuNTkgMTggMiAxNC40MSAyIDEwQzIgNS41OSA1LjU5IDIgMTAgMlpNMTAgMEM0LjQ4IDAgMCA0LjQ4IDAgMTBDMCAxNS41MiA0LjQ4IDIwIDEwIDIwQzE1LjUyIDIwIDIwIDE1LjUyIDIwIDEwQzIwIDQuNDggMTUuNTIgMCAxMCAwWiIgZmlsbD0iI0ZGNDY2NyIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KPHBhdGggZD0iTTkgMTFMOSA1QzkgNC40NSA5LjQ1IDQgMTAgNEMxMC41NSA0IDExIDQuNDUgMTEgNUwxMSAxMUMxMSAxMS41NSAxMC41NSAxMiAxMCAxMkM5LjQ1IDEyIDkgMTEuNTUgOSAxMVoiIGZpbGw9IiNGRjQ2NjciIGZpbGwtb3BhY2l0eT0iMC45Ii8+CjxyZWN0IHg9IjkiIHk9IjE0IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiByeD0iMSIgZmlsbD0iI0ZGNDY2NyIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KPC9zdmc+Cg==");
			background-size:20px;
			padding: 10px 10px 10px 50px;
			display: flex;
			border-left:2px solid #FF6F6F;color:rgba(255, 255, 255, 0.6);
		`;
		if(response.status == 404){
			if(response.url.indexOf('.jpg') > -1){
				console.log(`%c%s`,styles,`Image not found: ${response.url.substr(response.url.lastIndexOf('/')+1)}` );
			}
			return fetch(new Request('/', {method: 'GET'}));
		}
		if(response.status == 403){
			console.log('ss');
			if(response.url.indexOf('.jpg') > -1){
				console.log(`%c%s`,styles,`Server forbidden this image: ${response.url.substr(response.url.lastIndexOf('/')+1)}` );
			}
			return fetch(new Request('/', {method: 'GET'}));
		}
		if(response.status == 401){
			console.log(await response.json())
			console.log(`%c%s`,styles,`User not authorized for this action: ${response.url.substr(response.url.lastIndexOf('.co/')+3)}` );
			return fetch(new Request('/errors.json', {
				mode:'no-cors'
			}));
		}
		
		
		return response;
	}());
});