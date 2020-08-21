import pdb from "./pdb"
import importStar from "./importStar"
import pipfileLock from "./pipfileLock"

export default async () => {
  pdb()
  await importStar()
  pipfileLock()
}
