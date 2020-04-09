// SETTINGS
const CHECK_INTERVAL = 500
const RELOAD_ACTIVE_TABS = true


function filesInDirectory(dir) {

	return new Promise((resolve) =>
		dir.createReader().readEntries((entries) =>

			Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>
				e.isDirectory
					? filesInDirectory(e)
					: new Promise(resolve => e.file(resolve))
			))
			.then(files => [].concat(...files))
			.then(resolve)
		)
	)

}


function timestampForFilesInDirectory(dir) {
	return filesInDirectory(dir).then((files) => {
		return files.map(f => f.name + f.lastModifiedDate).join()
	})
}


function reload() {
	if (!RELOAD_ACTIVE_TABS) {
		chrome.runtime.reload()
		return
	}

	chrome.tabs.query({active: true}, (tabs) => {
		tabs.forEach((tab) => {
			chrome.tabs.reload(tab.id)
		})
		chrome.runtime.reload()
	})
}


function watchChanges(dir, lastTimestamp) {

	timestampForFilesInDirectory(dir).then((timestamp) => {
		if (!lastTimestamp || (lastTimestamp === timestamp)) {

			setTimeout(() => {
				watchChanges(dir, timestamp)
			}, CHECK_INTERVAL)

		} else {
			reload()
		}
	})

}


// start
chrome.management.getSelf((self) => {
	if (self.installType === 'development') {
		chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir))
	}
})
