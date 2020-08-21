import viewFilesWereChanged from "./viewFilesWereChanged"
import podfileLock from "./podfileLock"
import leftTestShortcuts from "./leftTestShortcuts"

export default async () => {
  viewFilesWereChanged()
  podfileLock()
  await leftTestShortcuts()
}
