import { message } from "danger"
import { wrap } from "./_wrap"

export const hello = wrap("Hello from Peril", () => {
  message("Hello from Peril on your new issue.")
})
