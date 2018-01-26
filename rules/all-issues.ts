import { message } from "danger"

export const hello = wrap("Hello from Peril", () => {
  message("Hello from Peril on your new issue.")
})
