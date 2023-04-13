const toggleMute = (tabId) => {
	chrome.tabs.get(parseInt(tabId), async (tab) => {
		let muted = !tab.mutedInfo.muted;
		await chrome.tabs.update(parseInt(tabId), { muted });
	});
};

const prev = (tabId) => {
	const id = tabId.substring(2, tabId.length);

	chrome.scripting.executeScript({
		func: () => {
			document.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'P',
					keyCode: 80,
					which: 80,
					shiftKey: true,
					ctrlKey: false,
					metaKey: false,
				})
			);
		},
		target: {
			tabId: parseInt(id),
		},
	});
};

const up = (tabId) => {
	const id = tabId.substring(2, tabId.length);

	chrome.scripting
		.executeScript({
			func: () => {
				const video = document.getElementById('movie_player');
				video.setVolume(video.getVolume() + 2);
				return video.getVolume();
			},
			target: {
				tabId: parseInt(id),
			},
			world: 'MAIN',
		})
		.then((res) => {
			document.getElementById('vn:' + id).innerText = Math.round(res[0].result);
		});
};

const down = (tabId) => {
	const id = tabId.substring(2, tabId.length);

	chrome.scripting
		.executeScript({
			func: () => {
				const video = document.getElementById('movie_player');
				video.setVolume(video.getVolume() - 2);
				return video.getVolume();
			},
			target: {
				tabId: parseInt(id),
			},
			world: 'MAIN',
		})
		.then((res) => {
			document.getElementById('vn:' + id).innerText = Math.round(res[0].result);
		});
};

const next = (tabId) => {
	const id = tabId.substring(2, tabId.length);
	chrome.scripting.executeScript({
		func: () => {
			document.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'N',
					keyCode: 78,
					which: 78,
					shiftKey: true,
					ctrlKey: false,
					metaKey: false,
				})
			);
		},
		target: {
			tabId: parseInt(id),
		},
	});
};

const togglePlay = (tabId) => {
	const id = tabId.substring(2, tabId.length);

	chrome.scripting.executeScript({
		func: () => {
			document.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'k',
					keyCode: 75,
					code: 'KeyK',
					which: 75,
					shiftKey: false,
					ctrlKey: false,
					metaKey: false,
				})
			);
		},
		target: {
			tabId: parseInt(id),
		},
	});
};

const getHtml = (tab) => {
	const txt = `
	<div class="tab-item">
		<div class="tab-title">${tab.title}</div>
		<div class="button-container">
      <div class="youtube-controller">
      </div>
			<button title="mute/unmute" id="${tab.id}" type="button" class="mute-toggle control">&#9888;</button>
		</div>
	</div>`;
	return txt;
};

const getHtmlForYT = (tab, vol, prev = false) => {
	const txt = `
	<div class="tab-item youtube-item">
    <div style="display: flex; justify-content: space-between">
      <div class="tab-title">${tab.title}</div>
      <button title="mute/unmute" id="${tab.id}" type="button" class="mute-toggle control">&#9888;</button>
    </div>

    <div class="button-container">
      <div class="youtube-controller">
        <button title="prev" id="s:${tab.id}" type="button" class="control prev ${prev ? 'visible' : 'invisible'}">&#10094;</button>
        <button title="play/pause" id="p:${tab.id}" type="button" class="play-toggle control">&#9737;</button>
        <button title="next" id="n:${tab.id}" type="button" class="control next">&#10095;</button>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button title="volume down" id="d:${tab.id}" type="button" class="control volume-down">-</button>
        <div id="vn:${tab.id}">${vol}</div>
        <button title="volume up" id="u:${tab.id}" type="button" class="control volume-up">+</button>
      </div>
    </div>
  </div>`;
	return txt;
};

const tabsContainer = document.getElementById('tabs');

chrome.tabs.query({}, async function (tabs) {
	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i];
		if (!tab.url.includes('youtube.com/watch') && !tab.url.includes('youtube.com/shorts')) {
			tabsContainer.innerHTML += getHtml(tab);
			continue;
		}

		try {
			const res = await chrome.scripting.executeScript({
				func: () => {
					const video = document.getElementById('movie_player');
					return video.getVolume();
				},
				target: { tabId: tab.id },
				world: 'MAIN',
			});
			const vol = Math.round(res?.[0].result);

			if (tab.url.includes('list=')) {
				tabsContainer.innerHTML += getHtmlForYT(tab, vol, true);
			} else {
				tabsContainer.innerHTML += getHtmlForYT(tab, vol);
			}
		} catch (error) {
			console.log('err', error);
		}
	}

	const buttons = document.getElementsByClassName('mute-toggle');
	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];
		button.addEventListener('click', () => {
			toggleMute(button.id);
		});
	}

	const buttonsPlay = document.getElementsByClassName('play-toggle');
	for (let i = 0; i < buttonsPlay.length; i++) {
		const button = buttonsPlay[i];
		button.addEventListener('click', () => {
			togglePlay(button.id);
		});
	}

	const nextButtons = document.getElementsByClassName('next');
	for (let i = 0; i < nextButtons.length; i++) {
		const button = nextButtons[i];
		button.addEventListener('click', () => {
			next(button.id);
		});
	}

	const prevButtons = document.getElementsByClassName('prev');
	for (let i = 0; i < prevButtons.length; i++) {
		const button = prevButtons[i];
		button.addEventListener('click', () => {
			prev(button.id);
		});
	}

	const volumeUpButtons = document.getElementsByClassName('volume-up');
	for (let i = 0; i < volumeUpButtons.length; i++) {
		const button = volumeUpButtons[i];
		button.addEventListener('click', () => {
			up(button.id);
		});
	}

	const volumeDownButtons = document.getElementsByClassName('volume-down');
	for (let i = 0; i < volumeDownButtons.length; i++) {
		const button = volumeDownButtons[i];
		button.addEventListener('click', () => {
			down(button.id);
		});
	}
});
