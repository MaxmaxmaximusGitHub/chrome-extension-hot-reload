// SETTINGS
const CHECK_FILE_CHANGES_INTERVAL = 5000
const RELOAD_ACTIVE_TABS = true


const filesInDirectory = dir => new Promise(resolve =>
	dir.createReader().readEntries(entries =>

		Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>
			e.isDirectory
				? filesInDirectory(e)
				: new Promise(resolve => e.file(resolve))
		))
		.then(files => [].concat(...files))
		.then(resolve)
	)
)


const timestampForFilesInDirectory = (dir) => {
	return filesInDirectory(dir).then(files => {
		return files.map(f => f.name + f.lastModifiedDate).join()
	})
}


const reload = () => {
	if (!RELOAD_ACTIVE_TABS) {
		chrome.runtime.reload()
		return
	}

	chrome.tabs.query({active: true}, (tabs) => {
		tabs.forEach(tab => {
			chrome.tabs.reload(tab.id)
		})
		chrome.runtime.reload()
	})
}



const watchChanges = (dir, lastTimestamp) => {

	timestampForFilesInDirectory(dir).then(timestamp => {
		if (!lastTimestamp || (lastTimestamp === timestamp)) {

			setTimeout(() => {
				watchChanges(dir, timestamp)
			}, CHECK_FILE_CHANGES_INTERVAL)

		} else {
			reload()
		}
	})

}


chrome.management.getSelf(self => {
	if (self.installType === 'development') {
		chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir))
	}
})